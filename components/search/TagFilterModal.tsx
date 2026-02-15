'use client';

import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import type { Tag } from '@/supabase/types.supabase';
import { FilterModal } from '../ui';
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
  const [tempSelectedTags, setTempSelectedTags] = useState<string[]>(selectedTags);

  useEffect(() => {
    if (isOpen) {
      setTempSelectedTags(selectedTags);
    }
  }, [isOpen, selectedTags]);

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
                  ? 'bg-blue-50 text-blue-700 ring-2 ring-blue-500 dark:bg-blue-900/20 dark:text-blue-300 dark:ring-blue-400'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
              )}
            >
              {isSelected && (
                <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 dark:bg-blue-400">
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
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
