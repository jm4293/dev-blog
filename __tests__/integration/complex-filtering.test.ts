import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePosts } from '@/features/posts/hooks/usePosts';
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

describe('복합 필터링 통합 테스트 (검색 + 태그 + 회사 + 정렬)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ✅ 통합 테스트 1: 모든 필터 동시 적용
  it('should apply all filters at once', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        posts: [
          {
            id: '1',
            title: 'React 성능 최적화 - 토스 기술 블로그',
            tags: ['React', 'Performance'],
            company_id: 'toss',
            company: { id: 'toss', name: '토스' },
            published_at: '2026-01-01T00:00:00Z',
          },
        ],
        total: 1,
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      }),
    });

    const { result } = renderHook(
      () =>
        usePosts({
          search: 'React 성능',
          tagsString: 'React,Performance',
          companiesString: 'toss',
          sort: 'newest',
          page: 1,
        }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // URL 검증
    const url = (global.fetch as any).mock.calls[0][0];
    expect(url).toContain('search=React');
    expect(url).toContain('tags=React%2CPerformance');
    expect(url).toContain('companies=toss');
    // sort는 기본값이 'newest'이므로 URL에 포함되지 않음
    expect(url).toContain('page=1');

    // 결과 검증
    expect(result.current.data?.posts).toHaveLength(1);
    const post = result.current.data?.posts[0];
    expect(post?.title).toContain('React');
    expect(post?.tags).toContain('Performance');
  });

  // ✅ 통합 테스트 2: 필터 점진적 변경
  it('should update results when filters change', async () => {
    let callCount = 0;

    (global.fetch as any).mockImplementation(async (url: string) => {
      callCount++;

      if (callCount === 1) {
        // 첫 번째 요청: React 태그만
        return {
          ok: true,
          json: async () => ({
            posts: [
              {
                id: '1',
                title: 'React 튜토리얼',
                tags: ['React'],
                company_id: 'toss',
                company: { id: 'toss', name: '토스' },
                published_at: '2026-01-20T00:00:00Z',
              },
              {
                id: '2',
                title: 'React 고급',
                tags: ['React', 'Advanced'],
                company_id: 'toss',
                company: { id: 'toss', name: '토스' },
                published_at: '2026-01-19T00:00:00Z',
              },
            ],
            total: 2,
            page: 1,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
          }),
        };
      }

      // 두 번째 요청: React + Advanced
      return {
        ok: true,
        json: async () => ({
          posts: [
            {
              id: '2',
              title: 'React 고급',
              tags: ['React', 'Advanced'],
              company_id: 'toss',
              company: { id: 'toss', name: '토스' },
              published_at: '2026-01-19T00:00:00Z',
            },
          ],
          total: 1,
          page: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        }),
      };
    });

    const { result, rerender } = renderHook(({ tagsString }) => usePosts({ tagsString }), {
      wrapper: createWrapper(),
      initialProps: { tagsString: 'React' },
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // 첫 번째: React 태그만
    expect(result.current.data?.posts).toHaveLength(2);

    // 필터 변경: React + Advanced
    rerender({ tagsString: 'React,Advanced' });

    await waitFor(() => {
      expect(result.current.data?.posts?.length).toBe(1);
    });
  });

  // ✅ 통합 테스트 3: 페이지 변경 시 필터 유지
  it('should maintain filters when changing pages', async () => {
    const mockPosts = (page: number) => ({
      posts: Array.from({ length: 20 }, (_, i) => ({
        id: `${page}-${i}`,
        title: `Post ${page}-${i}`,
        tags: ['React', 'Backend'],
        company_id: 'toss',
        company: { id: 'toss', name: '토스' },
        published_at: new Date(2026, 0, 20 - page).toISOString(),
      })),
      total: 50,
      page,
      totalPages: 3,
      hasNextPage: page < 3,
      hasPrevPage: page > 1,
    });

    (global.fetch as any).mockImplementation((url: string) => {
      const urlObj = new URL(url, 'http://localhost');
      const page = parseInt(urlObj.searchParams.get('page') || '1', 10);

      return Promise.resolve({
        ok: true,
        json: async () => mockPosts(page),
      });
    });

    const { result, rerender } = renderHook(
      ({ page }) =>
        usePosts({
          page,
          search: 'React',
          tagsString: 'React,Backend',
          companiesString: 'toss',
        }),
      {
        wrapper: createWrapper(),
        initialProps: { page: 1 },
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.page).toBe(1);
    expect(result.current.data?.hasNextPage).toBe(true);

    // 페이지 2로 변경
    rerender({ page: 2 });

    await waitFor(() => {
      expect(result.current.data?.page).toBe(2);
    });

    // 필터는 유지되고 페이지만 변경됨
    const url = (global.fetch as any).mock.calls[1][0];
    expect(url).toContain('page=2');
    expect(url).toContain('search=React');
    expect(url).toContain('tags=React%2CBackend');
  });

  // ✅ 통합 테스트 4: 빈 검색 결과 처리
  it('should handle empty search results gracefully', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        posts: [],
        total: 0,
        page: 1,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      }),
    });

    const { result } = renderHook(
      () =>
        usePosts({
          search: '존재하지_않는_검색어',
          tagsString: 'React',
        }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.posts).toHaveLength(0);
    expect(result.current.data?.total).toBe(0);
    expect(result.current.data?.hasNextPage).toBe(false);
  });

  // ✅ 통합 테스트 5: 여러 회사 필터링 (OR 조건)
  it('should filter by multiple companies (OR condition)', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        posts: [
          {
            id: '1',
            title: '토스 기술 블로그',
            tags: ['React'],
            company_id: 'toss',
            company: { id: 'toss', name: '토스' },
            published_at: '2026-01-20T00:00:00Z',
          },
          {
            id: '2',
            title: '카카오 기술 블로그',
            tags: ['Backend'],
            company_id: 'kakao',
            company: { id: 'kakao', name: '카카오' },
            published_at: '2026-01-20T00:00:00Z',
          },
        ],
        total: 2,
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      }),
    });

    const { result } = renderHook(() => usePosts({ companiesString: 'toss,kakao' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // 두 회사의 게시글이 모두 포함됨
    expect(result.current.data?.posts).toHaveLength(2);
    expect(result.current.data?.posts[0].company_id).toBe('toss');
    expect(result.current.data?.posts[1].company_id).toBe('kakao');
  });

  // ✅ 통합 테스트 6: 정렬 옵션 확인
  it('should apply sorting correctly', async () => {
    const mockPostsNewest = [
      { id: '3', title: 'Latest', published_at: '2026-01-20T00:00:00Z' },
      { id: '2', title: 'Middle', published_at: '2026-01-15T00:00:00Z' },
      { id: '1', title: 'Oldest', published_at: '2026-01-10T00:00:00Z' },
    ];

    const mockPostsOldest = [
      { id: '1', title: 'Oldest', published_at: '2026-01-10T00:00:00Z' },
      { id: '2', title: 'Middle', published_at: '2026-01-15T00:00:00Z' },
      { id: '3', title: 'Latest', published_at: '2026-01-20T00:00:00Z' },
    ];

    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          posts: mockPostsNewest.map((p) => ({
            ...p,
            tags: [],
            company_id: 'toss',
            company: { id: 'toss', name: '토스' },
          })),
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
          posts: mockPostsOldest.map((p) => ({
            ...p,
            tags: [],
            company_id: 'toss',
            company: { id: 'toss', name: '토스' },
          })),
          total: 3,
          page: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        }),
      });

    // 최신순 조회
    const { result: newestResult } = renderHook(() => usePosts({ sort: 'newest' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(newestResult.current.isSuccess).toBe(true);
    });

    expect(newestResult.current.data?.posts[0].title).toBe('Latest');

    // 오래된순 조회
    const { result: oldestResult } = renderHook(() => usePosts({ sort: 'oldest' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(oldestResult.current.isSuccess).toBe(true);
    });

    expect(oldestResult.current.data?.posts[0].title).toBe('Oldest');
  });
});
