'use client';

import { useEffect } from 'react';
import { useToast } from '@/hooks';

const LOGIN_COOKIE = 'login_success';

/**
 * 로그인 성공 토스트 처리
 *
 * 콜백 라우트가 심어준 1회용 쿠키를 읽고 즉시 삭제한다.
 * URL 파라미터(?login=success) 방식은 라우터 캐시/히스토리에 남아
 * 재방문 시 토스트가 다시 뜨는 문제가 있어 쿠키로 대체했다.
 */
export function useLoginStatusHandler() {
  const { showToast } = useToast();

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
  }, [showToast]);
}
