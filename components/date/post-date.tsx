'use client';

import { usePostDate } from '@/hooks';

interface PostDateProps {
  date: Date | string;
  className?: string;
}

/**
 * 게시글 날짜 표시 — 서버 출력은 날짜만, 클라이언트에서 상대 시간("n시간 전")을 덧붙인다.
 * 서버 컴포넌트(ISR 페이지)에서 날짜를 표시할 때 사용한다.
 */
export function PostDate({ date, className }: PostDateProps) {
  const display = usePostDate(date);

  return <span className={className}>{display}</span>;
}
