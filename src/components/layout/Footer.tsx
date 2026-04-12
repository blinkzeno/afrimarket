import Link from 'next/link';
import { Leaf } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#F5F2EE] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Logo & Tagline */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary-500" />
              <span className="font-serif text-2xl font-semibold text-primary-500">
                AfriMarket
              </span>
            </Link>
            <p className="text-warm-4 text-sm leading-relaxed">
              Votre marché africain en ligne. Découvrez des produits authentiques 
              et soutenez les artisans et producteurs africains.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-medium text-warm-5 mb-4 text-sm">Navigation</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-warm-4 text-sm hover:text-navy transition-colors">
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link href="/explorer" className="text-warm-4 text-sm hover:text-navy transition-colors">
                    Explorer
                  </Link>
                </li>
                <li>
                  <Link href="/boutiques" className="text-warm-4 text-sm hover:text-navy transition-colors">
                    Boutiques
                  </Link>
                </li>
                <li>
                  <Link href="/communaute" className="text-warm-4 text-sm hover:text-navy transition-colors">
                    Communauté
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-warm-5 mb-4 text-sm">Légal</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/mentions-legales" className="text-warm-4 text-sm hover:text-navy transition-colors">
                    Mentions légales
                  </Link>
                </li>
                <li>
                  <Link href="/cgv" className="text-warm-4 text-sm hover:text-navy transition-colors">
                    CGV
                  </Link>
                </li>
                <li>
                  <Link href="/confidentialite" className="text-warm-4 text-sm hover:text-navy transition-colors">
                    Confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-warm-4 text-sm hover:text-navy transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-medium text-warm-5 mb-4 text-sm">Suivez-nous</h3>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-warm-4 hover:text-primary-500 hover:bg-primary-50 transition-colors"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-warm-4 hover:text-primary-500 hover:bg-primary-50 transition-colors"
                aria-label="Twitter"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-warm-4 hover:text-primary-500 hover:bg-primary-50 transition-colors"
                aria-label="Facebook"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-warm-4 hover:text-primary-500 hover:bg-primary-50 transition-colors"
                aria-label="YouTube"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
            <p className="text-warm-4 text-xs mt-6">
              © 2024 AfriMarket. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
