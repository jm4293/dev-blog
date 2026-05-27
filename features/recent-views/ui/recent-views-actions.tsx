import { Edit3, Trash2, X } from 'lucide-react';

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
    <div className="mb-6 flex flex-wrap gap-3 border-b border-border pb-4">
      {!isEditMode ? (
        <>
          <button
            onClick={onToggleEditMode}
            className="glass-card inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted/60"
          >
            <Edit3 className="h-4 w-4" />
            편집
          </button>
          <button
            onClick={onClearAll}
            className="inline-flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/20"
          >
            <Trash2 className="h-4 w-4" />
            전체 삭제
          </button>
        </>
      ) : (
        <>
          <button
            onClick={onToggleEditMode}
            className="glass-card inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted/60"
          >
            <X className="h-4 w-4" />
            취소
          </button>
          <button
            onClick={onSelectAll}
            className="glass-card rounded-lg px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted/60"
          >
            {isAllSelected ? '전체 해제' : '전체 선택'}
          </button>
          <button
            onClick={onDeleteSelected}
            disabled={selectedCount === 0}
            className="inline-flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
            선택 삭제 ({selectedCount})
          </button>
        </>
      )}
    </div>
  );
}
