'use client';

import { useState, useEffect } from 'react';
import type { Tag } from '@/supabase/types.supabase';
import { FilterModal } from '../ui';

interface TagFilterModalProps {
  tags: Tag[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
}

export function TagFilterModal({
  tags,
  selectedTags,
  onTagToggle,
  isOpen,
  onClose,
  isLoading = false,
}: TagFilterModalProps) {
  // 모달 내 임시 상태 (모달이 열릴 때 초기화)
  const [tempSelectedTags, setTempSelectedTags] = useState<string[]>(selectedTags);

  // 모달이 열릴 때 현재 선택상태로 임시상태 초기화
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
    // 변경된 항목들만 toggle 호출
    selectedTags.forEach((tag) => {
      if (!tempSelectedTags.includes(tag)) {
        onTagToggle(tag);
      }
    });
    tempSelectedTags.forEach((tag) => {
      if (!selectedTags.includes(tag)) {
        onTagToggle(tag);
      }
    });
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
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => handleTempToggle(tag.name)}
            className={`p-4 rounded-lg font-semibold transition-all ${
              tempSelectedTags.includes(tag.name)
                ? 'bg-blue-600 text-white dark:bg-blue-500'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {tag.name}
          </button>
        ))}
      </div>
    </FilterModal>
  );
}
