'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import {
  Leaf,
  Search,
  ShoppingCart,
  Bell,
  User,
  Menu,
  X,
  MessageCircle,
  LogOut,
  Heart,
  Package,
  Store,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cartStore';
import { MobileMenu } from './MobileMenu';
import { SearchOverlay } from './SearchOverlay';

interface HeaderProps {
  user?: {
    id: string;
    email?: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
    };
  } | null;
  unreadMessages?: number;
  unreadNotifications?: number;
  onSignOut?: () => void;
}

export function Header({
  user,
  unreadMessages = 0,
  unreadNotifications = 0,
  onSignOut,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const itemCount = useCartStore((state) => state.itemCount());

  const handleSignOut = () => {
    if (onSignOut) {
      startTransition(() => {
        onSignOut();
      });
    }
  };

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/explorer', label: 'Explorer' },
    { href: '/boutiques', label: 'Boutiques' },
    { href: '/communaute', label: 'Communauté' },
  ];

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden lg:block sticky top-0 z-40 h-16 bg-white/95 backdrop-blur border-b border-[#E8ECE6]">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Leaf className="h-6 w-6 text-primary-500" />
            <span className="font-serif text-2xl font-semibold text-primary-500 tracking-tight">
              AfriMarket
            </span>
          </Link>

          {/* Center: Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-warm-4 hover:text-navy transition-colors relative"
              >
                {link.label}
                {link.href === '/messages' && unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-2 h-2 w-2 rounded-full bg-blue-500" />
                )}
              </Link>
            ))}
            <Link
              href="/messages"
              className="text-sm font-medium text-warm-4 hover:text-navy transition-colors relative flex items-center gap-1"
            >
              Messages
              {unreadMessages > 0 && (
                <span className="h-2 w-2 rounded-full bg-blue-500" />
              )}
            </Link>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex text-warm-4 hover:text-navy hover:bg-warm-1"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Link href="/panier">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-warm-4 hover:text-navy hover:bg-warm-1"
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-[18px] min-w-[18px] rounded-full bg-[#E8572A] text-white text-[10px] font-bold flex items-center justify-center px-1">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Notifications - Hidden on mobile */}
            <Link href="/notifications" className="hidden sm:block">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-warm-4 hover:text-navy hover:bg-warm-1"
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-[18px] min-w-[18px] rounded-full bg-[#E8572A] text-white text-[10px] font-bold flex items-center justify-center px-1">
                    {unreadNotifications > 99 ? '99+' : unreadNotifications}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Menu or Sign In */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full p-0 hover:bg-warm-1"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={user.user_metadata?.avatar_url}
                        alt={user.user_metadata?.full_name || user.email}
                      />
                      <AvatarFallback className="bg-primary-100 text-primary-700">
                        {user.user_metadata?.full_name?.charAt(0) ||
                          user.email?.charAt(0) ||
                          'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center gap-2 p-2">
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-medium">
                        {user.user_metadata?.full_name || 'Utilisateur'}
                      </p>
                      <p className="text-xs text-warm-4 truncate max-w-[200px]">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => window.location.href = '/profil'}>
                    <User className="mr-2 h-4 w-4" />
                    Mon profil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href = '/commandes'}>
                    <Package className="mr-2 h-4 w-4" />
                    Mes commandes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href = '/favoris'}>
                    <Heart className="mr-2 h-4 w-4" />
                    Favoris
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href = '/messages'}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Messages
                    {unreadMessages > 0 && (
                      <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs bg-blue-100 text-blue-700">
                        {unreadMessages}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href = '/dashboard'}>
                    <Store className="mr-2 h-4 w-4" />
                    Ma boutique
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    disabled={isPending}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-warm-4 hover:text-navy"
                  >
                    Connexion
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="bg-primary-500 hover:bg-primary-600 text-white"
                  >
                    Inscription
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-warm-4 hover:text-navy hover:bg-warm-1"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Header - Alternative layout for small screens */}
      <header className="lg:hidden sticky top-0 z-40 h-14 bg-white/95 backdrop-blur border-b border-[#E8ECE6]">
        <div className="h-full px-4 flex items-center justify-between">
          {/* Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-warm-4 hover:text-navy hover:bg-warm-1 -ml-2"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Centered Logo */}
          <Link href="/" className="flex items-center gap-1.5">
            <Leaf className="h-5 w-5 text-primary-500" />
            <span className="font-serif text-xl font-semibold text-primary-500">
              AfriMarket
            </span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-1 -mr-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-warm-4 hover:text-navy hover:bg-warm-1"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Link href="/panier">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-warm-4 hover:text-navy hover:bg-warm-1"
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-[16px] min-w-[16px] rounded-full bg-[#E8572A] text-white text-[9px] font-bold flex items-center justify-center px-1">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu Sheet */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        user={user}
        unreadMessages={unreadMessages}
        unreadNotifications={unreadNotifications}
        onSignOut={onSignOut}
      />

      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
