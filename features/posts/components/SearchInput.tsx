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
          name="search"
          autoComplete="off"
          aria-label="게시글 검색"
          placeholder="게시글 검색..."
          value={value}
          onChange={onChange}
          className="flex-1 rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
        />
        <Link
          href="/recent-views"
          className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-foreground px-4 py-3 font-semibold text-background transition-colors hover:bg-foreground/90"
        >
          최근 본 글
        </Link>
        <button
          onClick={onCompanyFilterClick}
          className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-muted px-6 py-3 font-semibold text-foreground transition-colors hover:bg-muted/80"
        >
          블로그 필터
        </button>
        <button
          onClick={onTagFilterClick}
          className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-muted px-6 py-3 font-semibold text-foreground transition-colors hover:bg-muted/80"
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
            name="search"
            autoComplete="off"
            aria-label="게시글 검색"
            placeholder="게시글 검색..."
            value={value}
            onChange={onChange}
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
          />
        </div>
        <div className="flex gap-2">
          <Link
            href="/recent-views"
            className="flex items-center justify-center whitespace-nowrap rounded-lg bg-foreground px-3 py-3 text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
          >
            최근 본 글
          </Link>
          <button
            onClick={onCompanyFilterClick}
            className="flex flex-1 items-center justify-center whitespace-nowrap rounded-lg bg-muted px-3 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted/80"
          >
            블로그 필터
          </button>
          <button
            onClick={onTagFilterClick}
            className="flex flex-1 items-center justify-center whitespace-nowrap rounded-lg bg-muted px-3 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted/80"
          >
            태그 필터
          </button>
        </div>
      </div>
    </>
  );
}
