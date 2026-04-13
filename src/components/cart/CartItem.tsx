'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CartItem as CartItemType } from '@/store/cartStore';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(item.product_id);
    }, 200);
  };

  // Mobile swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    const currentX = e.touches[0].clientX;
    const diff = touchStartX - currentX;
    
    // Only allow left swipe (negative offset)
    if (diff > 0 && diff < 100) {
      setSwipeOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    if (swipeOffset > 60) {
      // Reveal delete action
      setSwipeOffset(80);
    } else {
      setSwipeOffset(0);
    }
  };

  return (
    <div 
      className="relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Delete action background (visible on swipe) */}
      <div 
        className="absolute inset-0 flex items-center justify-end bg-[#B71C1C] rounded-[12px] transition-opacity"
        style={{ opacity: swipeOffset > 30 ? 1 : 0 }}
      >
        <button
          onClick={handleRemove}
          className="flex items-center gap-2 px-6 text-white font-medium"
        >
          <Trash2 className="w-5 h-5" />
          <span className="hidden sm:inline">Supprimer</span>
        </button>
      </div>

      {/* Main cart item row */}
      <div
        className={`
          relative flex items-center gap-4 py-4 px-2
          transition-all duration-200 ease-out
          hover:bg-[#F5F2EE] rounded-[12px]
          ${isRemoving ? 'opacity-0 -translate-x-full' : 'opacity-100'}
        `}
        style={{ 
          transform: `translateX(-${swipeOffset}px)`,
          touchAction: 'pan-y pinch-zoom'
        }}
      >
        {/* Product Image */}
        <div className="relative w-20 h-20 flex-shrink-0 rounded-[12px] overflow-hidden bg-[#F5F2EE]">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#C5C0BB]">
              <svg 
                className="w-8 h-8" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-[#2C2420] text-sm sm:text-base truncate">
            {item.name}
          </h3>
          {item.seller_name && (
            <p className="text-xs text-[#8C8279] mt-0.5">
              {item.seller_name}
            </p>
          )}
          <p className="text-sm font-semibold text-[#1B7A3E] mt-1">
            {item.price.toLocaleString()} FCFA
          </p>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="outline"
            size="icon-xs"
            onClick={() => onUpdateQuantity(item.product_id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="h-7 w-7 sm:h-8 sm:w-8 rounded-[8px] border-[#E8ECE6] hover:border-[#1B7A3E] hover:text-[#1B7A3E]"
          >
            <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>
          
          <span className="w-8 text-center font-medium text-sm text-[#2C2420]">
            {item.quantity}
          </span>
          
          <Button
            variant="outline"
            size="icon-xs"
            onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1)}
            className="h-7 w-7 sm:h-8 sm:w-8 rounded-[8px] border-[#E8ECE6] hover:border-[#1B7A3E] hover:text-[#1B7A3E]"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>
        </div>

        {/* Price & Delete (Desktop) */}
        <div className="hidden sm:flex items-center gap-4">
          <p className="font-semibold text-[#2C2420] text-base min-w-[100px] text-right">
            {(item.price * item.quantity).toLocaleString()} FCFA
          </p>
          
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleRemove}
            className="text-[#8C8279] hover:text-[#B71C1C] hover:bg-[#B71C1C]/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Mobile Price */}
        <div className="sm:hidden text-right">
          <p className="font-semibold text-[#2C2420] text-sm">
            {(item.price * item.quantity).toLocaleString()} FCFA
          </p>
        </div>
      </div>
    </div>
  );
}
