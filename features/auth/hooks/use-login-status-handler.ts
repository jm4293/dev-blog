'use client';

import { useEffect } from 'react';
import { useToast } from '@/hooks';
import { getLocalStorage } from '@/utils';
import { useQueryClient } from '@tanstack/react-query';
// 루트 배럴(@/features/recent-views)은 이 feature(auth)를 역참조하는 훅을 포함해
// 순환 import가 생기므로, 의존이 없는 하위 모듈만 직접 가져온다
import { syncRecentViewsAction } from '@/features/recent-views/actions';
import { RECENT_VIEWS_STORAGE_KEY, type RecentView } from '@/features/recent-views/services';
import { queryKeys } from '@/lib/query-keys';

const LOGIN_COOKIE = 'login_success';

/**
 * 로그인 성공 토스트 처리 + 로컬 열람 기록 이관
 *
 * 콜백 라우트가 심어준 1회용 쿠키를 읽고 즉시 삭제한다.
 * URL 파라미터(?login=success) 방식은 라우터 캐시/히스토리에 남아
 * 재방문 시 토스트가 다시 뜨는 문제가 있어 쿠키로 대체했다.
 */
export function useLoginStatusHandler() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const hasLoginCookie = document.cookie.split('; ').some((cookie) => cookie.startsWith(`${LOGIN_COOKIE}=`));

    if (!hasLoginCookie) {
      return;
    }

    // 먼저 삭제해서 어떤 경우에도 한 번만 발화
    document.cookie = `${LOGIN_COOKIE}=; Max-Age=0; path=/`;

    showToast({
      message: '로그인 성공! devBlog.kr에 오신 것을 환영합니다.',
      type: 'success',
      duration: 3000,
    });

    // 비로그인 상태에서 쌓인 최근 본 글을 계정으로 1회 이관
    // (이관하지 않으면 로그인 직후 조회 소스가 DB로 바뀌며 목록이 비어 보인다)
    const localViews = getLocalStorage<RecentView[]>(RECENT_VIEWS_STORAGE_KEY, []);
    if (localViews.length > 0) {
      void syncRecentViewsAction(localViews.map(({ postId, viewedAt }) => ({ postId, viewedAt })))
        .then((result) => {
          if (result.success) {
            queryClient.invalidateQueries({ queryKey: queryKeys.recentViews.all });
          }
        })
        .catch(() => {
          // 이관 실패는 치명적이지 않음 — 로컬 기록은 남아 있어 다음 로그인 때 다시 시도된다
        });
    }
  }, [showToast, queryClient]);
}
