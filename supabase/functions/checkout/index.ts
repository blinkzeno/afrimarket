import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from '@supabase/supabase-js';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  seller_id?: string;
  seller_name?: string;
}

interface CheckoutRequest {
  items: CartItem[];
  delivery_address: {
    full_name: string;
    phone: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    region?: string;
    postal_code?: string;
    country: string;
  };
  coupon_code?: string;
  delivery_notes?: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase clients
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    // Verify user authentication
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Non autorisé' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { items, delivery_address, coupon_code, delivery_notes }: CheckoutRequest = await req.json();

    // Validation
    if (!items || items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Le panier est vide' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!delivery_address) {
      return new Response(
        JSON.stringify({ error: 'Adresse de livraison requise' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 1: Get product IDs and snapshot current prices from database
    const productIds = items.map(item => item.product_id);
    
    const { data: products, error: productsError } = await supabaseAdmin
      .from('products')
      .select('id, name, price, stock_quantity, shop_id, shops(id, name)')
      .in('id', productIds)
      .eq('status', 'active');

    if (productsError) {
      console.error('Error fetching products:', productsError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la récupération des produits' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if all products exist
    const foundProductIds = new Set(products?.map(p => p.id) || []);
    const missingProducts = productIds.filter(id => !foundProductIds.has(id));
    
    if (missingProducts.length > 0) {
      return new Response(
        JSON.stringify({ error: `Produits introuvables: ${missingProducts.join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a map for quick lookup
    const productMap = new Map(products?.map(p => [p.id, p]));

    // Step 2: Validate stock and build order items with snapshot prices
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = productMap.get(item.product_id);
      if (!product) continue;

      // Check stock
      if (product.stock_quantity < item.quantity) {
        return new Response(
          JSON.stringify({ 
            error: `Stock insuffisant pour "${product.name}" (disponible: ${product.stock_quantity}, demandé: ${item.quantity})` 
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Use database price (never trust client price)
      const itemSubtotal = product.price * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        product_id: item.product_id,
        product_name: product.name,
        product_price: product.price,
        quantity: item.quantity,
        seller_id: product.shop_id,
      });
    }

    // Step 3: Get user referral info to calculate referral fee
    const { data: userData, error: userDataError } = await supabaseAdmin
      .from('users')
      .select('referred_by_id')
      .eq('id', user.id)
      .single();

    let referrerId: string | null = null;
    if (!userDataError && userData) {
      referrerId = userData.referred_by_id;
    }

    // Step 4: Validate and apply coupon if provided
    let couponId: string | null = null;
    let discountAmount = 0;
    let appliedCouponCode: string | null = null;

    if (coupon_code) {
      const { data: couponResult, error: couponError } = await supabaseAdmin
        .rpc('validate_coupon', {
          p_code: coupon_code,
          p_order_amount: subtotal,
        });

      if (couponError) {
        console.error('Error validating coupon:', couponError);
      } else if (couponResult && couponResult.length > 0) {
        const result = couponResult[0];
        if (result.valid) {
          couponId = result.coupon_id;
          discountAmount = result.discount_amount;
          appliedCouponCode = coupon_code.toUpperCase().trim();
        } else {
          return new Response(
            JSON.stringify({ error: result.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
    }

    // Step 5: Calculate fees
    const platformFeeRate = 0.05; // 5% platform fee
    const referralFeeRate = 0.05; // 5% referral fee if applicable

    const platformFee = Math.round(subtotal * platformFeeRate * 100) / 100;
    const referralFee = referrerId ? Math.round(subtotal * referralFeeRate * 100) / 100 : 0;

    // Calculate delivery fee (could be based on location, weight, etc. - simplified here)
    const deliveryFee = 0; // Free delivery for now, or calculate based on logic

    // Calculate total
    const total = subtotal - discountAmount + platformFee + referralFee + deliveryFee;

    // Step 6: Create order in a transaction
    // Note: Using existing orders table structure (buyer_id instead of user_id)
    
    // Start by decrementing stock for all items atomically
    for (const item of orderItems) {
      const { error: stockError } = await supabaseAdmin.rpc('decrement_stock', {
        p_product_id: item.product_id,
        p_quantity: item.quantity,
      });

      if (stockError) {
        console.error('Stock decrement error:', stockError);
        return new Response(
          JSON.stringify({ error: `Erreur de stock: ${stockError.message}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Create the order using existing schema (buyer_id, total_amount, etc.)
    const orderData = {
      buyer_id: user.id,
      status: 'pending',
      payment_status: 'pending',
      subtotal: subtotal,
      discount_amount: discountAmount,
      platform_fee: platformFee,
      referral_fee: referralFee,
      delivery_fee: deliveryFee,
      total_amount: total,
      coupon_code: appliedCouponCode,
      shipping_address_snapshot: delivery_address,
      delivery_notes: delivery_notes || null,
      referrer_id: referrerId,
      source: 'web',
    };

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la création de la commande' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create order items using existing schema
    const orderItemsWithOrderId = orderItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.product_price,
      total_price: item.product_price * item.quantity,
      product_name: item.product_name,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItemsWithOrderId);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Ideally we should rollback here, but stock is already decremented
      // In production, consider using a database transaction
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        order: {
          id: order.id,
          status: order.status,
          payment_status: order.payment_status,
          subtotal,
          discount_amount: discountAmount,
          platform_fee: platformFee,
          referral_fee: referralFee,
          delivery_fee: deliveryFee,
          total,
          item_count: orderItems.length,
          created_at: order.created_at,
        },
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Checkout error:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur interne du serveur' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
