import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useTags } from './useTags';
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

describe('useTags 훅', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ✅ 테스트 1: 모든 태그 조회 (기본 설정)
  it('should fetch tags with default parameters', async () => {
    const mockResponse = {
      tags: [
        { id: '1', name: 'React', category: 'Frontend' },
        { id: '2', name: 'Backend', category: 'Backend' },
      ],
      total: 2,
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useTags(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.tags).toHaveLength(2);
    expect(result.current.data?.tags[0].name).toBe('React');
  });

  // ✅ 테스트 2: Featured 태그만 조회
  it('should fetch featured tags only', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        tags: [{ id: '1', name: 'React', category: 'Frontend', is_featured: true }],
        total: 1,
      }),
    });

    renderHook(() => useTags({ featured: true }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    const url = (global.fetch as any).mock.calls[0][0];
    expect(url).toContain('featured=true');
  });

  // ✅ 테스트 3: 카테고리별 태그 조회
  it('should fetch tags by category', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        tags: [
          { id: '1', name: 'React', category: 'Frontend' },
          { id: '2', name: 'Vue', category: 'Frontend' },
        ],
        total: 2,
      }),
    });

    renderHook(() => useTags({ category: 'Frontend' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    const url = (global.fetch as any).mock.calls[0][0];
    expect(url).toContain('category=Frontend');
  });

  // ✅ 테스트 4: 정렬 옵션 (name)
  it('should support sort by name', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tags: [], total: 0 }),
    });

    renderHook(() => useTags({ sort: 'name' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    const url = (global.fetch as any).mock.calls[0][0];
    expect(url).toContain('sort=name');
  });

  // ✅ 테스트 5: 정렬 옵션 (usage)
  it('should support sort by usage', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tags: [], total: 0 }),
    });

    renderHook(() => useTags({ sort: 'usage' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    const url = (global.fetch as any).mock.calls[0][0];
    expect(url).toContain('sort=usage');
  });

  // ✅ 테스트 6: 정렬 옵션 (featured)
  it('should support sort by featured', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tags: [], total: 0 }),
    });

    renderHook(() => useTags({ sort: 'featured' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    const url = (global.fetch as any).mock.calls[0][0];
    expect(url).toContain('sort=featured');
  });

  // ✅ 테스트 7: 여러 옵션 조합
  it('should handle multiple options together', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tags: [], total: 0 }),
    });

    renderHook(() => useTags({ featured: true, category: 'Backend', sort: 'usage' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    const url = (global.fetch as any).mock.calls[0][0];
    expect(url).toContain('featured=true');
    expect(url).toContain('category=Backend');
    expect(url).toContain('sort=usage');
  });

  // ✅ 테스트 8: 에러 처리
  it('should handle fetch errors', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useTags(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });

  // ✅ 테스트 9: 태그가 없을 때
  it('should return empty array when no tags exist', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        tags: [],
        total: 0,
      }),
    });

    const { result } = renderHook(() => useTags(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.tags).toHaveLength(0);
    expect(result.current.data?.total).toBe(0);
  });

  // ✅ 테스트 10: 캐싱 (같은 파라미터)
  it('should cache results with same parameters', async () => {
    const mockResponse = {
      tags: [{ id: '1', name: 'React', category: 'Frontend' }],
      total: 1,
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const { rerender } = renderHook(({ category }) => useTags({ category }), {
      wrapper: createWrapper(),
      initialProps: { category: 'Frontend' },
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // 같은 파라미터로 재호출
    rerender({ category: 'Frontend' });

    // 캐시되어 API 호출 안 됨
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
