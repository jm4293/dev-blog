export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-muted" />
        <div className="flex-1">
          <div className="mb-2 h-4 w-24 rounded bg-muted" />
          <div className="h-3 w-16 rounded bg-muted" />
        </div>
      </div>
      <div className="mb-4 h-5 w-3/4 rounded bg-muted" />
      <div className="mb-4 space-y-2">
        <div className="h-4 rounded bg-muted" />
        <div className="h-4 w-5/6 rounded bg-muted" />
      </div>
      <div className="mb-4 flex gap-2">
        <div className="h-6 w-16 rounded-full bg-muted" />
        <div className="h-6 w-16 rounded-full bg-muted" />
      </div>
    </div>
  );
}
