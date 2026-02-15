import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  showLoginPrompt?: boolean;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  showLoginPrompt = false,
}: EmptyStateProps) {
  return (
    <div className="px-4 py-12 text-center">
      {Icon && (
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <Icon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
      )}

      <p className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</p>
      <p className="whitespace-pre-line text-sm text-gray-500 dark:text-gray-400">{description}</p>

      {showLoginPrompt && actionHref && actionLabel && (
        <div className="mt-6">
          <Link
            href={actionHref}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {actionLabel}
          </Link>
        </div>
      )}
    </div>
  );
}
