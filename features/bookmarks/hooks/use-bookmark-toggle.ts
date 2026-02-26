'use client';

import { useState, useEffect } from 'react';
import { useAddBookmark, useRemoveBookmark, useIsBookmarked } from './index';

export function useBookmarkToggle(postId: string, isLoggedIn: boolean) {
  const addBookmarkMutation = useAddBookmark();
  const removeBookmarkMutation = useRemoveBookmark();
  const isBookmarkedFn = useIsBookmarked();

  const serverBookmarked = isBookmarkedFn(postId);
  const isLoading = addBookmarkMutation.isPending || removeBookmarkMutation.isPending;

  // 낙관적 상태: 로컬 상태로 UI 즉시 업데이트
  const [optimisticBookmarked, setOptimisticBookmarked] = useState(serverBookmarked);
  const [showLoginTooltip, setShowLoginTooltip] = useState(false);

  // API 응답이 도착하면 서버 상태로 동기화 (최초 로드 시 하트 표시를 위해 필요)
  useEffect(() => {
    setOptimisticBookmarked(serverBookmarked);
  }, [serverBookmarked]);

  const toggleBookmark = () => {
    // 비로그인 시 툴팁 표시하고 API 호출 차단
    if (!isLoggedIn) {
      setShowLoginTooltip(true);
      setTimeout(() => setShowLoginTooltip(false), 2000);
      return;
    }

    // 낙관적 업데이트: 즉시 UI 변경
    setOptimisticBookmarked(!optimisticBookmarked);

    // 서버 요청
    if (optimisticBookmarked) {
      removeBookmarkMutation.mutate(postId, {
        onError: () => {
          // 에러 발생 시 서버 상태로 되돌리기
          setOptimisticBookmarked(serverBookmarked);
        },
      });
    } else {
      addBookmarkMutation.mutate(postId, {
        onError: () => {
          // 에러 발생 시 서버 상태로 되돌리기
          setOptimisticBookmarked(serverBookmarked);
        },
      });
    }
  };

  return {
    isBookmarked: optimisticBookmarked,
    isLoading,
    toggleBookmark,
    showLoginTooltip,
  };
}
