export function PageLoadingSpinner() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex items-center gap-1">
        <span className="animate-pulse text-2xl font-bold text-blue-600 dark:text-blue-500 [animation-delay:-0.4s]">
          d
        </span>
        <span className="animate-pulse text-2xl font-bold text-blue-600 dark:text-blue-500 [animation-delay:-0.3s]">
          e
        </span>
        <span className="animate-pulse text-2xl font-bold text-blue-600 dark:text-blue-500 [animation-delay:-0.2s]">
          v
        </span>
        <span className="animate-pulse text-2xl font-bold text-blue-600 dark:text-blue-500 [animation-delay:-0.1s]">
          B
        </span>
        <span className="animate-pulse text-2xl font-bold text-blue-600 dark:text-blue-500">l</span>
        <span className="animate-pulse text-2xl font-bold text-blue-600 dark:text-blue-500 [animation-delay:-0.05s]">
          o
        </span>
        <span className="animate-pulse text-2xl font-bold text-blue-600 dark:text-blue-500 [animation-delay:-0.1s]">
          g
        </span>
      </div>
    </div>
  );
}
