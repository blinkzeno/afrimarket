'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center py-24 text-center">
      {/* Shopping Bag Illustration */}
      <div className="w-16 h-16 rounded-full bg-[#F5F2EE] flex items-center justify-center mb-4">
        <ShoppingBag className="w-8 h-8 text-[#C5C0BB]" strokeWidth={1.5} />
      </div>

      {/* Title */}
      <h2 className="font-semibold text-xl text-[#2C2420] mb-2">
        Votre panier est vide
      </h2>

      {/* Description */}
      <p className="text-[#8C8279] text-sm max-w-xs mb-6">
        Découvrez nos produits et ajoutez-les à votre panier pour passer commande.
      </p>

      {/* CTA Button */}
      <Link href="/explorer">
        <Button 
          className="h-12 px-8 rounded-[12px] bg-[#1B7A3E] hover:bg-[#0F4D27] text-white font-semibold transition-colors"
        >
          Explorer le catalogue
        </Button>
      </Link>
    </div>
  );
}
