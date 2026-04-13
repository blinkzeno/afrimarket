-- Migration: Create orders, order_items, coupons tables and decrement_stock function
-- Created for AfriMarket checkout system

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Coupons table
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10, 2) NOT NULL CHECK (discount_value >= 0),
    min_order_amount DECIMAL(10, 2) DEFAULT 0,
    max_discount_amount DECIMAL(10, 2) DEFAULT NULL,
    usage_limit INTEGER DEFAULT NULL,
    usage_count INTEGER DEFAULT 0,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method VARCHAR(50) DEFAULT NULL,
    
    -- Financial breakdown
    subtotal DECIMAL(12, 2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(12, 2) DEFAULT 0,
    platform_fee DECIMAL(12, 2) DEFAULT 0,
    referral_fee DECIMAL(12, 2) DEFAULT 0,
    delivery_fee DECIMAL(12, 2) DEFAULT 0,
    total DECIMAL(12, 2) NOT NULL DEFAULT 0,
    
    -- Coupon info
    coupon_id UUID REFERENCES public.coupons(id) ON DELETE SET NULL,
    coupon_code VARCHAR(50) DEFAULT NULL,
    
    -- Delivery info
    delivery_address JSONB NOT NULL,
    delivery_notes TEXT DEFAULT NULL,
    
    -- Referral tracking
    referrer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Tracking
    tracking_number VARCHAR(100) DEFAULT NULL,
    shipped_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    delivered_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    
    -- Snapshot of product info at time of order (security)
    product_name VARCHAR(255) NOT NULL,
    product_price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    
    -- Seller info for commission tracking
    seller_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE RESTRICT,
    
    -- Calculated fields
    subtotal DECIMAL(12, 2) GENERATED ALWAYS AS (product_price * quantity) STORED,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders"
    ON public.orders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
    ON public.orders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending orders"
    ON public.orders FOR UPDATE
    USING (auth.uid() = user_id);

-- RLS Policies for order_items
CREATE POLICY "Users can view their own order items"
    ON public.order_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create order items for their orders"
    ON public.order_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

-- RLS Policies for coupons (public read for active coupons)
CREATE POLICY "Anyone can view active coupons"
    ON public.coupons FOR SELECT
    USING (is_active = TRUE);

-- Function to atomically decrement stock
CREATE OR REPLACE FUNCTION public.decrement_stock(
    p_product_id UUID,
    p_quantity INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_current_stock INTEGER;
BEGIN
    -- Get current stock with row lock
    SELECT stock_quantity INTO v_current_stock
    FROM public.products
    WHERE id = p_product_id
    FOR UPDATE;
    
    -- Check if stock is sufficient
    IF v_current_stock IS NULL THEN
        RAISE EXCEPTION 'Product not found: %', p_product_id;
    END IF;
    
    IF v_current_stock < p_quantity THEN
        RAISE EXCEPTION 'Stock insuffisant pour le produit % (disponible: %, demandé: %)', 
            p_product_id, v_current_stock, p_quantity;
    END IF;
    
    -- Decrement stock
    UPDATE public.products
    SET stock_quantity = stock_quantity - p_quantity,
        updated_at = NOW()
    WHERE id = p_product_id;
    
    RETURN TRUE;
END;
$$;

-- Function to validate and apply coupon
CREATE OR REPLACE FUNCTION public.validate_coupon(
    p_code VARCHAR,
    p_order_amount DECIMAL
)
RETURNS TABLE (
    valid BOOLEAN,
    coupon_id UUID,
    discount_amount DECIMAL,
    message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_coupon RECORD;
    v_discount DECIMAL;
BEGIN
    -- Find coupon
    SELECT * INTO v_coupon
    FROM public.coupons
    WHERE code = UPPER(TRIM(p_code))
      AND is_active = TRUE;
    
    -- Check if coupon exists
    IF v_coupon IS NULL THEN
        RETURN QUERY SELECT FALSE, NULL::UUID, 0::DECIMAL, 'Code promo invalide'::TEXT;
        RETURN;
    END IF;
    
    -- Check validity period
    IF v_coupon.valid_from > NOW() THEN
        RETURN QUERY SELECT FALSE, NULL::UUID, 0::DECIMAL, 'Code promo non encore actif'::TEXT;
        RETURN;
    END IF;
    
    IF v_coupon.valid_until IS NOT NULL AND v_coupon.valid_until < NOW() THEN
        RETURN QUERY SELECT FALSE, NULL::UUID, 0::DECIMAL, 'Code promo expiré'::TEXT;
        RETURN;
    END IF;
    
    -- Check usage limit
    IF v_coupon.usage_limit IS NOT NULL AND v_coupon.usage_count >= v_coupon.usage_limit THEN
        RETURN QUERY SELECT FALSE, NULL::UUID, 0::DECIMAL, 'Code promo épuisé'::TEXT;
        RETURN;
    END IF;
    
    -- Check minimum order amount
    IF p_order_amount < v_coupon.min_order_amount THEN
        RETURN QUERY SELECT FALSE, NULL::UUID, 0::DECIMAL, 
            format('Montant minimum de commande: %s', v_coupon.min_order_amount)::TEXT;
        RETURN;
    END IF;
    
    -- Calculate discount
    IF v_coupon.discount_type = 'percentage' THEN
        v_discount := p_order_amount * (v_coupon.discount_value / 100);
        -- Apply max discount if set
        IF v_coupon.max_discount_amount IS NOT NULL AND v_discount > v_coupon.max_discount_amount THEN
            v_discount := v_coupon.max_discount_amount;
        END IF;
    ELSE
        v_discount := v_coupon.discount_value;
    END IF;
    
    RETURN QUERY SELECT TRUE, v_coupon.id, v_discount, 'OK'::TEXT;
END;
$$;

-- Trigger to update coupon usage count
CREATE OR REPLACE FUNCTION public.increment_coupon_usage()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.coupon_id IS NOT NULL THEN
        UPDATE public.coupons
        SET usage_count = usage_count + 1,
            updated_at = NOW()
        WHERE id = NEW.coupon_id;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_increment_coupon_usage
    AFTER INSERT ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.increment_coupon_usage();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_coupons_updated_at
    BEFORE UPDATE ON public.coupons
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.decrement_stock(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.decrement_stock(UUID, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION public.validate_coupon(VARCHAR, DECIMAL) TO authenticated;
GRANT EXECUTE ON FUNCTION public.validate_coupon(VARCHAR, DECIMAL) TO service_role;
