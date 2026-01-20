import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCompanies } from './useCompanies';
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

describe('useCompanies 훅', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ✅ 테스트 1: 모든 기업 조회
  it('should fetch all companies', async () => {
    const mockResponse = {
      companies: [
        { id: 'toss', name: '토스', logo_url: 'https://...' },
        { id: 'kakao', name: '카카오', logo_url: 'https://...' },
      ],
      total: 2,
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useCompanies(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.companies).toHaveLength(2);
    expect(result.current.data?.companies[0].name).toBe('토스');
  });

  // ✅ 테스트 2: Featured 기업만 조회
  it('should fetch featured companies only', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        companies: [{ id: 'toss', name: '토스', logo_url: 'https://...', is_featured: true }],
        total: 1,
      }),
    });

    renderHook(() => useCompanies({ featured: true }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    const url = (global.fetch as any).mock.calls[0][0];
    expect(url).toContain('featured=true');
  });

  // ✅ 테스트 3: 모든 기업 조회 (all 파라미터)
  it('should fetch all companies with all parameter', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        companies: [],
        total: 0,
      }),
    });

    renderHook(() => useCompanies({ all: true }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    const url = (global.fetch as any).mock.calls[0][0];
    expect(url).toContain('all=true');
  });

  // ✅ 테스트 4: 에러 처리
  it('should handle fetch errors', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useCompanies(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });

  // ✅ 테스트 5: 기업이 없을 때
  it('should return empty array when no companies exist', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        companies: [],
        total: 0,
      }),
    });

    const { result } = renderHook(() => useCompanies(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.companies).toHaveLength(0);
    expect(result.current.data?.total).toBe(0);
  });

  // ✅ 테스트 6: 여러 조건 조합
  it('should handle multiple parameters', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        companies: [],
        total: 0,
      }),
    });

    renderHook(() => useCompanies({ featured: true, all: true }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    const url = (global.fetch as any).mock.calls[0][0];
    expect(url).toContain('featured=true');
    expect(url).toContain('all=true');
  });

  // ✅ 테스트 7: 캐싱 확인 (queryKey 동일)
  it('should cache results with same parameters', async () => {
    const mockResponse = {
      companies: [{ id: 'toss', name: '토스' }],
      total: 1,
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const { rerender } = renderHook(({ featured }) => useCompanies({ featured }), {
      wrapper: createWrapper(),
      initialProps: { featured: true },
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // 같은 파라미터로 재호출
    rerender({ featured: true });

    // 캐시되어 API 호출 안 됨
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
