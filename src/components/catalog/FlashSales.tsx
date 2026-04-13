'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { Product } from '@/lib/types/catalog';
import { ProductCard } from './ProductCard';
import { SkeletonGrid } from './SkeletonCard';

interface FlashSalesProps {
  products: Product[];
  isLoading?: boolean;
  endTime?: Date;
}

function formatTimeValue(value: number): string {
  return value.toString().padStart(2, '0');
}

function CountdownTimer({ endTime }: { endTime: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = endTime.getTime();
      const diff = Math.max(0, end - now);

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <div className="flex items-center gap-2">
      <TimeBlock value={timeLeft.hours} />
      <span className="text-[#E8572A] font-bold">:</span>
      <TimeBlock value={timeLeft.minutes} />
      <span className="text-[#E8572A] font-bold">:</span>
      <TimeBlock value={timeLeft.seconds} />
    </div>
  );
}

function TimeBlock({ value }: { value: number }) {
  return (
    <div className="w-10 h-10 rounded-lg bg-[#E8572A] flex items-center justify-center">
      <span className="text-white font-bold text-lg">
        {formatTimeValue(value)}
      </span>
    </div>
  );
}

export function FlashSales({ products, isLoading, endTime }: FlashSalesProps) {
  // Default end time to 24 hours from now if not provided
  const defaultEndTime = endTime || new Date(Date.now() + 24 * 60 * 60 * 1000);

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="font-serif text-2xl text-warm-5">Ventes Flash</h2>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-[#E8572A]/20 animate-pulse" />
              <span className="text-warm-4">:</span>
              <div className="w-10 h-10 rounded-lg bg-[#E8572A]/20 animate-pulse" />
              <span className="text-warm-4">:</span>
              <div className="w-10 h-10 rounded-lg bg-[#E8572A]/20 animate-pulse" />
            </div>
          </div>
        </div>
        <SkeletonGrid count={6} />
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 flex-wrap">
          <h2 className="font-serif text-2xl text-warm-5">Ventes Flash</h2>
          <CountdownTimer endTime={defaultEndTime} />
        </div>
        <Link
          href="/explorer?onSale=true"
          className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          Voir tout
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Horizontal scroll container */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
        {products.map((product) => (
          <div key={product.id} className="min-w-[200px] w-[200px] sm:min-w-[220px] sm:w-[220px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
