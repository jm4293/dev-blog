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
    <div className="text-center py-12 px-4">
      {Icon && (
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Icon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
      )}

      <p className="text-gray-900 dark:text-gray-100 text-lg font-semibold mb-2">{title}</p>
      <p className="text-gray-500 dark:text-gray-400 text-sm whitespace-pre-line">{description}</p>

      {showLoginPrompt && actionHref && actionLabel && (
        <div className="mt-6">
          <Link
            href={actionHref}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            {actionLabel}
          </Link>
        </div>
      )}
    </div>
  );
}
