import Link from 'next/link';
import { Clock } from 'lucide-react';
import { SortButton } from '@/components/search';

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCompanyFilterClick: () => void;
  onTagFilterClick: () => void;
  currentSort: 'newest' | 'oldest';
  onSortChange: (sort: 'newest' | 'oldest') => void;
}

export function SearchInput({
  value,
  onChange,
  onCompanyFilterClick,
  onTagFilterClick,
  currentSort,
  onSortChange,
}: SearchInputProps) {
  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex gap-4">
        <SortButton currentSort={currentSort} onSortChange={onSortChange} />
        <input
          type="text"
          placeholder="게시글 검색..."
          value={value}
          onChange={onChange}
          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Link
          href="/recent-views"
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors whitespace-nowrap"
        >
          <Clock className="w-5 h-5" />
          <span className="hidden lg:inline">최근 본 글</span>
        </Link>
        <button
          onClick={onCompanyFilterClick}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors whitespace-nowrap"
        >
          기업 필터
        </button>
        <button
          onClick={onTagFilterClick}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors whitespace-nowrap"
        >
          태그 필터
        </button>
      </div>

      {/* Mobile */}
      <div className="md:hidden space-y-3">
        <div className="flex gap-3">
          <SortButton currentSort={currentSort} onSortChange={onSortChange} />
          <input
            type="text"
            placeholder="게시글 검색..."
            value={value}
            onChange={onChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-3">
          <Link
            href="/recent-views"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
          >
            <Clock className="w-5 h-5" />
            최근 본 글
          </Link>
          <button
            onClick={onCompanyFilterClick}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors"
          >
            기업 필터
          </button>
          <button
            onClick={onTagFilterClick}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors"
          >
            태그 필터
          </button>
        </div>
      </div>
    </>
  );
}
