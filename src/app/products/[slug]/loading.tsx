import { Skeleton } from '@/components/ui/skeleton';

export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-warm-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Skeleton */}
          <div className="space-y-4">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="flex gap-2">
              <Skeleton className="w-20 h-20 rounded-lg" />
              <Skeleton className="w-20 h-20 rounded-lg" />
              <Skeleton className="w-20 h-20 rounded-lg" />
            </div>
          </div>

          {/* Info Skeleton */}
          <div className="space-y-6">
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-10 w-full max-w-md" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-4 w-full max-w-sm" />
            <Skeleton className="h-6 w-32" />
            <div className="flex gap-3 pt-4">
              <Skeleton className="h-14 flex-1 rounded-lg" />
              <Skeleton className="h-14 w-14 rounded-lg" />
              <Skeleton className="h-14 w-14 rounded-lg" />
            </div>
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        </div>

        {/* Description Skeleton */}
        <div className="mt-12">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full mt-2" />
          <Skeleton className="h-4 w-3/4 mt-2" />
        </div>
      </div>
    </div>
  );
}
