import { cn } from '@/utils';

interface SimpleSkeletonProps {
  count?: number;
  height?: string;
  className?: string;
}

export function SimpleSkeleton({ count = 3, height = 'h-12', className }: SimpleSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={cn('animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700', height, className)} />
      ))}
    </div>
  );
}
