'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookmarksResponse, AddBookmarkResponse } from '../services/types';

export const useBookmarks = () => {
  const queryClient = useQueryClient();

  // 즐겨찾기 목록 조회
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: async () => {
      const response = await fetch('/api/bookmarks');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch bookmarks');
      }

      return (await response.json()) as BookmarksResponse;
    },
  });

  // 즐겨찾기 추가
  const addMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add bookmark');
      }

      return (await response.json()) as AddBookmarkResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });

  // 즐겨찾기 삭제
  const removeMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await fetch(`/api/bookmarks?postId=${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove bookmark');
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });

  // 특정 게시글이 즐겨찾기되어 있는지 확인
  const isBookmarked = (postId: string): boolean => {
    return data?.bookmarks?.some((b) => b.post_id === postId) ?? false;
  };

  return {
    bookmarks: data?.bookmarks || [],
    isLoading,
    error: error as Error | null,
    refetch,
    addBookmark: addMutation.mutate,
    removeBookmark: removeMutation.mutate,
    isBookmarked,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
  };
};
