import { Edit3, X } from 'lucide-react';

interface RecentViewsActionsProps {
  isEditMode: boolean;
  selectedCount: number;
  totalCount: number;
  onToggleEditMode: () => void;
  onSelectAll: () => void;
  onDeleteSelected: () => void;
  onClearAll: () => void;
}

export function RecentViewsActions({
  isEditMode,
  selectedCount,
  totalCount,
  onToggleEditMode,
  onSelectAll,
  onDeleteSelected,
  onClearAll,
}: RecentViewsActionsProps) {
  const isAllSelected = selectedCount === totalCount;

  return (
    <div className="mb-6 flex flex-wrap gap-3 border-b border-gray-200 pb-4 dark:border-gray-700">
      {!isEditMode ? (
        <>
          <button
            onClick={onToggleEditMode}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Edit3 className="h-4 w-4" />
            편집
          </button>
          <button
            onClick={onClearAll}
            className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            전체 삭제
          </button>
        </>
      ) : (
        <>
          <button
            onClick={onToggleEditMode}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <X className="h-4 w-4" />
            취소
          </button>
          <button
            onClick={onSelectAll}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {isAllSelected ? '전체 해제' : '전체 선택'}
          </button>
          <button
            onClick={onDeleteSelected}
            disabled={selectedCount === 0}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            선택 삭제 ({selectedCount})
          </button>
        </>
      )}
    </div>
  );
}
