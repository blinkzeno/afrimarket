import { Skeleton } from '@/components/ui/skeleton';
import { SkeletonGrid } from '@/components/catalog/SkeletonCard';

export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-warm-0">
      {/* Categories Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 min-w-[72px]">
              <Skeleton className="w-16 h-16 rounded-full" />
              <Skeleton className="h-3 w-12" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Skeleton className="h-4 w-32 mb-4" />
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
        <SkeletonGrid count={20} />
      </div>
    </div>
  );
}
