'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useToast } from '@/hooks';
import { useUser } from '@/features/auth';
import { useAddBookmark, useRemoveBookmark } from './index';

const LOGIN_TOOLTIP_DURATION = 5000;

export function useBookmarkToggle(postId: string, isBookmarked: boolean) {
  const { data: user } = useUser();
  const isLoggedIn = !!user;

  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();

  const addBookmarkMutation = useAddBookmark();
  const removeBookmarkMutation = useRemoveBookmark();

  const isLoading = addBookmarkMutation.isPending || removeBookmarkMutation.isPending;

  const [showLoginTooltip, setShowLoginTooltip] = useState(false);
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(tooltipTimerRef.current), []);

  // 로그인 후 지금 보던 페이지로 돌아오도록 복귀 경로를 함께 전달
  const loginUrl = `/auth/login?redirect=${encodeURIComponent(pathname)}`;

  const toggleBookmark = () => {
    if (!isLoggedIn) {
      // 툴팁 안에 로그인 링크가 있으므로 누를 시간을 충분히 준다
      clearTimeout(tooltipTimerRef.current);
      setShowLoginTooltip(true);
      tooltipTimerRef.current = setTimeout(() => setShowLoginTooltip(false), LOGIN_TOOLTIP_DURATION);
      return;
    }

    if (isBookmarked) {
      removeBookmarkMutation.mutate(postId, {
        onSuccess: () => {
          // /bookmarks 목록은 서버 컴포넌트가 렌더하므로 refresh로 카드/개수를 즉시 반영
          if (pathname === '/bookmarks') {
            router.refresh();
          }
          showToast({ message: '즐겨찾기에서 제거했습니다.', type: 'success', duration: 2000 });
        },
        onError: () => {
          showToast({ message: '즐겨찾기 제거에 실패했습니다. 다시 시도해주세요.', type: 'error', duration: 3000 });
        },
      });
    } else {
      addBookmarkMutation.mutate(postId, {
        onSuccess: () => {
          showToast({ message: '즐겨찾기에 저장했습니다.', type: 'success', duration: 2000 });
        },
        onError: () => {
          showToast({ message: '즐겨찾기 저장에 실패했습니다. 다시 시도해주세요.', type: 'error', duration: 3000 });
        },
      });
    }
  };

  return {
    isBookmarked,
    isLoading,
    toggleBookmark,
    showLoginTooltip,
    loginUrl,
  };
}
