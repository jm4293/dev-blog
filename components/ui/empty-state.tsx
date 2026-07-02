import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="px-4 py-12 text-center">
      {Icon && (
        <div className="mb-4 flex justify-center">
          <div className="glass-card flex h-16 w-16 items-center justify-center rounded-full">
            <Icon className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
      )}

      <p className="mb-2 text-lg font-semibold text-foreground">{title}</p>
      {description && <p className="whitespace-pre-line text-sm text-muted-foreground">{description}</p>}

      {actionHref && actionLabel && (
        <div className="mt-6">
          <Link
            href={actionHref}
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-6 py-3 font-medium text-background transition-colors hover:bg-foreground/90"
          >
            {actionLabel}
          </Link>
        </div>
      )}
    </div>
  );
}
