'use client';

import { useState } from 'react';
import { useResetKey } from '@/hooks';
import { cn } from '@/utils';
import { Check, Search } from 'lucide-react';
import { BlogLogoImage } from '@/components/image';
import { FilterModal } from '@/components/ui';
import type { BlogListItem } from '../hooks/use-blogs';

interface BlogFilterModalProps {
  blogs: BlogListItem[];
  selectedBlogs: string[];
  onBlogsApply: (blogs: string[]) => void;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
}

export function BlogFilterModal({
  blogs,
  selectedBlogs,
  onBlogsApply,
  isOpen,
  onClose,
  isLoading = false,
}: BlogFilterModalProps) {
  const resetKey = useResetKey(isOpen);

  return (
    <BlogFilterModalInner
      key={resetKey}
      blogs={blogs}
      selectedBlogs={selectedBlogs}
      onBlogsApply={onBlogsApply}
      isOpen={isOpen}
      onClose={onClose}
      isLoading={isLoading}
    />
  );
}

function BlogFilterModalInner({
  blogs,
  selectedBlogs,
  onBlogsApply,
  isOpen,
  onClose,
  isLoading = false,
}: BlogFilterModalProps) {
  const [tempSelectedBlogs, setTempSelectedBlogs] = useState<string[]>(selectedBlogs);
  const [searchInput, setSearchInput] = useState('');

  const handleTempToggle = (blogName: string) => {
    setTempSelectedBlogs((prev) =>
      prev.includes(blogName) ? prev.filter((name) => name !== blogName) : [...prev, blogName],
    );
  };

  const handleReset = () => {
    setTempSelectedBlogs([]);
    setSearchInput('');
  };

  const handleComplete = () => {
    onBlogsApply(tempSelectedBlogs);
    onClose();
  };

  const normalizedSearch = searchInput.trim().toLowerCase();
  const visibleBlogs = normalizedSearch
    ? blogs.filter((blog) => blog.name.toLowerCase().includes(normalizedSearch))
    : blogs;

  return (
    <FilterModal
      title="블로그 선택"
      isOpen={isOpen}
      onClose={onClose}
      onReset={handleReset}
      onComplete={handleComplete}
      isLoading={isLoading}
      isEmpty={blogs.length === 0}
      emptyMessage="블로그 정보가 없습니다."
      selectedCount={tempSelectedBlogs.length}
      fixedHeight
    >
      <div className="flex min-h-full flex-col">
        {/* 블로그 이름 빠른 검색 */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="블로그 이름 검색"
            aria-label="블로그 이름 검색"
            className="w-full rounded-xl border border-border bg-muted/50 py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
          />
        </div>

        {visibleBlogs.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-center text-sm text-muted-foreground">
              &lsquo;{searchInput.trim()}&rsquo;에 해당하는 블로그가 없습니다.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {visibleBlogs.map((blog) => {
              const isSelected = tempSelectedBlogs.includes(blog.name);
              return (
                <button
                  key={blog.id}
                  onClick={() => handleTempToggle(blog.name)}
                  aria-pressed={isSelected}
                  className={cn(
                    'relative flex flex-col items-center gap-2 rounded-xl p-3 transition-[colors,box-shadow]',
                    isSelected ? 'glass-card ring-2 ring-foreground' : 'glass-card hover:bg-muted/60',
                  )}
                >
                  {isSelected && (
                    <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground">
                      <Check className="h-3 w-3 text-background" strokeWidth={3} />
                    </span>
                  )}
                  <BlogLogoImage logoUrl={blog.logo_url} companyName={blog.name} width={40} height={40} />
                  <span
                    className={cn(
                      'text-center text-xs font-semibold leading-tight',
                      isSelected ? 'text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {blog.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </FilterModal>
  );
}
