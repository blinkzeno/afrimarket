'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/types/catalog';
import { useCartStore } from '@/store/cartStore';

interface ProductCarouselProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export function ProductCarousel({ products, title, subtitle }: ProductCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const addItem = useCartStore((state) => state.addItem);

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', checkScroll);
      return () => carousel.removeEventListener('scroll', checkScroll);
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 320;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const toggleFavorite = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: product.images?.[0] || '',
      seller_id: product.shopId,
      seller_name: product.shop?.name ?? '',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const calculateDiscount = (price: number, comparePrice: number) => {
    if (!comparePrice || comparePrice <= price) return null;
    return Math.round(((comparePrice - price) / comparePrice) * 100);
  };

  if (!products.length) return null;

  return (
    <div className="w-full">
      {/* Header */}
      {(title || subtitle) && (
        <div className="flex items-end justify-between mb-6">
          <div>
            {title && <h2 className="font-serif text-2xl sm:text-3xl text-warm-5">{title}</h2>}
            {subtitle && <p className="text-sm text-warm-4 mt-1">{subtitle}</p>}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="w-10 h-10 rounded-full border border-warm-2 bg-white flex items-center justify-center transition-all hover:border-primary-300 hover:bg-primary-50 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5 text-warm-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="w-10 h-10 rounded-full border border-warm-2 bg-white flex items-center justify-center transition-all hover:border-primary-300 hover:bg-primary-50 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5 text-warm-5" />
            </button>
          </div>
        </div>
      )}

      {/* Carousel */}
      <div
        ref={carouselRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 -mx-4 px-4"
      >
        {products.map((product) => {
          const discount = calculateDiscount(product.price, product.compareAtPrice || 0);
          const isFavorite = favorites.has(product.id);
          const primaryImage = product.images?.[0] || '';

          return (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="flex-shrink-0 w-[280px] sm:w-[300px] group"
            >
              <div className="bg-white rounded-xl border border-warm-2 overflow-hidden transition-shadow hover:shadow-lg">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-warm-1">
                  {primaryImage ? (
                    <Image
                      src={primaryImage}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="300px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-warm-4">
                      No image
                    </div>
                  )}

                  {/* Discount Badge */}
                  {discount && discount > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      -{discount}%
                    </span>
                  )}

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => toggleFavorite(e, product.id)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-white hover:scale-110"
                  >
                    <Heart
                      className={`h-4 w-4 transition-colors ${
                        isFavorite ? 'fill-red-500 text-red-500' : 'text-warm-4'
                      }`}
                    />
                  </button>

                  {/* Add to Cart Button */}
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center opacity-0 translate-y-2 transition-all group-hover:opacity-100 group-hover:translate-y-0 hover:bg-primary-600"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Shop */}
                  <p className="text-xs text-warm-4 mb-1 truncate">{product.shop?.name}</p>

                  {/* Name */}
                  <h3 className="font-medium text-warm-5 mb-2 line-clamp-2 min-h-[2.5rem]">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                    <span className="text-xs text-warm-4">({product.reviewCount})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-warm-5">
                      {formatPrice(product.price)}
                    </span>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <span className="text-sm text-warm-4 line-through">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
