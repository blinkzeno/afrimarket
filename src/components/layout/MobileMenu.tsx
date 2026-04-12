'use client';

import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Leaf,
  Home,
  Compass,
  Store,
  Users,
  MessageCircle,
  Bell,
  ShoppingCart,
  User,
  Package,
  Heart,
  Settings,
  LogOut,
  X,
} from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
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

export function MobileMenu({
  isOpen,
  onClose,
  user,
  unreadMessages = 0,
  unreadNotifications = 0,
  onSignOut,
}: MobileMenuProps) {
  const mainNav = [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/explorer', label: 'Explorer', icon: Compass },
    { href: '/boutiques', label: 'Boutiques', icon: Store },
    { href: '/communaute', label: 'Communauté', icon: Users },
  ];

  const userNav = [
    { href: '/profil', label: 'Mon profil', icon: User },
    { href: '/commandes', label: 'Mes commandes', icon: Package },
    { href: '/favoris', label: 'Favoris', icon: Heart },
    {
      href: '/messages',
      label: 'Messages',
      icon: MessageCircle,
      badge: unreadMessages,
    },
    {
      href: '/notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotifications,
    },
    { href: '/parametres', label: 'Paramètres', icon: Settings },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-4 border-b border-[#E8ECE6]">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={onClose}
              >
                <Leaf className="h-6 w-6 text-primary-500" />
                <SheetTitle className="font-serif text-2xl font-semibold text-primary-500 m-0">
                  AfriMarket
                </SheetTitle>
              </Link>
            </div>
          </SheetHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            {/* User Info (if logged in) */}
            {user ? (
              <div className="p-4 border-b border-[#E8ECE6]">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={user.user_metadata?.avatar_url}
                      alt={user.user_metadata?.full_name || user.email}
                    />
                    <AvatarFallback className="bg-primary-100 text-primary-700 text-lg">
                      {user.user_metadata?.full_name?.charAt(0) ||
                        user.email?.charAt(0) ||
                        'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-warm-5 truncate">
                      {user.user_metadata?.full_name || 'Utilisateur'}
                    </p>
                    <p className="text-sm text-warm-4 truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Main Navigation */}
            <nav className="p-2">
              <p className="px-3 py-2 text-xs font-medium text-warm-4 uppercase tracking-wide">
                Navigation
              </p>
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-warm-5 hover:bg-warm-1 transition-colors"
                >
                  <item.icon className="h-5 w-5 text-warm-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>

            <Separator className="my-2" />

            {/* Cart Link */}
            <div className="p-2">
              <Link
                href="/panier"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-warm-5 hover:bg-warm-1 transition-colors"
              >
                <ShoppingCart className="h-5 w-5 text-warm-4" />
                <span className="font-medium">Mon panier</span>
              </Link>
            </div>

            {/* User Navigation (if logged in) */}
            {user ? (
              <>
                <Separator className="my-2" />
                <nav className="p-2">
                  <p className="px-3 py-2 text-xs font-medium text-warm-4 uppercase tracking-wide">
                    Mon compte
                  </p>
                  {userNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center gap-3 px-3 py-3 rounded-lg text-warm-5 hover:bg-warm-1 transition-colors"
                    >
                      <item.icon className="h-5 w-5 text-warm-4" />
                      <span className="font-medium">{item.label}</span>
                      {item.badge && item.badge > 0 && (
                        <Badge className="ml-auto h-5 min-w-[20px] px-1.5 text-xs bg-[#E8572A] text-white border-0">
                          {item.badge > 99 ? '99+' : item.badge}
                        </Badge>
                      )}
                    </Link>
                  ))}
                </nav>
              </>
            ) : null}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-[#E8ECE6] space-y-2">
            {user ? (
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                onClick={() => {
                  onSignOut?.();
                  onClose();
                }}
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </Button>
            ) : (
              <div className="space-y-2">
                <Link href="/login" onClick={onClose} className="block">
                  <Button variant="outline" className="w-full">
                    Connexion
                  </Button>
                </Link>
                <Link href="/register" onClick={onClose} className="block">
                  <Button className="w-full bg-primary-500 hover:bg-primary-600 text-white">
                    Inscription
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
