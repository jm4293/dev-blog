'use client';

import { useSyncExternalStore } from 'react';
import { formatPostDate, formatPostDateStatic } from '@/utils';

function subscribeNoop() {
  return () => {};
}

/**
 * 게시글 날짜 표시 문자열을 반환하는 훅
 *
 * 서버 렌더링(ISR 출력)에서는 "yyyy-MM-dd"만, 클라이언트 하이드레이션 후에는
 * "yyyy-MM-dd · n시간 전"을 반환한다.
 * 상대 시간을 서버 출력에 넣으면 재생성마다 HTML이 달라져 Vercel ISR Write가 매번 발생하므로
 * 시간 의존 문구는 브라우저에서만 계산한다.
 */
export function usePostDate(date: Date | string): string {
  return useSyncExternalStore(
    subscribeNoop,
    () => formatPostDate(date),
    () => formatPostDateStatic(date),
  );
}
