'use client';

import { useState } from 'react';
import { Lock, Tag, X, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CartSummaryProps {
  subtotal: number;
  itemCount: number;
  discountAmount: number;
  couponCode: string;
  onCouponChange: (code: string) => void;
  onApplyCoupon: () => Promise<void>;
  onCheckout: () => Promise<void>;
  isLoading?: boolean;
  couponError?: string;
  appliedCoupon?: string | null;
  onRemoveCoupon: () => void;
}

export function CartSummary({
  subtotal,
  itemCount,
  discountAmount,
  couponCode,
  onCouponChange,
  onApplyCoupon,
  onCheckout,
  isLoading = false,
  couponError,
  appliedCoupon,
  onRemoveCoupon,
}: CartSummaryProps) {
  const [isApplying, setIsApplying] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Calculate fees (5% platform fee)
  const platformFee = Math.round(subtotal * 0.05 * 100) / 100;
  const total = subtotal - discountAmount + platformFee;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsApplying(true);
    setLocalError(null);
    
    try {
      await onApplyCoupon();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Erreur lors de l\'application du code');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="rounded-[20px] border border-[#E8ECE6] p-6 bg-white sticky top-24">
      <h2 className="font-semibold text-lg text-[#2C2420] mb-6">
        Récapitulatif
      </h2>

      {/* Coupon Section */}
      <div className="mb-6">
        {appliedCoupon ? (
          <div className="flex items-center justify-between bg-[#E8F5E9] rounded-[10px] px-3 py-2">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#1B7A3E]" />
              <span className="text-sm font-medium text-[#1B7A3E]">
                {appliedCoupon}
              </span>
            </div>
            <button
              onClick={onRemoveCoupon}
              className="text-[#8C8279] hover:text-[#B71C1C] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8279]" />
                <Input
                  value={couponCode}
                  onChange={(e) => onCouponChange(e.target.value.toUpperCase())}
                  placeholder="Code promo"
                  className="pl-10 h-11 rounded-[10px] border-[#E8ECE6] focus:border-[#1B7A3E] uppercase"
                />
              </div>
              <Button
                onClick={handleApplyCoupon}
                disabled={!couponCode.trim() || isApplying}
                variant="outline"
                className="h-11 px-4 rounded-[10px] border-[#1B7A3E] text-[#1B7A3E] hover:bg-[#E8F5E9] disabled:opacity-50"
              >
                {isApplying ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Appliquer'
                )}
              </Button>
            </div>
            {(couponError || localError) && (
              <p className="text-xs text-[#B71C1C]">{couponError || localError}</p>
            )}
          </div>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-[#8C8279]">
            Sous-total ({itemCount} article{itemCount > 1 ? 's' : ''})
          </span>
          <span className="font-medium text-[#2C2420]">
            {subtotal.toLocaleString()} FCFA
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between">
            <span className="text-[#1B7A3E]">Réduction</span>
            <span className="font-medium text-[#1B7A3E]">
              -{discountAmount.toLocaleString()} FCFA
            </span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-[#8C8279]">Frais de plateforme (5%)</span>
          <span className="font-medium text-[#2C2420]">
            {platformFee.toLocaleString()} FCFA
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-[#8C8279]">Livraison</span>
          <span className="font-medium text-[#1B7A3E]">
            Gratuite
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#E8ECE6] my-4" />

      {/* Total */}
      <div className="flex justify-between items-center mb-6">
        <span className="font-semibold text-[#2C2420]">Total</span>
        <span className="font-bold text-2xl text-[#1B7A3E]">
          {total.toLocaleString()} FCFA
        </span>
      </div>

      {/* Checkout Button */}
      <Button
        onClick={onCheckout}
        disabled={isLoading}
        className="w-full h-12 rounded-[12px] bg-[#1B7A3E] hover:bg-[#0F4D27] text-white font-semibold text-base transition-colors"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Traitement...
          </>
        ) : (
          'Commander'
        )}
      </Button>

      {/* Security Note */}
      <div className="flex items-center justify-center gap-2 mt-4 text-[#8C8279]">
        <Lock className="w-3.5 h-3.5" />
        <span className="text-xs">Paiement sécurisé</span>
      </div>
    </div>
  );
}
