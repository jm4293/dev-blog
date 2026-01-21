import { Heart } from 'lucide-react';

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
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
        title={isBookmarked ? '즐겨찾기 제거' : '즐겨찾기 추가'}
      >
        <Heart
          className={`w-5 h-5 transition-colors ${
            isBookmarked ? 'fill-red-500 text-red-500' : 'text-gray-400 dark:text-gray-500'
          }`}
        />
      </button>

      {/* 로그인 필요 툴팁 */}
      {showLoginTooltip && (
        <div className="absolute top-full right-0 mt-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-10 animate-fade-in">
          로그인 후 즐겨찾기가 가능합니다
          <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 dark:bg-gray-700 transform rotate-45"></div>
        </div>
      )}
    </div>
  );
}
