import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useLogout } from './useLogout';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import * as logoutActionModule from '@/features/auth/actions/logout.action';

// Mock modules
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useMutation: (config: any) => {
    return {
      mutateAsync: async () => {
        await config.mutationFn();
        config.onSuccess?.();
      },
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
    };
  },
  useQueryClient: vi.fn(),
}));

vi.mock('@/features/auth/actions/logout.action', () => ({
  logoutAction: vi.fn(),
}));

describe('useLogout 훅', () => {
  let mockRouter: any;
  let mockQueryClient: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock router
    mockRouter = {
      push: vi.fn(),
    };
    (useRouter as any).mockReturnValue(mockRouter);

    // Mock query client
    mockQueryClient = {
      clear: vi.fn(),
    };
    (useQueryClient as any).mockReturnValue(mockQueryClient);
  });

  // ✅ 테스트 1: 로그아웃 호출 성공
  it('should call logoutAction on logout', async () => {
    (logoutActionModule.logoutAction as any).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useLogout());
    await result.current.mutateAsync();

    expect(logoutActionModule.logoutAction).toHaveBeenCalled();
  });

  // ✅ 테스트 2: 로그아웃 후 쿼리 클라이언트 초기화
  it('should clear query client on successful logout', async () => {
    (logoutActionModule.logoutAction as any).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useLogout());
    await result.current.mutateAsync();

    expect(mockQueryClient.clear).toHaveBeenCalled();
  });

  // ✅ 테스트 3: 로그아웃 후 /posts로 리다이렉트
  it('should redirect to /posts on successful logout', async () => {
    (logoutActionModule.logoutAction as any).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useLogout());
    await result.current.mutateAsync();

    expect(mockRouter.push).toHaveBeenCalledWith('/posts');
  });

  // ✅ 테스트 4: 로그아웃 실패 처리
  it('should handle logout errors', async () => {
    const error = new Error('Logout failed');
    (logoutActionModule.logoutAction as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useLogout());

    try {
      await result.current.mutateAsync();
    } catch (e) {
      expect(e).toBe(error);
    }
  });

  // ✅ 테스트 5: 로그아웃 시 순서 확인 (clear → push)
  it('should clear cache before redirecting', async () => {
    const callOrder: string[] = [];

    mockQueryClient.clear = vi.fn(() => {
      callOrder.push('clear');
    });

    mockRouter.push = vi.fn(() => {
      callOrder.push('push');
    });

    (logoutActionModule.logoutAction as any).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useLogout());
    await result.current.mutateAsync();

    expect(callOrder).toEqual(['clear', 'push']);
  });
});
