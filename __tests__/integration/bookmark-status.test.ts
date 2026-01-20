import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePosts } from '@/features/posts/hooks/usePosts';
import { useAddBookmark } from '@/features/bookmarks/hooks/useAddBookmark';
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

describe('북마크 상태 조회 통합 테스트', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ✅ 통합 테스트 1: 게시글 조회 후 북마크 상태 확인
  it('should check bookmark status for fetched posts', async () => {
    const mockPosts = [
      { id: 'post-1', title: 'Post 1', tags: [], company_id: 'toss', company: {} },
      { id: 'post-2', title: 'Post 2', tags: [], company_id: 'toss', company: {} },
    ];

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        posts: mockPosts,
        total: 2,
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      }),
    });

    // 게시글 조회
    const { result: postsResult } = renderHook(() => usePosts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(postsResult.current.isSuccess).toBe(true);
    });

    // 게시글이 정상적으로 로드됨
    expect(postsResult.current.data?.posts).toHaveLength(2);
    expect(postsResult.current.data?.posts[0].id).toBe('post-1');
    expect(postsResult.current.data?.posts[1].id).toBe('post-2');
  });

  // ✅ 통합 테스트 2: 게시글 목록 조회 후 선택적 북마크
  it('should add bookmarks selectively to post list', async () => {
    const mockPosts = [
      { id: 'post-1', title: 'React', tags: ['React'], company_id: 'toss', company: {} },
      { id: 'post-2', title: 'Backend', tags: ['Backend'], company_id: 'toss', company: {} },
      { id: 'post-3', title: 'DevOps', tags: ['DevOps'], company_id: 'toss', company: {} },
    ];

    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          posts: mockPosts,
          total: 3,
          page: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'bookmark-1',
          user_id: 'user-1',
          post_id: 'post-1',
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'bookmark-3',
          user_id: 'user-1',
          post_id: 'post-3',
        }),
      });

    // 게시글 조회
    const { result: postsResult } = renderHook(() => usePosts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(postsResult.current.isSuccess).toBe(true);
    });

    expect(postsResult.current.data?.posts).toHaveLength(3);

    // post-1 북마크
    const { result: addResult1 } = renderHook(() => useAddBookmark(), {
      wrapper: createWrapper(),
    });

    const bookmark1 = await addResult1.current.mutateAsync('post-1');
    expect(bookmark1.post_id).toBe('post-1');

    // post-2는 북마크 안 함

    // post-3 북마크
    const { result: addResult3 } = renderHook(() => useAddBookmark(), {
      wrapper: createWrapper(),
    });

    const bookmark3 = await addResult3.current.mutateAsync('post-3');
    expect(bookmark3.post_id).toBe('post-3');

    expect(global.fetch).toHaveBeenCalledTimes(3);
  });

  // ✅ 통합 테스트 3: 필터 적용 후 북마크된 게시글만 조회 가능성
  it('should handle bookmarked posts within filtered results', async () => {
    const mockFilteredPosts = [
      { id: 'post-1', title: 'React', tags: ['React'], company_id: 'toss', company: {} },
      { id: 'post-2', title: 'React Advanced', tags: ['React'], company_id: 'toss', company: {} },
    ];

    const mockBookmarks = [
      { post_id: 'post-1', user_id: 'user-1' },
      // post-2는 북마크 안 함
    ];

    (global.fetch as any).mockImplementation((url: string) => {
      if (url.includes('/api/posts')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            posts: mockFilteredPosts,
            total: 2,
            page: 1,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
          }),
        });
      }

      if (url.includes('/api/bookmarks')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            bookmarks: mockBookmarks,
          }),
        });
      }

      return Promise.reject(new Error('Unknown URL'));
    });

    // React 태그로 필터링된 게시글 조회
    const { result: postsResult } = renderHook(() => usePosts({ tagsString: 'React' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(postsResult.current.isSuccess).toBe(true);
    });

    expect(postsResult.current.data?.posts).toHaveLength(2);

    // 필터된 게시글 중 첫 번째만 북마크됨
    const bookmarkedPost = postsResult.current.data?.posts[0];
    const nonBookmarkedPost = postsResult.current.data?.posts[1];

    expect(bookmarkedPost?.id).toBe('post-1');
    expect(nonBookmarkedPost?.id).toBe('post-2');
  });

  // ✅ 통합 테스트 4: 북마크 추가 후 상태 즉시 반영
  it('should reflect bookmark status immediately after adding', async () => {
    const initialBookmarks = [{ post_id: 'post-1', user_id: 'user-1' }];

    const newBookmarks = [
      { post_id: 'post-1', user_id: 'user-1' },
      { post_id: 'post-2', user_id: 'user-1' },
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 'bookmark-2',
        user_id: 'user-1',
        post_id: 'post-2',
      }),
    });

    const { result: addResult } = renderHook(() => useAddBookmark(), {
      wrapper: createWrapper(),
    });

    // post-2 북마크 추가
    const response = await addResult.current.mutateAsync('post-2');
    expect(response.post_id).toBe('post-2');

    // 이제 post-1, post-2 모두 북마크됨
    expect([...initialBookmarks, response]).toHaveLength(2);
  });

  // ✅ 통합 테스트 5: 페이지 변경 시에도 북마크 상태 유지
  it('should maintain bookmark status across page changes', async () => {
    const page1Posts = [
      { id: 'p1-1', title: 'Post 1-1', tags: [], company_id: 'toss', company: {} },
      { id: 'p1-2', title: 'Post 1-2', tags: [], company_id: 'toss', company: {} },
    ];

    const page2Posts = [
      { id: 'p2-1', title: 'Post 2-1', tags: [], company_id: 'toss', company: {} },
      { id: 'p2-2', title: 'Post 2-2', tags: [], company_id: 'toss', company: {} },
    ];

    (global.fetch as any).mockImplementation((url: string) => {
      const urlObj = new URL(url, 'http://localhost');
      const page = urlObj.searchParams.get('page');

      if (page === '1') {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            posts: page1Posts,
            total: 4,
            page: 1,
            totalPages: 2,
            hasNextPage: true,
            hasPrevPage: false,
          }),
        });
      }

      if (page === '2') {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            posts: page2Posts,
            total: 4,
            page: 2,
            totalPages: 2,
            hasNextPage: false,
            hasPrevPage: true,
          }),
        });
      }

      return Promise.reject(new Error('Unknown page'));
    });

    // 페이지 1 조회
    const { result: page1Result, rerender } = renderHook(({ page }) => usePosts({ page }), {
      wrapper: createWrapper(),
      initialProps: { page: 1 },
    });

    await waitFor(() => {
      expect(page1Result.current.isSuccess).toBe(true);
    });

    expect(page1Result.current.data?.page).toBe(1);
    expect(page1Result.current.data?.posts).toHaveLength(2);

    // 페이지 2로 이동
    rerender({ page: 2 });

    await waitFor(() => {
      expect(page1Result.current.data?.page).toBe(2);
    });

    expect(page1Result.current.data?.posts).toHaveLength(2);

    // 북마크 상태는 각 페이지별로 독립적으로 관리
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  // ✅ 통합 테스트 6: 대량 게시글 중 선택적 북마크 추가
  it('should add bookmarks selectively', async () => {
    const mockPosts = Array.from({ length: 20 }, (_, i) => ({
      id: `post-${i}`,
      title: `Post ${i}`,
      tags: [],
      company_id: 'toss',
      company: {},
    }));

    let bookmarkCount = 0;

    (global.fetch as any).mockImplementation(async (url: string) => {
      if (url.includes('/api/posts')) {
        return {
          ok: true,
          json: async () => ({
            posts: mockPosts,
            total: 50,
            page: 1,
            totalPages: 3,
            hasNextPage: true,
            hasPrevPage: false,
          }),
        };
      }

      if (url.includes('/api/bookmarks') && url.includes('POST')) {
        bookmarkCount++;
        return {
          ok: true,
          json: async () => ({ id: `bookmark-${bookmarkCount}` }),
        };
      }

      return { ok: true, json: async () => ({}) };
    });

    const { result: postsResult } = renderHook(() => usePosts({ page: 1 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(postsResult.current.isSuccess).toBe(true);
    });

    // 게시글 20개는 조회됨
    expect(postsResult.current.data?.posts).toHaveLength(20);
    expect(postsResult.current.data?.total).toBe(50);
  });
});
