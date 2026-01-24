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
    <div className="flex flex-wrap gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
      {!isEditMode ? (
        <>
          <button
            onClick={onToggleEditMode}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors inline-flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            편집
          </button>
          <button
            onClick={onClearAll}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-600 dark:bg-gray-700 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          >
            전체 삭제
          </button>
        </>
      ) : (
        <>
          <button
            onClick={onToggleEditMode}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors inline-flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            취소
          </button>
          <button
            onClick={onSelectAll}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {isAllSelected ? '전체 해제' : '전체 선택'}
          </button>
          <button
            onClick={onDeleteSelected}
            disabled={selectedCount === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            선택 삭제 ({selectedCount})
          </button>
        </>
      )}
    </div>
  );
}
