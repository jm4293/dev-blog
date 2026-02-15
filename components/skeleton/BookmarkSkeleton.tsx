import { CardSkeleton } from './CardSkeleton';

export function BookmarkSkeleton() {
  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-10 rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-baseline gap-2">
              <div className="h-8 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-8 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-6 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 animate-pulse rounded-full border-2 border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-800" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
