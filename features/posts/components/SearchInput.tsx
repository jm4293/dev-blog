import Link from 'next/link';
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
      <div className="hidden gap-4 md:flex">
        <SortButton currentSort={currentSort} onSortChange={onSortChange} />
        <input
          type="text"
          placeholder="게시글 검색..."
          value={value}
          onChange={onChange}
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
        />
        <Link
          href="/recent-views"
          className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          <span className="hidden lg:inline">최근 본 글</span>
        </Link>
        <button
          onClick={onCompanyFilterClick}
          className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-900 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        >
          블로그 필터
        </button>
        <button
          onClick={onTagFilterClick}
          className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-900 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        >
          태그 필터
        </button>
      </div>

      {/* Mobile */}
      <div className="space-y-3 md:hidden">
        <div className="flex gap-3">
          <SortButton currentSort={currentSort} onSortChange={onSortChange} />
          <input
            type="text"
            placeholder="게시글 검색..."
            value={value}
            onChange={onChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          />
        </div>
        <div className="flex gap-2">
          <Link
            href="/recent-views"
            className="flex items-center justify-center whitespace-nowrap rounded-lg bg-blue-600 px-3 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            최근 본 글
          </Link>
          <button
            onClick={onCompanyFilterClick}
            className="flex flex-1 items-center justify-center whitespace-nowrap rounded-lg bg-gray-200 px-3 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            블로그 필터
          </button>
          <button
            onClick={onTagFilterClick}
            className="flex flex-1 items-center justify-center whitespace-nowrap rounded-lg bg-gray-200 px-3 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            태그 필터
          </button>
        </div>
      </div>
    </>
  );
}
