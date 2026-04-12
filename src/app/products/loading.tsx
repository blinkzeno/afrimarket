import { SkeletonGrid } from '@/components/catalog/SkeletonCard';

export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-warm-0">
      {/* Flash Sales Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-8 w-48 bg-warm-2 rounded animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-warm-2 animate-pulse" />
            <div className="w-10 h-10 rounded-lg bg-warm-2 animate-pulse" />
            <div className="w-10 h-10 rounded-lg bg-warm-2 animate-pulse" />
          </div>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="min-w-[200px]">
              <div className="aspect-square bg-warm-2 rounded-[16px] animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Skeleton */}
          <aside className="lg:w-64 hidden lg:block">
            <div className="space-y-6">
              <div className="h-6 w-20 bg-warm-2 rounded animate-pulse" />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-4 w-full bg-warm-2 rounded animate-pulse" />
                ))}
              </div>
              <div className="h-px bg-warm-2" />
              <div className="h-6 w-32 bg-warm-2 rounded animate-pulse" />
              <div className="h-2 w-full bg-warm-2 rounded animate-pulse" />
            </div>
          </aside>

          {/* Grid Skeleton */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="h-8 w-48 bg-warm-2 rounded animate-pulse mb-2" />
                <div className="h-4 w-32 bg-warm-2 rounded animate-pulse" />
              </div>
            </div>
            <SkeletonGrid count={20} />
          </main>
        </div>
      </div>
    </div>
  );
}
