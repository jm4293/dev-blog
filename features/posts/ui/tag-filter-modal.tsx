'use client';

import { useState } from 'react';
import { useResetKey } from '@/hooks';
import { cn } from '@/utils';
import { Check } from 'lucide-react';
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

function TagFilterModalInner({
  tags,
  selectedTags,
  onTagsApply,
  isOpen,
  onClose,
  isLoading = false,
}: TagFilterModalProps) {
  const [tempSelectedTags, setTempSelectedTags] = useState<string[]>(selectedTags);

  const handleTempToggle = (tag: string) => {
    setTempSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleReset = () => {
    setTempSelectedTags([]);
  };

  const handleComplete = () => {
    onTagsApply(tempSelectedTags);
    onClose();
  };

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
    >
      <div className="grid grid-cols-3 gap-2">
        {tags.map((tag) => {
          const isSelected = tempSelectedTags.includes(tag.name);
          return (
            <button
              key={tag.id}
              onClick={() => handleTempToggle(tag.name)}
              className={cn(
                'relative flex items-center justify-center gap-1.5 rounded-xl px-3 py-3 text-sm font-semibold transition-all',
                isSelected
                  ? 'bg-foreground/10 text-foreground ring-2 ring-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80',
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
    </FilterModal>
  );
}
