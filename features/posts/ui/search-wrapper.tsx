import Link from 'next/link';
import { Search } from 'lucide-react';
import { SortButton } from './sort-button';

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  onBlogFilterClick: () => void;
  onTagFilterClick: () => void;
  currentSort: 'newest' | 'oldest';
  onSortChange: (sort: 'newest' | 'oldest') => void;
}

export function SearchWrapper({
  value,
  onChange,
  onSearch,
  onBlogFilterClick,
  onTagFilterClick,
  currentSort,
  onSortChange,
}: SearchInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <>
      {/* Desktop */}
      <div className="hidden gap-4 md:flex">
        <SortButton currentSort={currentSort} onSortChange={onSortChange} />
        <div className="relative flex-1">
          <input
            type="text"
            name="search"
            autoComplete="off"
            aria-label="게시글 검색"
            placeholder="제목, 키워드로 검색"
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            className="glass-card w-full rounded-lg py-3 pl-4 pr-12 text-foreground placeholder-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
          />
          <button
            onClick={onSearch}
            aria-label="검색"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Search size={18} />
          </button>
        </div>
        <Link
          href="/recent-views"
          className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-foreground px-4 py-3 font-semibold text-background transition-colors hover:bg-foreground/90"
        >
          최근 본 글
        </Link>
        <button
          onClick={onBlogFilterClick}
          className="glass-card flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-6 py-3 font-semibold text-foreground transition-colors hover:bg-muted/60"
        >
          블로그 필터
        </button>
        <button
          onClick={onTagFilterClick}
          className="glass-card flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-6 py-3 font-semibold text-foreground transition-colors hover:bg-muted/60"
        >
          태그 필터
        </button>
      </div>

      {/* Mobile */}
      <div className="space-y-3 md:hidden">
        <div className="flex gap-3">
          <SortButton currentSort={currentSort} onSortChange={onSortChange} />
          <div className="relative flex-1">
            <input
              type="text"
              name="search"
              autoComplete="off"
              aria-label="게시글 검색"
              placeholder="제목, 키워드로 검색"
              value={value}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              className="glass-card w-full rounded-lg py-3 pl-4 pr-12 text-foreground placeholder-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
            />
            <button
              onClick={onSearch}
              aria-label="검색"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <Search size={18} />
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href="/recent-views"
            className="flex items-center justify-center whitespace-nowrap rounded-lg bg-foreground px-3 py-3 text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
          >
            최근 본 글
          </Link>
          <button
            onClick={onBlogFilterClick}
            className="glass-card flex flex-1 items-center justify-center whitespace-nowrap rounded-lg px-3 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted/60"
          >
            블로그 필터
          </button>
          <button
            onClick={onTagFilterClick}
            className="glass-card flex flex-1 items-center justify-center whitespace-nowrap rounded-lg px-3 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted/60"
          >
            태그 필터
          </button>
        </div>
      </div>
    </>
  );
}
