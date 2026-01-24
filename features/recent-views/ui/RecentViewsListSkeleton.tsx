export function RecentViewsListSkeleton() {
  return (
    <div>
      {/* Action Buttons Skeleton */}
      <div className="flex flex-wrap gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
      </div>

      {/* Count Skeleton */}
      <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4"
          >
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>

            {/* Tags */}
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="h-6 w-14 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            </div>

            {/* Link */}
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />

            {/* Viewed At */}
            <div className="h-3 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
