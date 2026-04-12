'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/types/catalog';
import { useCartStore } from '@/store/cartStore';

interface ProductCardProps {
  product: Product;
}

function formatPrice(price: number, currency: string = 'XOF'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function calculateDiscount(price: number, compareAtPrice?: number): number | null {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const discount = calculateDiscount(product.price, product.compareAtPrice);
  const imageUrl = product.images?.[0] || '/placeholder-product.png';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      image_url: imageUrl,
      quantity: 1,
      seller_id: product.shopId,
      seller_name: product.shop?.name,
    });
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block rounded-[16px] bg-white cursor-pointer overflow-hidden transition-all duration-200 ease-out hover:-translate-y-[3px]"
      style={{
        boxShadow:
          '0 0 0 1px rgba(44,36,32,0.05), 0 2px 8px rgba(44,36,32,0.06), 0 8px 16px rgba(44,36,32,0.08)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-300 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
        />

        {/* Discount Badge */}
        {discount && (
          <div className="absolute top-2 left-2 bg-[#E8572A] text-white text-[10px] font-bold rounded px-2 py-0.5">
            -{discount}%
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleLike}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center transition-all hover:bg-white hover:scale-110 shadow-sm"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isLiked ? 'fill-red-500 text-red-500' : 'text-warm-4'
            }`}
          />
        </button>

        {/* Quick Add Button - Shows on hover */}
        <div
          className={`absolute bottom-3 right-3 transition-all duration-200 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <Button
            size="icon"
            className="h-9 w-9 rounded-full bg-primary-500 hover:bg-primary-600 text-white shadow-lg"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Shop name */}
        {product.shop && (
          <p className="text-xs text-warm-4 mb-1 truncate">{product.shop.name}</p>
        )}

        {/* Product name */}
        <h3 className="text-sm font-medium text-warm-5 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <Star className="h-3 w-3 fill-gold-500 text-gold-500" />
            <span className="text-xs text-warm-4">
              {product.rating.toFixed(1)} ({product.reviewCount})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <span className="font-bold text-primary-600">
            {formatPrice(product.price, product.currency)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-xs text-warm-4 line-through">
              {formatPrice(product.compareAtPrice, product.currency)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
