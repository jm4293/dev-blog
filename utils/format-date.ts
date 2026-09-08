import { format, formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 날짜를 한국어 전체 형식으로 포맷팅합니다.
 * @example formatDateKo(new Date('2024-01-15')) // "2024년 1월 15일"
 */
export function formatDateKo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }).format(d);
}

/**
 * 게시글 날짜의 고정 부분만 포맷팅합니다 (서버 렌더링/ISR 출력용).
 * 상대 시간("n시간 전")은 렌더 시각에 따라 달라져 ISR 페이지 출력이 매번 바뀌고,
 * Vercel이 "내용 변경"으로 판단해 ISR Write가 발생하므로 서버 출력에는 포함하지 않는다.
 * @example formatPostDateStatic('2024-01-15') // "2024-01-15"
 */
export function formatPostDateStatic(date: Date | string): string {
  const publishedDate = typeof date === 'string' ? new Date(date) : date;
  return format(publishedDate, 'yyyy-MM-dd');
}

/**
 * 게시글 날짜를 포맷팅합니다. 상대 시간이 포함되므로 클라이언트에서만 호출한다 (usePostDate 참고).
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
  // RSS pubDate가 미래 시각이거나 기기 시계가 느린 경우 "n분 후"로 표시되는 것을 방지
  const relativeTime =
    publishedDate > new Date()
      ? '방금 전'
      : formatDistanceToNow(publishedDate, {
          addSuffix: true,
          locale: ko,
        });

  return `${formattedDate} · ${relativeTime}`;
}
