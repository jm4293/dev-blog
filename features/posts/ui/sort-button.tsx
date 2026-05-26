'use client';

import { Select, SelectOption } from '@/components/ui';

type SortValue = 'newest' | 'oldest';

interface SortButtonProps {
  currentSort: SortValue;
  onSortChange: (sort: SortValue) => void;
}

const SORT_OPTIONS: SelectOption<SortValue>[] = [
  { value: 'newest', label: '최신 순' },
  { value: 'oldest', label: '오래된 순' },
];

export function SortButton({ currentSort, onSortChange }: SortButtonProps) {
  return (
    <Select<SortValue> value={currentSort} onChange={onSortChange} options={SORT_OPTIONS} ariaLabel="정렬 방식 선택" />
  );
}
