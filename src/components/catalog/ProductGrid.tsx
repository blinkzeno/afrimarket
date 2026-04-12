'use client';

import type { Product } from '@/lib/types/catalog';
import { ProductCard } from './ProductCard';
import { SkeletonGrid } from './SkeletonCard';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  skeletonCount?: number;
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  isLoading = false,
  skeletonCount = 10,
  emptyMessage = 'Aucun produit trouvé',
}: ProductGridProps) {
  if (isLoading) {
    return <SkeletonGrid count={skeletonCount} />;
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 rounded-full bg-warm-1 flex items-center justify-center mb-4">
          <svg
            className="w-12 h-12 text-warm-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-warm-5 mb-2">{emptyMessage}</h3>
        <p className="text-sm text-warm-4 max-w-sm">
          Essayez de modifier vos filtres ou revenez plus tard pour découvrir nos nouveautés.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
