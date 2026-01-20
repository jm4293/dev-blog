import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAddBookmark } from './useAddBookmark';
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

describe('useAddBookmark 훅', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ✅ 테스트 1: 북마크 추가 성공
  it('should add bookmark successfully', async () => {
    const mockResponse = {
      id: 'bookmark-1',
      user_id: 'user-1',
      post_id: 'post-1',
      created_at: '2026-01-20T00:00:00Z',
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useAddBookmark(), {
      wrapper: createWrapper(),
    });

    const response = await result.current.mutateAsync('post-1');

    expect(response.id).toBe('bookmark-1');
    expect(response.post_id).toBe('post-1');
  });

  // ✅ 테스트 2: 올바른 API 호출 확인
  it('should call POST /api/bookmarks with correct data', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'bookmark-1' }),
    });

    const { result } = renderHook(() => useAddBookmark(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync('post-123');

    expect(global.fetch).toHaveBeenCalledWith('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ post_id: 'post-123' }),
    });
  });

  // ✅ 테스트 3: 에러 처리
  it('should handle error when adding bookmark fails', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Already bookmarked' }),
    });

    const { result } = renderHook(() => useAddBookmark(), {
      wrapper: createWrapper(),
    });

    try {
      await result.current.mutateAsync('post-1');
    } catch (error: any) {
      expect(error.message).toBe('Already bookmarked');
    }
  });

  // ✅ 테스트 4: mutateAsync가 정상적으로 작동
  it('should execute mutateAsync without errors', async () => {
    const mockResponse = {
      id: 'bookmark-1',
      user_id: 'user-1',
      post_id: 'post-1',
      created_at: '2026-01-20T00:00:00Z',
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useAddBookmark(), {
      wrapper: createWrapper(),
    });

    // 낙관적 업데이트 실행
    const response = await result.current.mutateAsync('post-1');

    // 응답이 올바른 형식인지 확인
    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('post_id');
    expect(response.id).toBe('bookmark-1');
  });

  // ✅ 테스트 5: 네트워크 에러 처리
  it('should handle network errors', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useAddBookmark(), {
      wrapper: createWrapper(),
    });

    try {
      await result.current.mutateAsync('post-1');
    } catch (error: any) {
      expect(error.message).toBe('Network error');
    }
  });
});
