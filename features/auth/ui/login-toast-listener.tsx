'use client';

import { useLoginStatusHandler } from '../hooks/use-login-status-handler';

/**
 * 로그인 성공 토스트 리스너 (전역)
 *
 * 콜백 라우트가 어느 경로로 복귀시키든(/posts, /bookmarks, /profile 등)
 * 환영 토스트가 뜨도록 (pages) 레이아웃에서 렌더한다.
 */
export function LoginToastListener() {
  useLoginStatusHandler();

  return null;
}
