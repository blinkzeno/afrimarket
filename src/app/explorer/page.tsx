import { Suspense } from 'react';
import { Metadata } from 'next';
import { getProducts, getCategories, getFlashSales } from '@/lib/queries/products';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { FilterSidebarClient } from '@/components/catalog/FilterSidebarClient';
import { CategoryPills } from '@/components/catalog/CategoryPills';
import { FlashSales } from '@/components/catalog/FlashSales';
import { SkeletonGrid } from '@/components/catalog/SkeletonCard';
import type { ProductFilters } from '@/lib/types/catalog';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Explorer — AfriMarket',
  description: 'Découvrez tous les produits africains disponibles sur AfriMarket. Filtrez par catégorie, prix, et plus encore.',
};

interface ExplorerPageProps {
  searchParams: Promise<{
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    minRating?: string;
    inStock?: string;
    onSale?: string;
    q?: string;
    page?: string;
    sort?: string;
  }>;
}

const PRICE_RANGE = { min: 0, max: 1000000 }; // XOF

export default async function ExplorerPage({ searchParams }: ExplorerPageProps) {
  const params = await searchParams;

  // Parse filters from URL
  const filters: ProductFilters = {
    categoryId: params.category,
    minPrice: params.minPrice ? parseInt(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseInt(params.maxPrice) : undefined,
    minRating: params.minRating ? parseInt(params.minRating) : undefined,
    inStock: params.inStock === 'true',
    onSale: params.onSale === 'true',
    sortBy: (params.sort as ProductFilters['sortBy']) || 'newest',
  };

  const page = parseInt(params.page || '0');

  // Fetch data in parallel
  const [productsData, categories, flashSales] = await Promise.all([
    getProducts(filters, page),
    getCategories(),
    getFlashSales(),
  ]);

  const { data: products } = productsData;

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header Section */}
      <div className="bg-white border-b border-[#E8ECE6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-serif text-3xl sm:text-4xl text-[#2C2420] mb-2">
            Explorer
          </h1>
          <p className="text-[#6B6159]">
            Découvrez nos produits authentiques
          </p>
        </div>
      </div>

      {/* Flash Sales Section */}
      {flashSales.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <FlashSales products={flashSales} />
        </div>
      )}

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <CategoryPills categories={categories} activeCategoryId={filters.categoryId} />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <FilterSidebarClient
              categories={categories}
              initialFilters={filters}
              priceRange={PRICE_RANGE}
            />
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <Suspense fallback={<SkeletonGrid count={12} />}>
              <ProductGrid
                products={products}
              />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
