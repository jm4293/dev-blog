'use client';

import type { PostSortOption } from '@/utils';
import { Select, SelectOption } from '@/components/ui';

interface SortButtonProps {
  currentSort: PostSortOption;
  onSortChange: (sort: PostSortOption) => void;
}

const SORT_OPTIONS: SelectOption<PostSortOption>[] = [
  { value: 'newest', label: '최신 순' },
  { value: 'oldest', label: '오래된 순' },
  { value: 'popular', label: '인기 순' },
];

export function SortButton({ currentSort, onSortChange }: SortButtonProps) {
  return (
    <Select<PostSortOption>
      value={currentSort}
      onChange={onSortChange}
      options={SORT_OPTIONS}
      ariaLabel="정렬 방식 선택"
    />
  );
}
