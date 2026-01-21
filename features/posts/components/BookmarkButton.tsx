import { Heart } from 'lucide-react';

interface BookmarkButtonProps {
  isBookmarked: boolean;
  isLoading: boolean;
  onToggle: (e: React.MouseEvent) => void;
}

export function BookmarkButton({ isBookmarked, isLoading, onToggle }: BookmarkButtonProps) {
  return (
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
  );
}
