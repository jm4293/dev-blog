interface PageLoadingSpinnerProps {
  overlay?: boolean;
}

export function PageLoadingSpinner({ overlay = false }: PageLoadingSpinnerProps) {
  const content = (
    <div className="flex items-center gap-1">
      <span className="animate-pulse-fast text-2xl font-bold text-gray-900 [animation-delay:-0.4s] dark:text-white">
        d
      </span>
      <span className="animate-pulse-fast text-2xl font-bold text-gray-900 [animation-delay:-0.3s] dark:text-white">
        e
      </span>
      <span className="animate-pulse-fast text-2xl font-bold text-gray-900 [animation-delay:-0.2s] dark:text-white">
        v
      </span>
      <span className="animate-pulse-fast text-2xl font-bold text-gray-900 [animation-delay:-0.1s] dark:text-white">
        B
      </span>
      <span className="animate-pulse-fast text-2xl font-bold text-gray-900 dark:text-white">l</span>
      <span className="animate-pulse-fast text-2xl font-bold text-gray-900 [animation-delay:-0.05s] dark:text-white">
        o
      </span>
      <span className="animate-pulse-fast text-2xl font-bold text-gray-900 [animation-delay:-0.1s] dark:text-white">
        g
      </span>
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-x-0 bottom-0 top-16 z-30 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        {content}
      </div>
    );
  }

  return <div className="flex h-screen items-center justify-center">{content}</div>;
}
