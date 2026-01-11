import { formatDistanceToNow, format } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 상대 시간 포맷팅 (예: "2시간 전")
 */
export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: ko,
  });
}

/**
 * 절대 시간 포맷팅 (예: "2026년 1월 9일")
 */
export function formatAbsoluteTime(date: string | Date, dateFormat = 'yyyy년 M월 d일'): string {
  return format(new Date(date), dateFormat, { locale: ko });
}

/**
 * ISO 문자열을 Date 객체로 변환
 */
export function parseDate(dateString: string): Date {
  return new Date(dateString);
}
