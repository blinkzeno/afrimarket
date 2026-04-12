'use client';

import { useState } from 'react';
import { X, Star, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import type { Category, ProductFilters } from '@/lib/types/catalog';

interface FilterSidebarProps {
  categories: Category[];
  filters: ProductFilters;
  onFilterChange: (filters: ProductFilters) => void;
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

export function FilterSidebar({
  categories,
  filters,
  onFilterChange,
  priceRange,
}: FilterSidebarProps) {
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([
    filters.minPrice ?? priceRange.min,
    filters.maxPrice ?? priceRange.max,
  ]);

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

  const handleCategoryChange = (categoryId: string | undefined) => {
    onFilterChange({ ...filters, categoryId });
  };

  const handlePriceChange = (value: [number, number]) => {
    setLocalPriceRange(value);
  };

  const handlePriceCommit = () => {
    onFilterChange({
      ...filters,
      minPrice: localPriceRange[0] !== priceRange.min ? localPriceRange[0] : undefined,
      maxPrice: localPriceRange[1] !== priceRange.max ? localPriceRange[1] : undefined,
    });
  };

  const handleRatingChange = (rating: number | undefined) => {
    onFilterChange({ ...filters, minRating: rating });
  };

  const handleToggleChange = (key: 'inStock' | 'onSale', value: boolean) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setLocalPriceRange([priceRange.min, priceRange.max]);
    onFilterChange({
      sortBy: filters.sortBy,
    });
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
              onRemove={() => handleCategoryChange(undefined)}
            />
          )}
          {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
            <FilterChip
              label={`${formatPrice(localPriceRange[0])} - ${formatPrice(localPriceRange[1])}`}
              onRemove={() => {
                setLocalPriceRange([priceRange.min, priceRange.max]);
                onFilterChange({ ...filters, minPrice: undefined, maxPrice: undefined });
              }}
            />
          )}
          {filters.minRating && (
            <FilterChip
              label={`${filters.minRating}+ étoiles`}
              onRemove={() => handleRatingChange(undefined)}
            />
          )}
          {filters.inStock && (
            <FilterChip
              label="En stock"
              onRemove={() => handleToggleChange('inStock', false)}
            />
          )}
          {filters.onSale && (
            <FilterChip
              label="En promo"
              onRemove={() => handleToggleChange('onSale', false)}
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
                  handleCategoryChange(
                    filters.categoryId === category.id ? undefined : category.id
                  )
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
            value={localPriceRange}
            min={priceRange.min}
            max={priceRange.max}
            step={1000}
            onValueChange={handlePriceChange}
            onValueCommit={handlePriceCommit}
            className="mb-4"
          />
          <div className="flex items-center justify-between text-sm text-warm-4">
            <span>{formatPrice(localPriceRange[0])}</span>
            <span>{formatPrice(localPriceRange[1])}</span>
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
                handleRatingChange(filters.minRating === rating ? undefined : rating)
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
                      i < rating ? 'fill-gold-500 text-gold-500' : 'text-warm-3'
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
              onCheckedChange={(checked: boolean | 'indeterminate') => handleToggleChange('inStock', checked === true)}
              className="border-warm-3 data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500"
            />
            <span className="text-sm text-warm-5 group-hover:text-primary-600 transition-colors">
              En stock uniquement
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <Checkbox
              checked={filters.onSale}
              onCheckedChange={(checked: boolean | 'indeterminate') => handleToggleChange('onSale', checked === true)}
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
      <button
        onClick={onRemove}
        className="ml-1 hover:text-primary-900"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
