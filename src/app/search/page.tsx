import { Suspense } from 'react';
import { Metadata } from 'next';
import { searchProducts, getCategories } from '@/lib/queries/products';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { CategoryPills } from '@/components/catalog/CategoryPills';
import { SkeletonGrid } from '@/components/catalog/SkeletonCard';
import { Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q || '';

  return {
    title: query
      ? `Résultats pour "${query}" — AfriMarket`
      : 'Recherche — AfriMarket',
    description: query
      ? `Trouvez les meilleurs produits africains pour "${query}" sur AfriMarket.`
      : 'Recherchez des produits africains sur AfriMarket.',
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';
  const page = parseInt(params.page || '0');

  // Fetch categories for the pills
  const categories = await getCategories();

  // Only search if there's a query
  const searchResult = query
    ? await searchProducts(query, page, 20)
    : { data: [], count: 0, page: 0, limit: 20, totalPages: 0 };

  const { data: products, count, totalPages } = searchResult;

  return (
    <div className="min-h-screen bg-warm-0">
      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-warm-2">
        <CategoryPills categories={categories} />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/products">
            <Button variant="ghost" className="mb-4 -ml-4 text-warm-4 hover:text-warm-5">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux produits
            </Button>
          </Link>

          {query ? (
            <div>
              <h1 className="font-serif text-3xl text-warm-5 mb-2">
                Résultats pour "{query}"
              </h1>
              <p className="text-warm-4">
                {count} produit{count !== 1 ? 's' : ''} trouvé{count !== 1 ? 's' : ''}
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-warm-1 flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-warm-3" />
              </div>
              <h1 className="font-serif text-2xl text-warm-5 mb-2">
                Recherchez un produit
              </h1>
              <p className="text-warm-4 max-w-md mx-auto">
                Entrez un terme de recherche pour découvrir nos produits africains.
              </p>
            </div>
          )}
        </div>

        {/* Results */}
        {query && (
          <Suspense fallback={<SkeletonGrid count={20} />}>
            <ProductGrid
              products={products}
              emptyMessage={`Aucun produit trouvé pour "${query}". Essayez avec d'autres termes.`}
            />
          </Suspense>
        )}

        {/* Pagination */}
        {query && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {page > 0 && (
              <Link
                href={`?${new URLSearchParams({ q: query, page: (page - 1).toString() }).toString()}`}
                className="px-4 py-2 rounded-lg border border-warm-2 bg-white text-warm-5 hover:bg-warm-1 transition-colors"
              >
                Précédent
              </Link>
            )}
            <span className="text-sm text-warm-4">
              Page {page + 1} sur {totalPages}
            </span>
            {page < totalPages - 1 && (
              <Link
                href={`?${new URLSearchParams({ q: query, page: (page + 1).toString() }).toString()}`}
                className="px-4 py-2 rounded-lg border border-warm-2 bg-white text-warm-5 hover:bg-warm-1 transition-colors"
              >
                Suivant
              </Link>
            )}
          </div>
        )}

        {/* Browse Categories CTA */}
        {!query || products.length === 0 ? (
          <div className="mt-12 pt-8 border-t border-warm-2">
            <h2 className="font-serif text-xl text-warm-5 mb-6 text-center">
              Parcourir par catégorie
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {categories.slice(0, 8).map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.id}`}
                  className="group p-4 rounded-xl bg-white border border-warm-2 hover:border-primary-200 hover:shadow-md transition-all"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                    style={{ backgroundColor: category.color + '20' }}
                  >
                    <span style={{ color: category.color }}>
                      {/* Simplified icon representation */}
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    </span>
                  </div>
                  <h3 className="font-medium text-warm-5 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
