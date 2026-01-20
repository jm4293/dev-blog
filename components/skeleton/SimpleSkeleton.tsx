interface SimpleSkeletonProps {
  count?: number;
  height?: string;
  className?: string;
}

export function SimpleSkeleton({ count = 3, height = 'h-40', className = '' }: SimpleSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`${height} bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse ${className}`} />
      ))}
    </div>
  );
}
