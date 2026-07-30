'use client';

import { useCallback, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useIsBookmarked } from '@/features/bookmarks';
import { ConfirmModal } from '@/components/modal';
import { useClearAllRecentViews, useDeleteRecentView, useRecentViews } from '../hooks';
import { RecentViewsActions } from './recent-views-actions';
import { RecentViewsEmpty } from './recent-views-empty';
import { RecentViewsError } from './recent-views-error';
import { RecentViewsListSkeleton } from './recent-views-list-skeleton';
import { RecentViewPostCard } from './recent-views-post-card';

export function RecentViewsList() {
  // isPending 사용: 로그인 확정 대기(enabled=false) 동안 isLoading은 false라
  // 빈 상태 화면으로 잘못 빠지기 때문에, 데이터가 확정될 때까지 스켈레톤을 유지한다
  const { data: views, isPending, error } = useRecentViews();
  const deleteRecentView = useDeleteRecentView();
  const clearAll = useClearAllRecentViews();
  // 북마크 여부는 리스트 레벨에서 한 번만 계산하여 카드별로 전달
  const isBookmarked = useIsBookmarked();
  const [selected, setSelected] = useState<string[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  // 삭제 확인 모달 대상: 선택 항목('selected') 또는 전체('all')
  const [confirmTarget, setConfirmTarget] = useState<'selected' | 'all' | null>(null);

  const handleSelect = useCallback((postId: string) => {
    setSelected((prev) => (prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]));
  }, []);

  const handleSelectAll = useCallback(() => {
    if (!views) return;
    setSelected((prev) => (prev.length === views.length ? [] : views.map((v) => v.post_id)));
  }, [views]);

  const handleDeleteSelected = useCallback(() => {
    if (selected.length === 0) return;
    setConfirmTarget('selected');
  }, [selected]);

  const handleClearAll = useCallback(() => {
    if (!views || views.length === 0) return;
    setConfirmTarget('all');
  }, [views]);

  const handleConfirmDelete = useCallback(() => {
    if (confirmTarget === 'selected') {
      deleteRecentView.mutate(selected, {
        onSuccess: () => {
          setSelected([]);
          setConfirmTarget(null);
        },
      });
    } else if (confirmTarget === 'all') {
      clearAll.mutate(undefined, {
        onSuccess: () => {
          setSelected([]);
          setIsEditMode(false);
          setConfirmTarget(null);
        },
      });
    }
  }, [confirmTarget, selected, deleteRecentView, clearAll]);

  const toggleEditMode = useCallback(() => {
    setIsEditMode((prev) => !prev);
    setSelected([]);
  }, []);

  if (isPending) {
    return <RecentViewsListSkeleton />;
  }

  if (error) {
    return <RecentViewsError />;
  }

  if (!views || views.length === 0) {
    return <RecentViewsEmpty />;
  }

  return (
    <div>
      <RecentViewsActions
        isEditMode={isEditMode}
        selectedCount={selected.length}
        totalCount={views.length}
        onToggleEditMode={toggleEditMode}
        onSelectAll={handleSelectAll}
        onDeleteSelected={handleDeleteSelected}
        onClearAll={handleClearAll}
      />

      <p className="mb-4 text-sm text-muted-foreground">
        총 <span className="font-semibold text-foreground">{views.length}</span>개
      </p>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {views.map((view) => (
          <RecentViewPostCard
            key={view.post_id}
            view={view}
            isEditMode={isEditMode}
            isSelected={selected.includes(view.post_id)}
            onSelect={handleSelect}
            isBookmarked={isBookmarked(view.post.id)}
          />
        ))}
      </section>

      <ConfirmModal
        open={confirmTarget !== null}
        title={confirmTarget === 'all' ? '전체 삭제' : '선택 항목 삭제'}
        description={
          confirmTarget === 'all'
            ? '모든 최근 본 글 기록을 삭제할까요? 이 작업은 되돌릴 수 없습니다.'
            : `선택한 ${selected.length}개의 기록을 삭제할까요?`
        }
        confirmLabel="삭제"
        destructive
        icon={Trash2}
        isPending={deleteRecentView.isPending || clearAll.isPending}
        pendingLabel="삭제 중..."
        onOpenChange={(open) => {
          if (!open) setConfirmTarget(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
