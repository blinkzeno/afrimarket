export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  color: string;
  description?: string;
  parentId?: string;
  level: number;
  sortOrder: number;
  imageUrl?: string;
}

export interface Shop {
  id: string;
  name: string;
  slug: string;
  city?: string;
  rating?: number;
  logoUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  stockQuantity: number;
  status: 'active' | 'draft' | 'archived';
  images: string[];
  rating: number;
  reviewCount: number;
  totalSales: number;
  viewCount: number;
  isFeatured: boolean;
  tags?: string[];
  variants?: ProductVariant[];
  attributes?: Record<string, string>;
  categoryId?: string;
  category?: Category;
  shopId: string;
  shop?: Shop;
  createdAt: string;
  updatedAt: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku?: string;
  price?: number;
  stockQuantity: number;
  options: Record<string, string>;
  imageUrl?: string;
}

export interface ProductFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  onSale?: boolean;
  query?: string;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'sales';
}

export interface PaginatedResult<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title?: string;
  content?: string;
  images?: string[];
  isVerified: boolean;
  helpfulCount: number;
  createdAt: string;
  user?: {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  };
}
