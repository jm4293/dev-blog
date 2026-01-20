import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePosts } from '@/features/posts/hooks/usePosts';
import { useCompanies } from '@/features/posts/hooks/useCompanies';
import { useTags } from '@/features/posts/hooks/useTags';
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

describe('게시글 조회 + 필터링 통합 테스트', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ✅ 통합 테스트 1: 게시글 조회 + 기업 정보 통합
  it('should fetch posts with company information', async () => {
    const mockPosts = {
      posts: [
        {
          id: '1',
          title: 'React 튜토리얼',
          tags: ['React', 'Frontend'],
          company_id: 'toss',
          company: {
            id: 'toss',
            name: '토스',
            logo_url: 'https://...',
          },
          published_at: '2026-01-20T00:00:00Z',
        },
      ],
      total: 1,
      page: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockPosts,
    });

    const { result: postsResult } = renderHook(() => usePosts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(postsResult.current.isSuccess).toBe(true);
    });

    // 게시글 정보 확인
    expect(postsResult.current.data?.posts).toHaveLength(1);
    const post = postsResult.current.data?.posts[0];
    expect(post?.title).toBe('React 튜토리얼');

    // 기업 정보가 함께 있는지 확인
    expect(post?.company).toBeDefined();
    expect(post?.company?.name).toBe('토스');
    expect(post?.company?.logo_url).toBeDefined();
  });

  // ✅ 통합 테스트 2: 검색 + 태그 필터링 동시 적용
  it('should handle search and tag filtering together', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        posts: [
          {
            id: '1',
            title: 'React 성능 최적화',
            tags: ['React', 'Performance'],
            company_id: 'toss',
            company: { id: 'toss', name: '토스' },
            published_at: '2026-01-20T00:00:00Z',
          },
        ],
        total: 1,
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      }),
    });

    const { result } = renderHook(() => usePosts({ search: 'React', tagsString: 'Performance' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // API 호출 확인
    const url = (global.fetch as any).mock.calls[0][0];
    expect(url).toContain('search=React');
    expect(url).toContain('tags=Performance');

    // 결과 확인
    expect(result.current.data?.posts).toHaveLength(1);
    expect(result.current.data?.posts[0].tags).toContain('Performance');
  });

  // ✅ 통합 테스트 3: 회사 필터 + 정렬 동시 적용
  it('should handle company filter and sorting together', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        posts: [
          {
            id: '3',
            title: '카카오 기술 블로그 - 오래된 글',
            tags: [],
            company_id: 'kakao',
            company: { id: 'kakao', name: '카카오' },
            published_at: '2025-12-01T00:00:00Z',
          },
          {
            id: '2',
            title: '카카오 기술 블로그 - 최신 글',
            tags: [],
            company_id: 'kakao',
            company: { id: 'kakao', name: '카카오' },
            published_at: '2026-01-15T00:00:00Z',
          },
        ],
        total: 2,
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      }),
    });

    const { result } = renderHook(() => usePosts({ companiesString: 'kakao', sort: 'oldest' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // API 호출 확인
    const url = (global.fetch as any).mock.calls[0][0];
    expect(url).toContain('companies=kakao');
    expect(url).toContain('sort=oldest');

    // 결과 확인
    expect(result.current.data?.posts).toHaveLength(2);
  });

  // ✅ 통합 테스트 4: 페이지네이션 + 검색 + 필터 모두 함께
  it('should handle pagination with search and filters together', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        posts: [
          {
            id: '1',
            title: 'Post 1',
            tags: ['Frontend'],
            company_id: 'toss',
            company: { id: 'toss', name: '토스' },
            published_at: '2026-01-20T00:00:00Z',
          },
        ],
        total: 50,
        page: 2,
        totalPages: 5,
        hasNextPage: true,
        hasPrevPage: true,
      }),
    });

    const { result } = renderHook(
      () =>
        usePosts({
          page: 2,
          search: 'Tech',
          tagsString: 'Frontend,Backend',
          companiesString: 'toss,kakao',
          sort: 'oldest',
        }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // API 호출 확인
    const url = (global.fetch as any).mock.calls[0][0];
    expect(url).toContain('page=2');
    expect(url).toContain('search=Tech');
    expect(url).toContain('tags=Frontend%2CBackend');
    expect(url).toContain('companies=toss%2Ckakao');
    expect(url).toContain('sort=oldest');

    // 페이지 정보 확인
    expect(result.current.data?.page).toBe(2);
    expect(result.current.data?.hasNextPage).toBe(true);
    expect(result.current.data?.hasPrevPage).toBe(true);
  });

  // ✅ 통합 테스트 5: 회사와 태그 목록 동시 조회
  it('should fetch companies and tags simultaneously', async () => {
    let callCount = 0;

    (global.fetch as any).mockImplementation((url: string) => {
      callCount++;

      if (url.includes('/api/companies')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            companies: [
              { id: 'toss', name: '토스', is_featured: true },
              { id: 'kakao', name: '카카오', is_featured: true },
            ],
            total: 2,
          }),
        });
      }

      if (url.includes('/api/tags')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            tags: [
              { id: '1', name: 'React', category: 'Frontend' },
              { id: '2', name: 'Backend', category: 'Backend' },
            ],
            total: 2,
          }),
        });
      }

      return Promise.reject(new Error('Unknown URL'));
    });

    const { result: companiesResult } = renderHook(() => useCompanies(), {
      wrapper: createWrapper(),
    });

    const { result: tagsResult } = renderHook(() => useTags(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(companiesResult.current.isSuccess).toBe(true);
      expect(tagsResult.current.isSuccess).toBe(true);
    });

    // 회사 정보 확인
    expect(companiesResult.current.data?.companies).toHaveLength(2);
    expect(companiesResult.current.data?.companies[0].name).toBe('토스');

    // 태그 정보 확인
    expect(tagsResult.current.data?.tags).toHaveLength(2);
    expect(tagsResult.current.data?.tags[0].name).toBe('React');

    // API 호출 확인
    expect(callCount).toBeGreaterThanOrEqual(2);
  });

  // ✅ 통합 테스트 6: 에러 발생 시에도 다른 요청은 계속됨
  it('should handle errors independently', async () => {
    let callCount = 0;

    (global.fetch as any).mockImplementation((url: string) => {
      callCount++;

      if (url.includes('/api/companies')) {
        return Promise.resolve({
          ok: false,
          status: 500,
        });
      }

      if (url.includes('/api/tags')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            tags: [{ id: '1', name: 'React' }],
            total: 1,
          }),
        });
      }

      return Promise.reject(new Error('Unknown URL'));
    });

    const { result: companiesResult } = renderHook(() => useCompanies(), {
      wrapper: createWrapper(),
    });

    const { result: tagsResult } = renderHook(() => useTags(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(companiesResult.current.isError).toBe(true);
      expect(tagsResult.current.isSuccess).toBe(true);
    });

    // 회사 조회는 실패했지만
    expect(companiesResult.current.error).toBeDefined();

    // 태그 조회는 성공
    expect(tagsResult.current.data?.tags).toHaveLength(1);
  });
});
