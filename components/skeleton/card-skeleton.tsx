export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-gray-300 dark:bg-gray-600" />
        <div className="flex-1">
          <div className="mb-2 h-4 w-24 rounded bg-gray-300 dark:bg-gray-600" />
          <div className="h-3 w-16 rounded bg-gray-300 dark:bg-gray-600" />
        </div>
      </div>
      <div className="mb-4 h-5 w-3/4 rounded bg-gray-300 dark:bg-gray-600" />
      <div className="mb-4 space-y-2">
        <div className="h-4 rounded bg-gray-300 dark:bg-gray-600" />
        <div className="h-4 w-5/6 rounded bg-gray-300 dark:bg-gray-600" />
      </div>
      <div className="mb-4 flex gap-2">
        <div className="h-6 w-16 rounded-full bg-gray-300 dark:bg-gray-600" />
        <div className="h-6 w-16 rounded-full bg-gray-300 dark:bg-gray-600" />
      </div>
    </div>
  );
}
