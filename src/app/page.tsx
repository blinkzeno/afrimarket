import Link from "next/link";
import { getCategories, getTrendingProducts } from "@/lib/queries/products";
import { SearchBar } from "@/components/catalog/SearchBar";
import { CategoryPills } from "@/components/catalog/CategoryPills";
import { ProductCarousel } from "@/components/catalog/ProductCarousel";
import {
  Shield,
  Truck,
  RefreshCcw,
  Headphones,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const TRUST_BADGES = [
  { icon: Shield, label: "Paiement sécurisé" },
  { icon: Truck, label: "Livraison rapide" },
  { icon: RefreshCcw, label: "Retours faciles" },
  { icon: Headphones, label: "Support 24/7" },
];

// Kente pattern SVG for hero background
const KentePattern = () => (
  <svg
    className="absolute right-0 top-0 h-full w-1/3 opacity-[0.04]"
    viewBox="0 0 200 400"
    fill="none"
    preserveAspectRatio="xMaxYMid slice"
  >
    <pattern id="kente" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <rect width="40" height="40" fill="#1B7A3E" />
      <rect x="0" y="0" width="20" height="20" fill="#0F4D27" />
      <rect x="20" y="20" width="20" height="20" fill="#0F4D27" />
      <rect x="0" y="20" width="10" height="10" fill="#D4A017" />
      <rect x="30" y="0" width="10" height="10" fill="#D4A017" />
    </pattern>
    <rect width="200" height="400" fill="url(#kente)" />
  </svg>
);

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch data in parallel
  const [categories, trendingProducts] = await Promise.all([
    getCategories(),
    getTrendingProducts(12),
  ]);

  return (
    <div className="flex flex-col">
      {/* Hero Section with Categories */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #FAFAF8 0%, #F0EDE8 100%)' }}>
        <KentePattern />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Content */}
          <div className="pt-16 sm:pt-24 lg:pt-32 pb-12">
            <div className="text-center max-w-3xl mx-auto">
              {/* Title */}
              <h1
                className="font-serif text-4xl sm:text-5xl lg:text-[52px] leading-tight mb-6"
                style={{ color: '#0D1F35', letterSpacing: '-0.5px' }}
              >
                Achetez local,{' '}
                <span className="text-primary-600">achetez malin.</span>
              </h1>

              <p className="text-lg text-warm-4 max-w-xl mx-auto mb-8">
                Découvrez des milliers de produits africains authentiques.
                Du producteur directement chez vous.
              </p>

              {/* Stats */}
              <div className="flex items-center justify-center gap-8 sm:gap-12">
                <div className="text-center">
                  <p className="font-serif text-3xl sm:text-4xl text-primary-600">10k+</p>
                  <p className="text-sm text-warm-4">Produits</p>
                </div>
                <div className="w-px h-12 bg-warm-2" />
                <div className="text-center">
                  <p className="font-serif text-3xl sm:text-4xl text-primary-600">500+</p>
                  <p className="text-sm text-warm-4">Boutiques</p>
                </div>
                <div className="w-px h-12 bg-warm-2" />
                <div className="text-center">
                  <p className="font-serif text-3xl sm:text-4xl text-primary-600">50k+</p>
                  <p className="text-sm text-warm-4">Clients</p>
                </div>
              </div>
            </div>
          </div>

          {/* SearchBar */}
          <div className="pb-8">
            <SearchBar />
          </div>

          {/* Categories - Now in hero section for better positioning */}
          <div className="pb-8">
            <CategoryPills categories={categories} />
          </div>
        </div>
      </section>

      {/* Trending Products Carousel */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductCarousel
            products={trendingProducts}
            title="Produits tendance"
            subtitle="Les plus populaires cette semaine"
          />
          <div className="text-center mt-8">
            <Link href="/explorer">
              <Button
                variant="outline"
                className="rounded-full px-8 border-primary-500 text-primary-600 hover:bg-primary-50"
              >
                Explorer tous les produits
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="bg-warm-1 border-y border-warm-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_BADGES.map((badge) => (
              <div key={badge.label} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <badge.icon className="h-5 w-5 text-primary-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-warm-5">{badge.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-white mb-4">
            Devenez vendeur sur AfriMarket
          </h2>
          <p className="text-primary-100 max-w-2xl mx-auto mb-8">
            Rejoignez notre communauté de vendeurs et touchez des milliers de clients à travers le monde
          </p>
          <Link href="/vendre">
            <Button
              size="lg"
              className="bg-white text-primary-600 hover:bg-warm-1 rounded-full px-8 h-12"
            >
              Ouvrir ma boutique
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
