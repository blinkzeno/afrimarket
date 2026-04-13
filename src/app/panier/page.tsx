'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useCartStore } from '@/store/cartStore';
import { createClient } from '@/lib/supabase/client';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { EmptyCart } from '@/components/cart/EmptyCart';
import { Button } from '@/components/ui/button';
import type { CheckoutResponse } from '@/lib/types/orders';

export default function CartPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const { items, itemCount, total, updateQuantity, removeItem, clearCart } = useCartStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Calculate subtotal from cart store
  const subtotal = total();
  const count = itemCount();

  // Handle quantity update
  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    updateQuantity(productId, quantity);
    // Recalculate discount if coupon is applied
    if (appliedCoupon) {
      validateAndApplyCoupon(appliedCoupon, quantity);
    }
  };

  // Handle item removal
  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
    toast.success('Article retiré du panier');
    // Recalculate discount if coupon is applied
    if (appliedCoupon && useCartStore.getState().itemCount() > 0) {
      validateAndApplyCoupon(appliedCoupon);
    } else if (appliedCoupon) {
      // Clear coupon if cart is empty
      handleRemoveCoupon();
    }
  };

  // Validate and apply coupon
  const validateAndApplyCoupon = async (code: string, _quantity?: number) => {
    setCouponError(null);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setCouponError('Veuillez vous connecter pour utiliser un code promo');
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/validate_coupon`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          },
          body: JSON.stringify({
            p_code: code.toUpperCase().trim(),
            p_order_amount: subtotal,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la validation du code');
      }

      const result = await response.json();
      
      if (Array.isArray(result) && result.length > 0) {
        const validation = result[0];
        if (validation.valid) {
          setAppliedCoupon(code.toUpperCase().trim());
          setDiscountAmount(validation.discount_amount);
          toast.success('Code promo appliqué !');
        } else {
          setCouponError(validation.message || 'Code promo invalide');
        }
      } else {
        setCouponError('Code promo invalide');
      }
    } catch (error) {
      console.error('Coupon validation error:', error);
      setCouponError('Erreur lors de la validation du code');
    }
  };

  // Handle apply coupon button
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    await validateAndApplyCoupon(couponCode);
  };

  // Handle remove coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCode('');
    setCouponError(null);
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error('Votre panier est vide');
      return;
    }

    setIsLoading(true);

    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Veuillez vous connecter pour passer commande');
        router.push('/login?redirect=/cart');
        return;
      }

      // Prepare checkout request
      const checkoutData = {
        items: items.map(item => ({
          product_id: item.product_id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          seller_id: item.seller_id,
        })),
        delivery_address: {
          full_name: session.user.user_metadata?.full_name || '',
          phone: session.user.user_metadata?.phone || '',
          address_line1: '',
          city: '',
          country: 'Sénégal',
        },
        coupon_code: appliedCoupon || undefined,
      };

      // Call Edge Function
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(checkoutData),
        }
      );

      const result: CheckoutResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la commande');
      }

      if (result.success && result.order) {
        // Clear cart
        clearCart();
        
        // Show success message
        toast.success('Commande créée avec succès !', {
          description: `N° de commande: ${result.order.id.slice(0, 8)}...`,
        });

        // Redirect to order confirmation page
        router.push(`/dashboard/orders/${result.order.id}`);
      } else {
        throw new Error(result.error || 'Erreur inconnue');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la commande');
    } finally {
      setIsLoading(false);
    }
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/products">
              <Button variant="ghost" size="icon-sm" className="text-[#8C8279]">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-[#2C2420]">Mon panier</h1>
          </div>

          <EmptyCart />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/products">
            <Button variant="ghost" size="icon-sm" className="text-[#8C8279] hover:text-[#2C2420]">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-[#2C2420]">Mon panier</h1>
          <span className="text-[#8C8279] text-sm">
            ({count} article{count > 1 ? 's' : ''})
          </span>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          {/* Cart Items - Left Side */}
          <div className="order-2 lg:order-1">
            <div className="space-y-0">
              {items.map((item, index) => (
                <div key={item.product_id}>
                  <CartItem
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                  />
                  {/* Dashed separator between items */}
                  {index < items.length - 1 && (
                    <div 
                      className="border-t border-dashed border-[#F0EDE8] mx-2"
                      style={{ borderWidth: '1px' }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="mt-8">
              <Link href="/products">
                <Button 
                  variant="outline" 
                  className="h-11 px-6 rounded-[10px] border-[#E8ECE6] text-[#8C8279] hover:text-[#2C2420] hover:border-[#2C2420]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Continuer mes achats
                </Button>
              </Link>
            </div>
          </div>

          {/* Summary - Right Side (Sticky on Desktop) */}
          <div className="order-1 lg:order-2">
            <CartSummary
              subtotal={subtotal}
              itemCount={count}
              discountAmount={discountAmount}
              couponCode={couponCode}
              onCouponChange={setCouponCode}
              onApplyCoupon={handleApplyCoupon}
              onCheckout={handleCheckout}
              isLoading={isLoading}
              couponError={couponError || undefined}
              appliedCoupon={appliedCoupon}
              onRemoveCoupon={handleRemoveCoupon}
            />

            {/* Mobile Info Note */}
            <div className="lg:hidden mt-4 p-4 bg-[#F5F2EE] rounded-[12px] flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#8C8279] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#8C8279]">
                Les frais de livraison seront calculés lors de la finalisation de la commande. 
                Vous pourrez ajouter votre adresse de livraison complète à l&apos;étape suivante.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
