import { Heart } from 'lucide-react';
import { cn } from '@/utils';

interface BookmarkButtonProps {
  isBookmarked: boolean;
  isLoading: boolean;
  onToggle: (e: React.MouseEvent) => void;
  showLoginTooltip: boolean;
}

export function BookmarkButton({ isBookmarked, isLoading, onToggle, showLoginTooltip }: BookmarkButtonProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        disabled={isLoading}
        className="rounded-lg p-2 transition-colors hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-700"
        title={isBookmarked ? '즐겨찾기 제거' : '즐겨찾기 추가'}
      >
        <Heart
          className={cn(
            'h-5 w-5 transition-colors',
            isBookmarked ? 'fill-red-500 text-red-500' : 'text-gray-400 dark:text-gray-500',
          )}
        />
      </button>

      {showLoginTooltip && (
        <div className="absolute right-0 top-full z-10 mt-2 animate-fade-in whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg dark:bg-gray-700">
          로그인 후 즐겨찾기가 가능합니다
          <div className="absolute -top-1 right-4 h-2 w-2 rotate-45 transform bg-gray-900 dark:bg-gray-700"></div>
        </div>
      )}
    </div>
  );
}
