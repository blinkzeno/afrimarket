import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Leaf,
  Shield,
  Truck,
  RefreshCcw,
  Headphones,
  ArrowRight,
  Sparkles,
  Palette,
  Utensils,
  Shirt,
  Home as HomeIcon,
  Sparkle,
} from "lucide-react";

const TRUST_BADGES = [
  { icon: Shield, label: "Paiement sécurisé" },
  { icon: Truck, label: "Livraison rapide" },
  { icon: RefreshCcw, label: "Retours faciles" },
  { icon: Headphones, label: "Support 24/7" },
];

const CATEGORIES = [
  { name: "Mode", icon: Shirt, color: "bg-primary-50", iconColor: "text-primary-500", href: "/explorer?category=mode" },
  { name: "Maison", icon: HomeIcon, color: "bg-gold-50", iconColor: "text-gold-500", href: "/explorer?category=maison" },
  { name: "Gastronomie", icon: Utensils, color: "bg-orange-50", iconColor: "text-orange-500", href: "/explorer?category=gastronomie" },
  { name: "Art & Déco", icon: Palette, color: "bg-purple-50", iconColor: "text-purple-500", href: "/explorer?category=art" },
  { name: "Bien-être", icon: Sparkle, color: "bg-pink-50", iconColor: "text-pink-500", href: "/explorer?category=bien-etre" },
  { name: "Artisanat", icon: Sparkles, color: "bg-blue-50", iconColor: "text-blue-500", href: "/explorer?category=artisanat" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-gold-50 py-16 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-warm-2">
                <Leaf className="h-4 w-4 text-primary-500" />
                <span className="text-sm font-medium text-warm-5">
                  Plus de 10 000 produits africains
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-warm-5 leading-tight">
                Découvrez l'authenticité{" "}
                <span className="text-primary-500">africaine</span>
              </h1>

              <p className="text-lg text-warm-4 max-w-lg leading-relaxed">
                Connectez-vous directement avec des artisans et producteurs africains. 
                Des produits authentiques, des histoires uniques, livrés chez vous.
              </p>

              {/* Search Bar */}
              <div className="flex gap-3 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-warm-4" />
                  <Input
                    type="text"
                    placeholder="Rechercher un produit..."
                    className="pl-10 h-12 rounded-full border-warm-2 bg-white"
                  />
                </div>
                <Button className="h-12 px-6 rounded-full bg-primary-500 hover:bg-primary-600 text-white">
                  <Search className="h-5 w-5 sm:mr-2" />
                  <span className="hidden sm:inline">Rechercher</span>
                </Button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-4">
                <div>
                  <p className="font-serif text-3xl text-primary-500">10k+</p>
                  <p className="text-sm text-warm-4">Produits</p>
                </div>
                <div>
                  <p className="font-serif text-3xl text-primary-500">500+</p>
                  <p className="text-sm text-warm-4">Boutiques</p>
                </div>
                <div>
                  <p className="font-serif text-3xl text-primary-500">50k+</p>
                  <p className="text-sm text-warm-4">Clients</p>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Main decorative element */}
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary-100 to-gold-100 p-8">
                  <div className="h-full w-full rounded-2xl bg-white shadow-xl flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-24 h-24 rounded-full bg-primary-50 flex items-center justify-center mx-auto">
                        <Leaf className="h-12 w-12 text-primary-500" />
                      </div>
                      <p className="font-serif text-2xl text-warm-5">
                        AfriMarket
                      </p>
                      <p className="text-warm-4 text-sm">
                        Votre marché en ligne
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating cards */}
                <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 animate-in slide-in-from-right duration-500">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-gold-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-warm-5">Qualité premium</p>
                      <p className="text-xs text-warm-4">Produits vérifiés</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 animate-in slide-in-from-left duration-500 delay-150">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-warm-5">Paiement sécurisé</p>
                      <p className="text-xs text-warm-4">100% protégé</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

      {/* Categories Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl text-warm-5 mb-4">
              Explorez nos catégories
            </h2>
            <p className="text-warm-4 max-w-2xl mx-auto">
              Des produits soigneusement sélectionnés pour vous offrir le meilleur de l'artisanat africain
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group"
              >
                <div className={`${category.color} rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg`}>
                  <div className={`w-14 h-14 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm`}>
                    <category.icon className={`h-7 w-7 ${category.iconColor}`} />
                  </div>
                  <h3 className="font-medium text-warm-5 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-2 text-sm text-warm-4">
                    <span>Explorer</span>
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
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

