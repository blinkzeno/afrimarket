'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { X, Star } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import type { Category, ProductFilters } from '@/lib/types/catalog';

interface FilterSidebarClientProps {
  categories: Category[];
  initialFilters: ProductFilters;
  priceRange: { min: number; max: number };
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function FilterSidebarClient({
  categories,
  initialFilters,
  priceRange,
}: FilterSidebarClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Build current filters from URL
  const filters: ProductFilters = {
    categoryId: searchParams.get('category') || undefined,
    minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
    maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
    minRating: searchParams.get('minRating') ? parseInt(searchParams.get('minRating')!) : undefined,
    inStock: searchParams.get('inStock') === 'true',
    onSale: searchParams.get('onSale') === 'true',
    sortBy: (searchParams.get('sort') as ProductFilters['sortBy']) || initialFilters.sortBy || 'newest',
  };

  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Update params based on new filters
    if (newFilters.categoryId !== undefined) {
      if (newFilters.categoryId) {
        params.set('category', newFilters.categoryId);
      } else {
        params.delete('category');
      }
    }

    if (newFilters.minPrice !== undefined) {
      if (newFilters.minPrice !== priceRange.min) {
        params.set('minPrice', newFilters.minPrice.toString());
      } else {
        params.delete('minPrice');
      }
    }

    if (newFilters.maxPrice !== undefined) {
      if (newFilters.maxPrice !== priceRange.max) {
        params.set('maxPrice', newFilters.maxPrice.toString());
      } else {
        params.delete('maxPrice');
      }
    }

    if (newFilters.minRating !== undefined) {
      if (newFilters.minRating) {
        params.set('minRating', newFilters.minRating.toString());
      } else {
        params.delete('minRating');
      }
    }

    if (newFilters.inStock !== undefined) {
      if (newFilters.inStock) {
        params.set('inStock', 'true');
      } else {
        params.delete('inStock');
      }
    }

    if (newFilters.onSale !== undefined) {
      if (newFilters.onSale) {
        params.set('onSale', 'true');
      } else {
        params.delete('onSale');
      }
    }

    // Reset page when filters change
    params.delete('page');

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const hasActiveFilters =
    filters.categoryId ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.minRating ||
    filters.inStock ||
    filters.onSale;

  const activeFilterCount = [
    filters.categoryId,
    (filters.minPrice !== undefined || filters.maxPrice !== undefined) &&
      (filters.minPrice !== priceRange.min || filters.maxPrice !== priceRange.max),
    filters.minRating,
    filters.inStock,
    filters.onSale,
  ].filter(Boolean).length;

  const currentMinPrice = filters.minPrice ?? priceRange.min;
  const currentMaxPrice = filters.maxPrice ?? priceRange.max;

  const clearFilters = () => {
    const params = new URLSearchParams();
    // Keep sort if exists
    if (filters.sortBy && filters.sortBy !== 'newest') {
      params.set('sort', filters.sortBy);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-medium text-warm-5">Filtres</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-warm-4 hover:text-primary-600 flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            Réinitialiser
          </button>
        )}
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.categoryId && (
            <FilterChip
              label={categories.find((c) => c.id === filters.categoryId)?.name || 'Catégorie'}
              onRemove={() => updateFilters({ categoryId: undefined })}
            />
          )}
          {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
            <FilterChip
              label={`${formatPrice(currentMinPrice)} - ${formatPrice(currentMaxPrice)}`}
              onRemove={() => updateFilters({ minPrice: undefined, maxPrice: undefined })}
            />
          )}
          {filters.minRating && (
            <FilterChip
              label={`${filters.minRating}+ étoiles`}
              onRemove={() => updateFilters({ minRating: undefined })}
            />
          )}
          {filters.inStock && (
            <FilterChip
              label="En stock"
              onRemove={() => updateFilters({ inStock: false })}
            />
          )}
          {filters.onSale && (
            <FilterChip
              label="En promo"
              onRemove={() => updateFilters({ onSale: false })}
            />
          )}
        </div>
      )}

      {/* Categories */}
      <div className="border-t border-warm-2 pt-4">
        <h3 className="font-medium text-sm text-warm-5 mb-3">Catégories</h3>
        <div className="space-y-2 max-h-[200px] overflow-y-auto">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <Checkbox
                checked={filters.categoryId === category.id}
                onCheckedChange={() =>
                  updateFilters({
                    categoryId: filters.categoryId === category.id ? undefined : category.id,
                  })
                }
                className="border-warm-3 data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500"
              />
              <span className="text-sm text-warm-5 group-hover:text-primary-600 transition-colors">
                {category.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="border-t border-warm-2 pt-4">
        <h3 className="font-medium text-sm text-warm-5 mb-4">Fourchette de prix</h3>
        <div className="px-2">
          <Slider
            value={[currentMinPrice, currentMaxPrice]}
            min={priceRange.min}
            max={priceRange.max}
            step={1000}
            onValueChange={(value) => {
              updateFilters({ minPrice: value[0], maxPrice: value[1] });
            }}
            className="mb-4"
          />
          <div className="flex items-center justify-between text-sm text-warm-4">
            <span>{formatPrice(currentMinPrice)}</span>
            <span>{formatPrice(currentMaxPrice)}</span>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="border-t border-warm-2 pt-4">
        <h3 className="font-medium text-sm text-warm-5 mb-3">Note minimum</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() =>
                updateFilters({
                  minRating: filters.minRating === rating ? undefined : rating,
                })
              }
              className={`flex items-center gap-2 w-full text-left transition-colors ${
                filters.minRating === rating ? 'text-primary-600' : 'text-warm-5 hover:text-primary-600'
              }`}
            >
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-warm-3'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm">et plus</span>
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="border-t border-warm-2 pt-4">
        <h3 className="font-medium text-sm text-warm-5 mb-3">Options</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer group">
            <Checkbox
              checked={filters.inStock}
              onCheckedChange={(checked: boolean | 'indeterminate') =>
                updateFilters({ inStock: checked === true })
              }
              className="border-warm-3 data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500"
            />
            <span className="text-sm text-warm-5 group-hover:text-primary-600 transition-colors">
              En stock uniquement
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <Checkbox
              checked={filters.onSale}
              onCheckedChange={(checked: boolean | 'indeterminate') =>
                updateFilters({ onSale: checked === true })
              }
              className="border-warm-3 data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500"
            />
            <span className="text-sm text-warm-5 group-hover:text-primary-600 transition-colors">
              En promotion
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-50 border border-primary-200 text-sm text-primary-700">
      {label}
      <button onClick={onRemove} className="ml-1 hover:text-primary-900">
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
