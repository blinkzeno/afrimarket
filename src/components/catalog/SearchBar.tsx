'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  initialValue?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export function SearchBar({ initialValue = '', onSearch, className = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
      } else {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`
        relative flex items-center h-[64px] rounded-[32px] bg-white shadow-xl
        max-w-[720px] mx-auto ${className}
      `}
      style={{
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
      }}
    >
      <div className="flex items-center flex-1 pl-6 pr-4 h-full">
        <Search className="h-5 w-5 text-warm-4 shrink-0 mr-3" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un produit, une boutique..."
          className="flex-1 bg-transparent border-none outline-none text-base text-warm-5 placeholder:text-warm-3 h-full"
        />
      </div>
      <Button
        type="submit"
        className="h-[48px] px-6 mr-2 rounded-full bg-primary-500 hover:bg-primary-600 text-white font-medium"
      >
        Rechercher
      </Button>
    </form>
  );
}
