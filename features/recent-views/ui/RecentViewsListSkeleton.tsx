export function RecentViewsListSkeleton() {
  return (
    <div>
      {/* Action Buttons Skeleton */}
      <div className="mb-6 flex flex-wrap gap-3 border-b border-gray-200 pb-4 dark:border-gray-700">
        <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
        <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Count Skeleton */}
      <div className="mb-4 h-5 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
          >
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <div className="h-5 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Tags */}
            <div className="flex gap-2">
              <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-6 w-14 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Link */}
            <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />

            {/* Viewed At */}
            <div className="h-3 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        ))}
      </div>
    </div>
  );
}
