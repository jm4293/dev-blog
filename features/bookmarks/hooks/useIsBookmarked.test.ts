import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useIsBookmarked } from './useIsBookmarked';
import { useBookmarksList } from './useBookmarksList';

// useBookmarksList 모킹
vi.mock('./useBookmarksList', () => ({
  useBookmarksList: vi.fn(),
}));

describe('useIsBookmarked 훅', () => {
  // ✅ 테스트 1: 북마크된 게시글 확인
  it('should return true for bookmarked post', () => {
    const mockBookmarks = [
      { post_id: 'post-1', user_id: 'user-1' },
      { post_id: 'post-2', user_id: 'user-1' },
    ];

    (useBookmarksList as any).mockReturnValue({
      data: { bookmarks: mockBookmarks },
    });

    const { result } = renderHook(() => useIsBookmarked());
    const isBookmarked = result.current('post-1');

    expect(isBookmarked).toBe(true);
  });

  // ✅ 테스트 2: 북마크되지 않은 게시글 확인
  it('should return false for non-bookmarked post', () => {
    const mockBookmarks = [{ post_id: 'post-1', user_id: 'user-1' }];

    (useBookmarksList as any).mockReturnValue({
      data: { bookmarks: mockBookmarks },
    });

    const { result } = renderHook(() => useIsBookmarked());
    const isBookmarked = result.current('post-999');

    expect(isBookmarked).toBe(false);
  });

  // ✅ 테스트 3: 북마크 목록이 없을 때 처리
  it('should return false when bookmarks list is empty', () => {
    (useBookmarksList as any).mockReturnValue({
      data: { bookmarks: [] },
    });

    const { result } = renderHook(() => useIsBookmarked());
    const isBookmarked = result.current('post-1');

    expect(isBookmarked).toBe(false);
  });

  // ✅ 테스트 4: 데이터가 undefined일 때 처리
  it('should return false when data is undefined', () => {
    (useBookmarksList as any).mockReturnValue({
      data: undefined,
    });

    const { result } = renderHook(() => useIsBookmarked());
    const isBookmarked = result.current('post-1');

    expect(isBookmarked).toBe(false);
  });

  // ✅ 테스트 5: 여러 게시글 확인
  it('should correctly check multiple posts', () => {
    const mockBookmarks = [
      { post_id: 'post-1', user_id: 'user-1' },
      { post_id: 'post-2', user_id: 'user-1' },
      { post_id: 'post-3', user_id: 'user-1' },
    ];

    (useBookmarksList as any).mockReturnValue({
      data: { bookmarks: mockBookmarks },
    });

    const { result } = renderHook(() => useIsBookmarked());

    expect(result.current('post-1')).toBe(true);
    expect(result.current('post-2')).toBe(true);
    expect(result.current('post-3')).toBe(true);
    expect(result.current('post-999')).toBe(false);
  });
});
