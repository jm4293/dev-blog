import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePosts } from './usePosts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { type ReactNode } from 'react';

// Mock fetch
global.fetch = vi.fn();

// QueryClient 래퍼 (React Query 필요)
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('usePosts 훅', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ✅ 테스트 1: 기본 요청
  it('should fetch posts with default parameters', async () => {
    const mockResponse = {
      posts: [
        {
          id: '1',
          title: 'React 튜토리얼',
          tags: ['React'],
          company_id: 'toss',
          published_at: '2026-01-01',
        },
      ],
      total: 1,
      page: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => usePosts(), {
      wrapper: createWrapper(),
    });

    // 로딩 상태 확인
    expect(result.current.isPending).toBe(true);

    // 데이터 로드 대기
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // 데이터 검증
    expect(result.current.data?.posts).toHaveLength(1);
    expect(result.current.data?.posts[0].title).toBe('React 튜토리얼');
  });

  // ✅ 테스트 2: 검색 파라미터 포함
  it('should include search parameter in request URL', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        posts: [],
        total: 0,
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      }),
    });

    renderHook(() => usePosts({ search: 'React' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    // URL에 search 파라미터 포함 확인
    const url = (global.fetch as any).mock.calls[0][0];
    expect(url).toContain('search=React');
  });

  // ✅ 테스트 3: 태그 필터링 파라미터
  it('should include tags parameter in request URL', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        posts: [],
        total: 0,
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      }),
    });

    renderHook(() => usePosts({ tagsString: 'React,Backend' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    const url = (global.fetch as any).mock.calls[0][0];
    expect(url).toContain('tags=React%2CBackend');
  });

  // ✅ 테스트 4: 페이지네이션 파라미터
  it('should include page parameter in request URL', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        posts: [],
        total: 0,
        page: 2,
        totalPages: 5,
        hasNextPage: true,
        hasPrevPage: true,
      }),
    });

    renderHook(() => usePosts({ page: 2 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    const url = (global.fetch as any).mock.calls[0][0];
    expect(url).toContain('page=2');
  });

  // ✅ 테스트 5: 에러 처리
  it('should handle fetch errors', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => usePosts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });
});
