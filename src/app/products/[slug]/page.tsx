import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Store, Heart, Share2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  getProductBySlug,
  getRelatedProducts,
  getProductReviews,
} from '@/lib/queries/products';
import { ProductGrid } from '@/components/catalog/ProductGrid';

export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Produit non trouvé — AfriMarket',
    };
  }

  const description = product.shortDescription || product.description || '';
  const imageUrl = product.images?.[0];

  return {
    title: `${product.name} — AfriMarket`,
    description: description.substring(0, 160),
    openGraph: imageUrl
      ? {
          images: [{ url: imageUrl }],
        }
      : undefined,
    twitter: imageUrl
      ? {
          card: 'summary_large_image',
          images: [imageUrl],
        }
      : undefined,
  };
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

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch related data
  const [relatedProducts, reviewsResult] = await Promise.all([
    getRelatedProducts(product.id, product.categoryId, 4),
    getProductReviews(product.id, 0, 5),
  ]);

  const discount = calculateDiscount(product.price, product.compareAtPrice);
  const mainImage = product.images?.[0] || '/placeholder-product.png';

  return (
    <div className="min-h-screen bg-warm-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-warm-4 mb-6">
          <Link href="/" className="hover:text-warm-5">
            Accueil
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/products" className="hover:text-warm-5">
            Produits
          </Link>
          {product.category && (
            <>
              <ChevronRight className="h-4 w-4" />
              <Link
                href={`/products?category=${product.category.id}`}
                className="hover:text-warm-5"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="h-4 w-4" />
          <span className="text-warm-5 truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {discount && (
                <div className="absolute top-4 left-4 bg-[#E8572A] text-white font-bold px-3 py-1 rounded-lg">
                  -{discount}%
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 ${
                      index === 0 ? 'border-primary-500' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              {product.shop && (
                <Link
                  href={`/shops/${product.shop.slug}`}
                  className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 mb-2"
                >
                  <Store className="h-4 w-4" />
                  {product.shop.name}
                </Link>
              )}
              <h1 className="font-serif text-3xl lg:text-4xl text-warm-5">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-gold-500 text-gold-500'
                          : 'text-warm-3'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-warm-4">
                  {product.rating.toFixed(1)} ({product.reviewCount} avis)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-warm-5">
                {formatPrice(product.price, product.currency)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xl text-warm-4 line-through">
                  {formatPrice(product.compareAtPrice, product.currency)}
                </span>
              )}
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-warm-4">{product.shortDescription}</p>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.stockQuantity > 0 ? (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  En stock ({product.stockQuantity} disponible
                  {product.stockQuantity > 1 ? 's' : ''})
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-red-100 text-red-700">
                  Rupture de stock
                </Badge>
              )}
            </div>

            {/* Variants (if any) */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-warm-5">Variantes</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      className="px-4 py-2 rounded-lg border border-warm-2 hover:border-primary-500 hover:text-primary-600 transition-colors text-sm"
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                size="lg"
                className="flex-1 bg-primary-500 hover:bg-primary-600 text-white h-14 text-lg"
                disabled={product.stockQuantity === 0}
              >
                Ajouter au panier
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 w-14 p-0"
              >
                <Heart className="h-6 w-6" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 w-14 p-0"
              >
                <Share2 className="h-6 w-6" />
              </Button>
            </div>

            <Separator />

            {/* Seller Card */}
            {product.shop && (
              <div className="bg-white rounded-xl p-4 border border-warm-2">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                    <Store className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-warm-5">{product.shop.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-warm-4 mt-1">
                      <MapPin className="h-4 w-4" />
                      {product.shop.city || 'Localisation non spécifiée'}
                    </div>
                    <Link
                      href={`/shops/${product.shop.slug}`}
                      className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 mt-2"
                    >
                      Visiter la boutique
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-12">
            <h2 className="font-serif text-2xl text-warm-5 mb-4">Description</h2>
            <div className="prose prose-warm max-w-none">
              <p className="text-warm-4 whitespace-pre-line">{product.description}</p>
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="mt-12">
          <h2 className="font-serif text-2xl text-warm-5 mb-4">
            Avis clients ({product.reviewCount})
          </h2>
          {reviewsResult.data.length > 0 ? (
            <div className="space-y-4">
              {reviewsResult.data.map((review) => (
                <div key={review.id} className="bg-white rounded-xl p-4 border border-warm-2">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-warm-1 flex items-center justify-center">
                      <span className="text-warm-5 font-medium">
                        {review.user?.firstName?.[0] || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-warm-5">
                        {review.user?.firstName} {review.user?.lastName}
                      </p>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < review.rating
                                ? 'fill-gold-500 text-gold-500'
                                : 'text-warm-3'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  {review.title && (
                    <h4 className="font-medium text-warm-5 mb-2">{review.title}</h4>
                  )}
                  {review.content && (
                    <p className="text-sm text-warm-4">{review.content}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-warm-4">Aucun avis pour ce produit.</p>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="font-serif text-2xl text-warm-5 mb-6">Produits similaires</h2>
            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </div>
    </div>
  );
}
