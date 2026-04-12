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
  title: 'Produits — AfriMarket',
  description: 'Découvrez tous les produits africains disponibles sur AfriMarket. Filtrez par catégorie, prix, et plus encore.',
};

interface ProductsPageProps {
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

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
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
  const [productsResult, categories, flashSales] = await Promise.all([
    getProducts(filters, page, 20),
    getCategories(),
    getFlashSales(6),
  ]);

  const { data: products, count, totalPages } = productsResult;

  return (
    <div className="min-h-screen bg-warm-0">
      {/* Flash Sales Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FlashSales products={flashSales} />
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-warm-2">
        <CategoryPills
          categories={categories}
          activeCategoryId={filters.categoryId}
        />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <aside className="lg:w-64 lg:shrink-0">
            <div className="lg:sticky lg:top-20">
              <FilterSidebarClient
                categories={categories}
                initialFilters={filters}
                priceRange={PRICE_RANGE}
              />
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-serif text-2xl text-warm-5">
                  {filters.categoryId
                    ? categories.find((c) => c.id === filters.categoryId)?.name || 'Produits'
                    : 'Tous les produits'}
                </h1>
                <p className="text-sm text-warm-4 mt-1">
                  {count} produit{count !== 1 ? 's' : ''} trouvé{count !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Sort Dropdown */}
              <div className="hidden sm:block">
                <select
                  value={filters.sortBy}
                  className="h-10 px-3 rounded-lg border border-warm-2 bg-white text-sm text-warm-5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="newest">Nouveautés</option>
                  <option value="price_asc">Prix croissant</option>
                  <option value="price_desc">Prix décroissant</option>
                  <option value="rating">Mieux notés</option>
                  <option value="sales">Plus vendus</option>
                </select>
              </div>
            </div>

            {/* Products */}
            <Suspense fallback={<SkeletonGrid count={20} />}>
              <ProductGrid products={products} />
            </Suspense>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {page > 0 && (
                  <a
                    href={`?${new URLSearchParams({ ...params, page: (page - 1).toString() }).toString()}`}
                    className="px-4 py-2 rounded-lg border border-warm-2 bg-white text-warm-5 hover:bg-warm-1 transition-colors"
                  >
                    Précédent
                  </a>
                )}
                <span className="text-sm text-warm-4">
                  Page {page + 1} sur {totalPages}
                </span>
                {page < totalPages - 1 && (
                  <a
                    href={`?${new URLSearchParams({ ...params, page: (page + 1).toString() }).toString()}`}
                    className="px-4 py-2 rounded-lg border border-warm-2 bg-white text-warm-5 hover:bg-warm-1 transition-colors"
                  >
                    Suivant
                  </a>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
