export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method?: string;
  subtotal: number;
  discount_amount: number;
  platform_fee: number;
  referral_fee: number;
  delivery_fee: number;
  total: number;
  coupon_id?: string;
  coupon_code?: string;
  delivery_address: DeliveryAddress;
  delivery_notes?: string;
  referrer_id?: string;
  tracking_number?: string;
  shipped_at?: string;
  delivered_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DeliveryAddress {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  region?: string;
  postal_code?: string;
  country: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  seller_id: string;
  subtotal: number;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_discount_amount?: number;
  usage_limit?: number;
  usage_count: number;
  valid_from: string;
  valid_until?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CheckoutResponse {
  success: boolean;
  order?: {
    id: string;
    status: string;
    payment_status: string;
    subtotal: number;
    discount_amount: number;
    platform_fee: number;
    referral_fee: number;
    delivery_fee: number;
    total: number;
    item_count: number;
    created_at: string;
  };
  error?: string;
}
