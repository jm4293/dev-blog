import { endOfISOWeek, getISOWeek, getISOWeekYear, setISOWeek, setISOWeekYear, startOfISOWeek } from 'date-fns';

const WEEK_PATTERN = /^(\d{4})-W(\d{2})$/;

export interface WeekRange {
  /** ISO 주차 문자열 (예: '2026-W27') */
  week: string;
  /** 주 시작 (월요일 00:00) */
  start: Date;
  /** 주 끝 (일요일 23:59:59.999) */
  end: Date;
}

/** Date → '2026-W27' 형식의 ISO 주차 문자열 */
export function toISOWeekString(date: Date): string {
  const year = getISOWeekYear(date);
  const week = getISOWeek(date);
  return `${year}-W${String(week).padStart(2, '0')}`;
}

/** '2026-W27' → 주 시작/끝 날짜. 형식이 잘못되면 null */
export function parseISOWeekString(weekString: string): WeekRange | null {
  const match = WEEK_PATTERN.exec(weekString);
  if (!match) {
    return null;
  }

  const year = parseInt(match[1], 10);
  const week = parseInt(match[2], 10);
  if (week < 1 || week > 53) {
    return null;
  }

  const base = setISOWeek(setISOWeekYear(new Date(), year), week);
  const start = startOfISOWeek(base);

  // 존재하지 않는 주차 방어 (예: 53주가 없는 해의 W53)
  if (getISOWeek(start) !== week || getISOWeekYear(start) !== year) {
    return null;
  }

  return { week: weekString, start, end: endOfISOWeek(base) };
}

/** 기준일로부터 과거 N개 주차 목록 (최신순, 기준일이 속한 주 포함) */
export function getRecentWeeks(count: number, from: Date = new Date()): WeekRange[] {
  const weeks: WeekRange[] = [];
  const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

  for (let i = 0; i < count; i++) {
    const date = new Date(from.getTime() - i * MS_PER_WEEK);
    const range = parseISOWeekString(toISOWeekString(date));
    if (range) {
      weeks.push(range);
    }
  }

  return weeks;
}

/** 아직 시작되지 않은(미래) 주차인지 여부 */
export function isFutureWeek(range: WeekRange): boolean {
  return range.start.getTime() > Date.now();
}

/**
 * 주차 페이지의 발행/수정일 (Article 구조화 데이터용)
 * 발행일 = 주 시작, 수정일 = 주 종료 (진행 중인 주는 현재 시각으로 클램프)
 */
export function getWeekArticleDates(range: WeekRange): { published: string; modified: string } {
  const modified = Math.min(range.end.getTime(), Date.now());
  return {
    published: range.start.toISOString(),
    modified: new Date(modified).toISOString(),
  };
}

/** '2026-W27' → '2026년 27주차' 표시용 라벨 */
export function formatWeekLabel(weekString: string): string {
  const match = WEEK_PATTERN.exec(weekString);
  if (!match) {
    return weekString;
  }
  return `${match[1]}년 ${parseInt(match[2], 10)}주차`;
}
