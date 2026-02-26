'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import type { Tag } from '@/supabase/types.supabase';
import { FilterModal } from '../../../components/ui';
import { cn } from '@/utils';

interface TagFilterModalProps {
  tags: Tag[];
  selectedTags: string[];
  onTagsApply: (tags: string[]) => void;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
}

const TagIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"
    />
  </svg>
);

export function TagFilterModal({
  tags,
  selectedTags,
  onTagsApply,
  isOpen,
  onClose,
  isLoading = false,
}: TagFilterModalProps) {
  // key를 사용하여 isOpen이 true가 될 때마다 내부 state를 리셋
  const [openCount, setOpenCount] = useState(0);
  const [wasOpen, setWasOpen] = useState(false);

  if (isOpen && !wasOpen) {
    setOpenCount((c) => c + 1);
    setWasOpen(true);
  }
  if (!isOpen && wasOpen) {
    setWasOpen(false);
  }

  return (
    <TagFilterModalInner
      key={openCount}
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
      icon={<TagIcon />}
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
