import { CardSkeleton } from './CardSkeleton';

interface GridSkeletonProps {
  count?: number;
}

export function GridSkeleton({ count = 8 }: GridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
