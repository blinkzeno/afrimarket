'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  ShoppingBasket,
  Shirt,
  Smartphone,
  Sparkles,
  Palette,
  Home,
  Activity,
  Grid3X3,
} from 'lucide-react';
import type { Category } from '@/lib/types/catalog';

interface CategoryPillsProps {
  categories: Category[];
  activeCategoryId?: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'shopping-basket': ShoppingBasket,
  'shirt': Shirt,
  'smartphone': Smartphone,
  'sparkles': Sparkles,
  'palette': Palette,
  'home': Home,
  'activity': Activity,
  'grid': Grid3X3,
};

function getIcon(iconName: string) {
  return iconMap[iconName] || ShoppingBasket;
}

export function CategoryPills({ categories, activeCategoryId }: CategoryPillsProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="w-full">
      {/* Desktop/Tablet: Grid layout | Mobile: Horizontal scroll with arrows */}
      <div className="relative">
        {/* Navigation arrows - visible on mobile/tablet when scrollable */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur shadow-md flex items-center justify-center lg:hidden hover:bg-white transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4 text-warm-5" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur shadow-md flex items-center justify-center lg:hidden hover:bg-white transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4 text-warm-5" />
        </button>

        {/* Categories container */}
        <div
          ref={scrollRef}
          className="
            flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide py-4 px-1
            lg:flex-wrap lg:justify-center lg:overflow-visible
          "
        >
          {categories.map((category) => {
            const Icon = getIcon(category.iconName);
            const isActive = category.id === activeCategoryId;
            const isHovered = hoveredId === category.id;

            return (
              <Link
                key={category.id}
                href={`/explorer?category=${category.id}`}
                className="flex flex-col items-center gap-2 min-w-[64px] sm:min-w-[72px] group flex-shrink-0"
                onMouseEnter={() => setHoveredId(category.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div
                  className={`
                    w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center
                    transition-all duration-200 ease-out
                    ${isActive ? 'ring-2 ring-primary-500 ring-offset-2' : ''}
                    ${isHovered ? 'scale-110' : 'scale-100'}
                  `}
                  style={{ backgroundColor: category.color + '20' }}
                >
                  <span style={{ color: category.color }}>
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                  </span>
                </div>
                <span
                  className={`
                    text-xs font-medium text-center transition-colors max-w-[72px] leading-tight
                    ${isActive ? 'text-primary-600' : 'text-warm-5'}
                    group-hover:text-primary-600
                  `}
                >
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
