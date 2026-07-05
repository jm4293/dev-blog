'use client';

import { useState } from 'react';
import { useResetKey } from '@/hooks';
import { cn } from '@/utils';
import { Check, Search } from 'lucide-react';
import { FilterModal } from '@/components/ui';
import type { Tag } from '@/supabase/types.supabase';

interface TagFilterModalProps {
  tags: Tag[];
  selectedTags: string[];
  onTagsApply: (tags: string[]) => void;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
}

export function TagFilterModal({
  tags,
  selectedTags,
  onTagsApply,
  isOpen,
  onClose,
  isLoading = false,
}: TagFilterModalProps) {
  const resetKey = useResetKey(isOpen);

  return (
    <TagFilterModalInner
      key={resetKey}
      tags={tags}
      selectedTags={selectedTags}
      onTagsApply={onTagsApply}
      isOpen={isOpen}
      onClose={onClose}
      isLoading={isLoading}
    />
  );
}

/** 태그를 카테고리별로 묶는다 (카테고리 없는 태그는 '기타', 원본 순서 유지) */
function groupTagsByCategory(tags: Tag[]): Array<{ category: string; tags: Tag[] }> {
  const grouped = new Map<string, Tag[]>();

  for (const tag of tags) {
    const category = tag.category || '기타';
    const list = grouped.get(category) || [];
    list.push(tag);
    grouped.set(category, list);
  }

  // '기타'는 항상 마지막
  return Array.from(grouped.entries())
    .sort(([a], [b]) => (a === '기타' ? 1 : b === '기타' ? -1 : 0))
    .map(([category, categoryTags]) => ({ category, tags: categoryTags }));
}

function TagFilterModalInner({
  tags,
  selectedTags,
  onTagsApply,
  isOpen,
  onClose,
  isLoading = false,
}: TagFilterModalProps) {
  const [tempSelectedTags, setTempSelectedTags] = useState<string[]>(selectedTags);
  const [searchInput, setSearchInput] = useState('');

  const handleTempToggle = (tag: string) => {
    setTempSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleReset = () => {
    setTempSelectedTags([]);
    setSearchInput('');
  };

  const handleComplete = () => {
    onTagsApply(tempSelectedTags);
    onClose();
  };

  const normalizedSearch = searchInput.trim().toLowerCase();
  const visibleTags = normalizedSearch ? tags.filter((tag) => tag.name.toLowerCase().includes(normalizedSearch)) : tags;
  const groups = groupTagsByCategory(visibleTags);

  return (
    <FilterModal
      title="태그 선택"
      isOpen={isOpen}
      onClose={onClose}
      onReset={handleReset}
      onComplete={handleComplete}
      isLoading={isLoading}
      isEmpty={tags.length === 0}
      emptyMessage="태그가 없습니다."
      selectedCount={tempSelectedTags.length}
      fixedHeight
    >
      <div className="flex min-h-full flex-col">
        {/* 태그 이름 빠른 검색 */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="태그 이름 검색"
            aria-label="태그 이름 검색"
            className="w-full rounded-xl border border-border bg-muted/50 py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
          />
        </div>

        {visibleTags.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-center text-sm text-muted-foreground">
              &lsquo;{searchInput.trim()}&rsquo;에 해당하는 태그가 없습니다.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {groups.map((group) => (
              <section key={group.category} aria-label={`${group.category} 태그`}>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {group.category}
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {group.tags.map((tag) => {
                    const isSelected = tempSelectedTags.includes(tag.name);
                    return (
                      <button
                        key={tag.id}
                        onClick={() => handleTempToggle(tag.name)}
                        aria-pressed={isSelected}
                        className={cn(
                          'glass-card relative flex items-center justify-center gap-1.5 rounded-xl px-3 py-3 text-sm font-semibold transition-all',
                          isSelected
                            ? 'text-foreground ring-2 ring-foreground'
                            : 'text-muted-foreground hover:bg-muted/60',
                        )}
                      >
                        {isSelected && (
                          <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground">
                            <Check className="h-3 w-3 text-background" strokeWidth={3} />
                          </span>
                        )}
                        {tag.name}
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </FilterModal>
  );
}
