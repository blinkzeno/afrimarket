import { createClient } from '@/lib/supabase/server';
import type { Product, Category, ProductFilters, PaginatedResult, Review } from '@/lib/types/catalog';

const DEFAULT_PAGE_SIZE = 20;

export async function getProducts(
  filters: ProductFilters = {},
  page = 0,
  limit = DEFAULT_PAGE_SIZE
): Promise<PaginatedResult<Product>> {
  const supabase = await createClient();

  let query = supabase
    .from('products')
    .select(
      'id,name,slug,description,short_description,price,compare_at_price,currency,stock_quantity,status,images,rating,review_count,total_sales,view_count,is_featured,tags,variants,attributes,category_id,shop_id,created_at,updated_at,meta_title,meta_description,categories!left(id,name,slug,icon_name,color),shops!left(id,name,slug,city,logo_url)',
      { count: 'exact' }
    )
    .eq('status', 'active');

  // Apply filters
  if (filters.categoryId) {
    query = query.eq('category_id', filters.categoryId);
  }

  if (filters.minPrice !== undefined) {
    query = query.gte('price', filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    query = query.lte('price', filters.maxPrice);
  }

  if (filters.minRating) {
    query = query.gte('rating', filters.minRating);
  }

  if (filters.inStock) {
    query = query.gt('stock_quantity', 0);
  }

  if (filters.onSale) {
    query = query.gt('compare_at_price', 0);
  }

  // Apply sorting
  switch (filters.sortBy) {
    case 'price_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false });
      break;
    case 'rating':
      query = query.order('rating', { ascending: false });
      break;
    case 'sales':
      query = query.order('total_sales', { ascending: false });
      break;
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false });
  }

  const from = page * limit;
  const to = from + limit - 1;

  const { data, error, count } = await query.range(from, to);

  if (error) {
    console.error('Error fetching products:', error);
    return { data: [], count: 0, page, limit, totalPages: 0 };
  }

  const products: Product[] = (data || []).map(mapProductFromDB);

  return {
    data: products,
    count: count || 0,
    page,
    limit,
    totalPages: count ? Math.ceil(count / limit) : 0,
  };
}

export async function searchProducts(
  query: string,
  page = 0,
  limit = DEFAULT_PAGE_SIZE
): Promise<PaginatedResult<Product>> {
  const supabase = await createClient();

  const { data, error, count } = await supabase
    .from('products')
    .select(
      'id,name,slug,description,short_description,price,compare_at_price,currency,stock_quantity,status,images,rating,review_count,total_sales,view_count,is_featured,tags,variants,attributes,category_id,shop_id,created_at,updated_at,meta_title,meta_description,categories!left(id,name,slug,icon_name,color),shops!left(id,name,slug,city,logo_url)',
      { count: 'exact' }
    )
    .eq('status', 'active')
    .textSearch('search_vector', query, { type: 'websearch' })
    .order('rating', { ascending: false })
    .range(page * limit, page * limit + limit - 1);

  if (error) {
    console.error('Error searching products:', error);
    return { data: [], count: 0, page, limit, totalPages: 0 };
  }

  const products: Product[] = (data || []).map(mapProductFromDB);

  return {
    data: products,
    count: count || 0,
    page,
    limit,
    totalPages: count ? Math.ceil(count / limit) : 0,
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select(
      'id,name,slug,description,short_description,price,compare_at_price,currency,stock_quantity,status,images,rating,review_count,total_sales,view_count,is_featured,tags,variants,attributes,category_id,shop_id,created_at,updated_at,meta_title,meta_description,seo_keywords,categories!left(id,name,slug,icon_name,color),shops!left(id,name,slug,city,logo_url)'
    )
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  if (error || !data) {
    console.error('Error fetching product:', error);
    return null;
  }

  return mapProductFromDB(data);
}

export async function getTrendingProducts(limit = 8): Promise<Product[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select(
      'id,name,slug,description,short_description,price,compare_at_price,currency,stock_quantity,status,images,rating,review_count,total_sales,view_count,is_featured,tags,variants,attributes,category_id,shop_id,created_at,updated_at,meta_title,meta_description,categories!left(id,name,slug,icon_name,color),shops!left(id,name,slug,city,logo_url)'
    )
    .eq('status', 'active')
    .eq('is_featured', true)
    .order('total_sales', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching trending products:', error);
    return [];
  }

  return (data || []).map(mapProductFromDB);
}

export async function getFlashSales(limit = 6): Promise<Product[]> {
  const supabase = await createClient();

  // Get products with compare_at_price > price (on sale)
  const { data, error } = await supabase
    .from('products')
    .select(
      'id,name,slug,description,short_description,price,compare_at_price,currency,stock_quantity,status,images,rating,review_count,total_sales,view_count,is_featured,tags,variants,attributes,category_id,shop_id,created_at,updated_at,meta_title,meta_description,categories!left(id,name,slug,icon_name,color),shops!left(id,name,slug,city,logo_url)'
    )
    .eq('status', 'active')
    .gt('compare_at_price', 0)
    .order('total_sales', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching flash sales:', error);
    return [];
  }

  return (data || []).map(mapProductFromDB);
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return (data || []).map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    iconName: cat.icon_name || 'shopping-bag',
    color: cat.color || '#1B7A3E',
    description: cat.description,
    parentId: cat.parent_id,
    level: cat.level || 0,
    sortOrder: cat.sort_order || 0,
    imageUrl: cat.image_url,
  }));
}

export async function getProductReviews(
  productId: string,
  page = 0,
  limit = 10
): Promise<PaginatedResult<Review>> {
  const supabase = await createClient();

  const { data, error, count } = await supabase
    .from('reviews')
    .select('*,users!left(first_name,last_name,avatar_url)', { count: 'exact' })
    .eq('product_id', productId)
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .range(page * limit, page * limit + limit - 1);

  if (error) {
    console.error('Error fetching reviews:', error);
    return { data: [], count: 0, page, limit, totalPages: 0 };
  }

  const reviews: Review[] = (data || []).map((rev) => ({
    id: rev.id,
    productId: rev.product_id,
    userId: rev.user_id,
    rating: rev.rating,
    title: rev.title,
    content: rev.content,
    images: rev.images,
    isVerified: rev.is_verified || false,
    helpfulCount: rev.helpful_count || 0,
    createdAt: rev.created_at,
    user: rev.users
      ? {
          firstName: rev.users.first_name,
          lastName: rev.users.last_name,
          avatarUrl: rev.users.avatar_url,
        }
      : undefined,
  }));

  return {
    data: reviews,
    count: count || 0,
    page,
    limit,
    totalPages: count ? Math.ceil(count / limit) : 0,
  };
}

export async function getRelatedProducts(
  productId: string,
  categoryId?: string,
  limit = 4
): Promise<Product[]> {
  const supabase = await createClient();

  let query = supabase
    .from('products')
    .select(
      'id,name,slug,description,short_description,price,compare_at_price,currency,stock_quantity,status,images,rating,review_count,total_sales,view_count,is_featured,tags,variants,attributes,category_id,shop_id,created_at,updated_at,meta_title,meta_description,categories!left(id,name,slug,icon_name,color),shops!left(id,name,slug,city,logo_url)'
    )
    .eq('status', 'active')
    .neq('id', productId);

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query.order('total_sales', { ascending: false }).limit(limit);

  if (error) {
    console.error('Error fetching related products:', error);
    return [];
  }

  return (data || []).map(mapProductFromDB);
}

// Helper function to map database result to Product type
function mapProductFromDB(data: Record<string, unknown>): Product {
  const category = data.categories as Record<string, unknown> | null;
  const shop = data.shops as Record<string, unknown> | null;

  return {
    id: data.id as string,
    name: data.name as string,
    slug: data.slug as string,
    description: data.description as string | undefined,
    shortDescription: data.short_description as string | undefined,
    price: data.price as number,
    compareAtPrice: data.compare_at_price as number | undefined,
    currency: (data.currency as string) || 'XOF',
    stockQuantity: data.stock_quantity as number,
    status: data.status as 'active' | 'draft' | 'archived',
    images: (data.images as string[]) || [],
    rating: data.rating as number,
    reviewCount: data.review_count as number,
    totalSales: data.total_sales as number,
    viewCount: data.view_count as number,
    isFeatured: data.is_featured as boolean,
    tags: data.tags as string[] | undefined,
    variants: data.variants as unknown as Product['variants'],
    attributes: data.attributes as Record<string, string> | undefined,
    categoryId: data.category_id as string | undefined,
    category: category
      ? {
          id: category.id as string,
          name: category.name as string,
          slug: category.slug as string,
          iconName: (category.icon_name as string) || 'shopping-bag',
          color: (category.color as string) || '#1B7A3E',
          description: category.description as string | undefined,
          parentId: category.parent_id as string | undefined,
          level: (category.level as number) || 0,
          sortOrder: (category.sort_order as number) || 0,
          imageUrl: category.image_url as string | undefined,
        }
      : undefined,
    shopId: data.shop_id as string,
    shop: shop
      ? {
          id: shop.id as string,
          name: shop.name as string,
          slug: shop.slug as string,
          city: shop.city as string | undefined,
          logoUrl: shop.logo_url as string | undefined,
        }
      : undefined,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string,
    metaTitle: data.meta_title as string | undefined,
    metaDescription: data.meta_description as string | undefined,
  };
}
