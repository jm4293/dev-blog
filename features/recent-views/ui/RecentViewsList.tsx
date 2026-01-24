'use client';

import { useState, useCallback } from 'react';
import { useRecentViews, useDeleteViews, useClearAllViews } from '../hooks';
import { RecentViewsListSkeleton } from './RecentViewsListSkeleton';
import { RecentViewsEmpty } from './RecentViewsEmpty';
import { RecentViewsError } from './RecentViewsError';
import { RecentViewsActions } from './RecentViewsActions';
import { RecentViewPostCard } from './RecentViewPostCard';

interface RecentViewsListProps {
  isLoggedIn: boolean;
}

export function RecentViewsList({ isLoggedIn }: RecentViewsListProps) {
  const { data: views, isLoading, error } = useRecentViews(isLoggedIn);
  const deleteViews = useDeleteViews(isLoggedIn);
  const clearAll = useClearAllViews(isLoggedIn);
  const [selected, setSelected] = useState<string[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleSelect = useCallback((postId: string) => {
    setSelected((prev) => (prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]));
  }, []);

  const handleSelectAll = useCallback(() => {
    if (!views) return;
    setSelected((prev) => (prev.length === views.length ? [] : views.map((v) => v.post_id)));
  }, [views]);

  const handleDeleteSelected = useCallback(() => {
    if (selected.length === 0) return;
    if (!confirm(`선택한 ${selected.length}개의 항목을 삭제하시겠습니까?`)) return;

    deleteViews.mutate(selected, {
      onSuccess: () => setSelected([]),
    });
  }, [selected, deleteViews]);

  const handleClearAll = useCallback(() => {
    if (!views || views.length === 0) return;
    if (!confirm('모든 최근 본 글을 삭제하시겠습니까?')) return;

    clearAll.mutate(undefined, {
      onSuccess: () => {
        setSelected([]);
        setIsEditMode(false);
      },
    });
  }, [views, clearAll]);

  const toggleEditMode = useCallback(() => {
    setIsEditMode((prev) => !prev);
    setSelected([]);
  }, []);

  if (isLoading) {
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

      {/* Recent Views Count */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        총 <span className="font-semibold text-blue-600 dark:text-blue-400">{views.length}</span>개
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {views.map((view) => (
          <RecentViewPostCard
            key={view.post_id}
            view={view}
            isEditMode={isEditMode}
            isSelected={selected.includes(view.post_id)}
            isLoggedIn={isLoggedIn}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  );
}
