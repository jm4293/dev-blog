import { cn } from '@/utils';

interface PopularTagsProps {
  tags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  isLoading: boolean;
}

export function PopularTags({ tags, selectedTags, onTagToggle, isLoading }: PopularTagsProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 space-y-2">
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">인기 태그</p>
      <div className="flex flex-wrap gap-2">
        {isLoading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">로딩 중...</p>
        ) : (
          tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagToggle(tag)}
              className={cn(
                'rounded-full px-4 py-2 font-medium transition-all',
                selectedTags.includes(tag)
                  ? 'bg-blue-600 text-white dark:bg-blue-500'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
              )}
            >
              {tag}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
