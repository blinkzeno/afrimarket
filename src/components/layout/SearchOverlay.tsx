'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const RECENT_SEARCHES = [
  'Pagne wax',
  'Artisanat',
  'Épices',
  'Bijoux africains',
];

const TRENDING_SEARCHES = [
  'Déco ethnique',
  'Thé vert',
  'Sacs en pagne',
  'Sculpture bois',
];

const POPULAR_CATEGORIES = [
  { name: 'Mode', count: '2.4k' },
  { name: 'Maison', count: '1.8k' },
  { name: 'Gastronomie', count: '980' },
  { name: 'Art', count: '650' },
];

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus input when opened
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      window.location.href = `/explorer?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar */}
        <div className="bg-white rounded-full shadow-xl overflow-hidden">
          <div className="flex items-center h-14 px-6">
            <Search className="h-5 w-5 text-warm-4 shrink-0" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Rechercher des produits, boutiques..."
              className="flex-1 border-0 shadow-none focus-visible:ring-0 text-base px-4 h-full placeholder:text-warm-3"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(query);
                }
              }}
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-warm-4 hover:text-warm-5"
                onClick={() => setQuery('')}
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Suggestions Panel */}
        <div className="mt-4 bg-white rounded-2xl shadow-xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
          {query ? (
            // Search Results / Suggestions
            <div className="p-4">
              <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-warm-1 cursor-pointer transition-colors">
                <Search className="h-4 w-4 text-warm-4" />
                <span className="text-warm-5">
                  Rechercher "<strong>{query}</strong>"
                </span>
                <ArrowRight className="h-4 w-4 text-warm-4 ml-auto" />
              </div>
              <div className="mt-2 pt-2 border-t border-[#E8ECE6]">
                <p className="text-xs font-medium text-warm-4 uppercase tracking-wide px-3 py-2">
                  Suggestions
                </p>
                {['Pagne wax', 'Épices', 'Artisanat'].map((suggestion) => (
                  <div
                    key={suggestion}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-warm-1 cursor-pointer transition-colors"
                    onClick={() => handleSearch(suggestion)}
                  >
                    <Search className="h-4 w-4 text-warm-3" />
                    <span className="text-warm-5 text-sm">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Default Content
            <div className="p-4">
              {/* Recent Searches */}
              <div>
                <p className="text-xs font-medium text-warm-4 uppercase tracking-wide px-3 py-2 flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  Recherches récentes
                </p>
                <div className="flex flex-wrap gap-2 px-3 py-2">
                  {RECENT_SEARCHES.map((search) => (
                    <button
                      key={search}
                      onClick={() => handleSearch(search)}
                      className="px-3 py-1.5 rounded-full bg-warm-1 text-warm-5 text-sm hover:bg-warm-2 transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending */}
              <div className="mt-4 pt-4 border-t border-[#E8ECE6]">
                <p className="text-xs font-medium text-warm-4 uppercase tracking-wide px-3 py-2 flex items-center gap-2">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Tendances
                </p>
                <div className="space-y-1">
                  {TRENDING_SEARCHES.map((search, index) => (
                    <button
                      key={search}
                      onClick={() => handleSearch(search)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-warm-1 transition-colors text-left"
                    >
                      <span className="h-5 w-5 rounded-full bg-primary-100 text-primary-600 text-xs font-medium flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="text-warm-5 text-sm">{search}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Categories */}
              <div className="mt-4 pt-4 border-t border-[#E8ECE6]">
                <p className="text-xs font-medium text-warm-4 uppercase tracking-wide px-3 py-2">
                  Catégories populaires
                </p>
                <div className="grid grid-cols-2 gap-2 px-3 py-2">
                  {POPULAR_CATEGORIES.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => handleSearch(category.name)}
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-warm-1 hover:bg-warm-2 transition-colors text-left"
                    >
                      <span className="text-warm-5 text-sm">{category.name}</span>
                      <span className="text-warm-4 text-xs">{category.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Close hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 text-sm">
        Appuyez sur <kbd className="px-2 py-1 bg-white/20 rounded">Échap</kbd> pour fermer
      </div>
    </div>
  );
}
