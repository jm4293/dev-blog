'use client';

import { useState, useEffect } from 'react';
import { useAddBookmark, useRemoveBookmark, useIsBookmarked } from './index';

export function useBookmarkToggle(postId: string) {
  const addBookmarkMutation = useAddBookmark();
  const removeBookmarkMutation = useRemoveBookmark();
  const isBookmarkedFn = useIsBookmarked();

  const serverBookmarked = isBookmarkedFn(postId);
  const isLoading = addBookmarkMutation.isPending || removeBookmarkMutation.isPending;

  // 낙관적 상태: 로컬 상태로 UI 즉시 업데이트
  const [optimisticBookmarked, setOptimisticBookmarked] = useState(serverBookmarked);

  // 서버 상태가 변경되면 낙관적 상태 동기화
  useEffect(() => {
    setOptimisticBookmarked(serverBookmarked);
  }, [serverBookmarked]);

  const toggleBookmark = () => {
    // 낙관적 업데이트: 즉시 UI 변경
    setOptimisticBookmarked(!optimisticBookmarked);

    // 서버 요청
    if (optimisticBookmarked) {
      removeBookmarkMutation.mutate(postId, {
        onError: () => {
          // 에러 발생 시 낙관적 상태 되돌리기
          setOptimisticBookmarked(!optimisticBookmarked);
        },
      });
    } else {
      addBookmarkMutation.mutate(postId, {
        onError: () => {
          // 에러 발생 시 낙관적 상태 되돌리기
          setOptimisticBookmarked(!optimisticBookmarked);
        },
      });
    }
  };

  return {
    isBookmarked: optimisticBookmarked,
    isLoading,
    toggleBookmark,
  };
}
