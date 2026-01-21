import { formatDistanceToNow, format } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 게시글 날짜를 포맷팅합니다.
 * @param date - 포맷팅할 날짜
 * @returns "yyyy-MM-dd · n시간 전" 형식의 문자열
 *
 * @example
 * formatPostDate(new Date('2024-01-15'))
 * // "2024-01-15 · 3일 전"
 */
export function formatPostDate(date: Date | string): string {
  const publishedDate = typeof date === 'string' ? new Date(date) : date;

  const formattedDate = format(publishedDate, 'yyyy-MM-dd');
  const relativeTime = formatDistanceToNow(publishedDate, {
    addSuffix: true,
    locale: ko,
  });

  return `${formattedDate} · ${relativeTime}`;
}
