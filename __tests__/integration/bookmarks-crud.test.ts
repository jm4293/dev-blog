import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAddBookmark } from '@/features/bookmarks/hooks/useAddBookmark';
import { useRemoveBookmark } from '@/features/bookmarks/hooks/useRemoveBookmark';
import { useIsBookmarked } from '@/features/bookmarks/hooks/useIsBookmarked';
import { useBookmarksList } from '@/features/bookmarks/hooks/useBookmarksList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { type ReactNode } from 'react';

// Mock fetch
global.fetch = vi.fn();

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('북마크 CRUD 통합 테스트', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ✅ 통합 테스트 1: 북마크 추가 후 상태 확인
  it('should add bookmark and verify status', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 'bookmark-1',
        user_id: 'user-1',
        post_id: 'post-1',
        created_at: '2026-01-20T00:00:00Z',
      }),
    });

    const { result: addResult } = renderHook(() => useAddBookmark(), {
      wrapper: createWrapper(),
    });

    // 북마크 추가
    const response = await addResult.current.mutateAsync('post-1');
    expect(response.id).toBe('bookmark-1');
    expect(response.post_id).toBe('post-1');

    // API 호출 확인
    expect(global.fetch).toHaveBeenCalledWith('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ post_id: 'post-1' }),
    });
  });

  // ✅ 통합 테스트 2: 북마크 추가 후 제거
  it('should add and then remove bookmark', async () => {
    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'bookmark-1',
          user_id: 'user-1',
          post_id: 'post-1',
          created_at: '2026-01-20T00:00:00Z',
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

    const { result: addResult } = renderHook(() => useAddBookmark(), {
      wrapper: createWrapper(),
    });

    const { result: removeResult } = renderHook(() => useRemoveBookmark(), {
      wrapper: createWrapper(),
    });

    // 북마크 추가
    const addResponse = await addResult.current.mutateAsync('post-1');
    expect(addResponse.id).toBe('bookmark-1');

    // 북마크 제거
    const removeResponse = await removeResult.current.mutateAsync('post-1');
    expect(removeResponse.success).toBe(true);

    // API 호출 확인
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenNthCalledWith(2, '/api/bookmarks?postId=post-1', {
      method: 'DELETE',
    });
  });

  // ✅ 통합 테스트 3: 여러 게시글 북마크 추가 및 상태 확인
  it('should add multiple bookmarks and check status', async () => {
    const bookmarks: any[] = [];

    (global.fetch as any).mockImplementation(async (url: string, options: any) => {
      const body = options?.body ? JSON.parse(options.body) : {};
      const postId = body.post_id;

      if (postId) {
        bookmarks.push({
          id: `bookmark-${postId}`,
          user_id: 'user-1',
          post_id: postId,
        });
      }

      return {
        ok: true,
        json: async () => ({
          id: `bookmark-${postId}`,
          user_id: 'user-1',
          post_id: postId,
        }),
      };
    });

    const { result } = renderHook(() => useAddBookmark(), {
      wrapper: createWrapper(),
    });

    // 3개 북마크 추가
    const response1 = await result.current.mutateAsync('post-1');
    const response2 = await result.current.mutateAsync('post-2');
    const response3 = await result.current.mutateAsync('post-3');

    expect(response1.post_id).toBe('post-1');
    expect(response2.post_id).toBe('post-2');
    expect(response3.post_id).toBe('post-3');

    // 전체 북마크가 3개
    expect(bookmarks).toHaveLength(3);
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });

  // ✅ 통합 테스트 4: 북마크 추가 실패 후 재시도
  it('should handle bookmark add failure and retry', async () => {
    let attemptCount = 0;

    (global.fetch as any).mockImplementation(async () => {
      attemptCount++;

      if (attemptCount === 1) {
        return {
          ok: false,
          json: async () => ({ error: 'Already bookmarked' }),
        };
      }

      return {
        ok: true,
        json: async () => ({
          id: 'bookmark-1',
          user_id: 'user-1',
          post_id: 'post-1',
        }),
      };
    });

    const { result } = renderHook(() => useAddBookmark(), {
      wrapper: createWrapper(),
    });

    // 첫 번째 시도: 실패
    try {
      await result.current.mutateAsync('post-1');
    } catch (error: any) {
      expect(error.message).toBe('Already bookmarked');
    }

    // 두 번째 시도: 성공
    const response = await result.current.mutateAsync('post-1');
    expect(response.id).toBe('bookmark-1');

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  // ✅ 통합 테스트 5: 동시 북마크 추가
  it('should handle concurrent bookmark additions', async () => {
    (global.fetch as any).mockImplementation((url: string, options: any) => {
      const body = JSON.parse(options?.body || '{}');
      const postId = body.post_id;

      return Promise.resolve({
        ok: true,
        json: async () => ({
          id: `bookmark-${postId}`,
          user_id: 'user-1',
          post_id: postId,
        }),
      });
    });

    const { result } = renderHook(() => useAddBookmark(), {
      wrapper: createWrapper(),
    });

    // 3개의 북마크를 동시에 추가
    const promises = [
      result.current.mutateAsync('post-1'),
      result.current.mutateAsync('post-2'),
      result.current.mutateAsync('post-3'),
    ];

    const responses = await Promise.all(promises);

    expect(responses).toHaveLength(3);
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });

  // ✅ 통합 테스트 6: 북마크 제거 후 다시 추가
  it('should remove bookmark and add it back', async () => {
    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'bookmark-1-new',
          user_id: 'user-1',
          post_id: 'post-1',
        }),
      });

    const { result: removeResult } = renderHook(() => useRemoveBookmark(), {
      wrapper: createWrapper(),
    });

    const { result: addResult } = renderHook(() => useAddBookmark(), {
      wrapper: createWrapper(),
    });

    // 북마크 제거
    const removeResponse = await removeResult.current.mutateAsync('post-1');
    expect(removeResponse.success).toBe(true);

    // 같은 게시글 다시 북마크
    const addResponse = await addResult.current.mutateAsync('post-1');
    expect(addResponse.post_id).toBe('post-1');

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  // ✅ 통합 테스트 7: 네트워크 에러 발생 시 처리
  it('should handle network errors during bookmark operations', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error')).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 'bookmark-1',
        user_id: 'user-1',
        post_id: 'post-1',
      }),
    });

    const { result } = renderHook(() => useAddBookmark(), {
      wrapper: createWrapper(),
    });

    // 첫 번째 시도: 네트워크 에러
    try {
      await result.current.mutateAsync('post-1');
    } catch (error: any) {
      expect(error.message).toBe('Network error');
    }

    // 두 번째 시도: 성공
    const response = await result.current.mutateAsync('post-1');
    expect(response.id).toBe('bookmark-1');
  });
});
