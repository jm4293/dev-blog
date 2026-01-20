import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useRemoveBookmark } from './useRemoveBookmark';
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

describe('useRemoveBookmark 훅', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ✅ 테스트 1: 북마크 제거 성공
  it('should remove bookmark successfully', async () => {
    const mockResponse = { success: true };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useRemoveBookmark(), {
      wrapper: createWrapper(),
    });

    const response = await result.current.mutateAsync('post-1');

    expect(response.success).toBe(true);
  });

  // ✅ 테스트 2: 올바른 API 호출 확인 (DELETE)
  it('should call DELETE /api/bookmarks with correct postId', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const { result } = renderHook(() => useRemoveBookmark(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync('post-123');

    expect(global.fetch).toHaveBeenCalledWith('/api/bookmarks?postId=post-123', {
      method: 'DELETE',
    });
  });

  // ✅ 테스트 3: 여러 게시글 북마크 제거
  it('should handle removing multiple bookmarks', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    const { result } = renderHook(() => useRemoveBookmark(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync('post-1');
    await result.current.mutateAsync('post-2');
    await result.current.mutateAsync('post-3');

    expect(global.fetch).toHaveBeenCalledTimes(3);
  });

  // ✅ 테스트 4: 에러 처리
  it('should handle error when removing bookmark fails', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Bookmark not found' }),
    });

    const { result } = renderHook(() => useRemoveBookmark(), {
      wrapper: createWrapper(),
    });

    try {
      await result.current.mutateAsync('post-999');
    } catch (error: any) {
      expect(error.message).toBe('Bookmark not found');
    }
  });

  // ✅ 테스트 5: 북마크 제거 요청이 정상적으로 실행
  it('should execute delete request successfully', async () => {
    const mockResponse = { success: true };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useRemoveBookmark(), {
      wrapper: createWrapper(),
    });

    // 북마크 제거 실행
    const response = await result.current.mutateAsync('post-1');

    // 응답 확인
    expect(response.success).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith('/api/bookmarks?postId=post-1', {
      method: 'DELETE',
    });
  });

  // ✅ 테스트 6: 네트워크 에러 처리
  it('should handle network errors', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useRemoveBookmark(), {
      wrapper: createWrapper(),
    });

    try {
      await result.current.mutateAsync('post-1');
    } catch (error: any) {
      expect(error.message).toBe('Network error');
    }
  });
});
