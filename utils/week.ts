const WEEK_PATTERN = /^(\d{4})-W(\d{2})$/;

// 주차 계산은 서버 타임존(Vercel=UTC)과 무관하게 항상 한국 시간(KST, UTC+9) 기준
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MS_PER_WEEK = 7 * MS_PER_DAY;

export interface WeekRange {
  /** ISO 주차 문자열 (예: '2026-W27') */
  week: string;
  /** 주 시작 (KST 월요일 00:00에 해당하는 절대 시각) */
  start: Date;
  /** 주 끝 (KST 일요일 23:59:59.999에 해당하는 절대 시각) */
  end: Date;
}

/** 절대 시각 → KST 벽시계를 UTC 필드에 담은 Date (getUTC* 계열로 읽어야 함) */
function toKSTClock(date: Date): Date {
  return new Date(date.getTime() + KST_OFFSET_MS);
}

/** KST 기준 ISO 연도/주차 (ISO 8601: 목요일이 속한 연도가 주차 연도) */
function getKSTISOWeek(date: Date): { year: number; week: number } {
  const clock = toKSTClock(date);
  const day = new Date(Date.UTC(clock.getUTCFullYear(), clock.getUTCMonth(), clock.getUTCDate()));
  day.setUTCDate(day.getUTCDate() + 3 - ((day.getUTCDay() + 6) % 7));

  const year = day.getUTCFullYear();
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const week1Monday = jan4.getTime() - ((jan4.getUTCDay() + 6) % 7) * MS_PER_DAY;
  const week = Math.floor((day.getTime() - week1Monday) / MS_PER_WEEK) + 1;

  return { year, week };
}

/** ISO 연도/주차 → 해당 주 월요일 00:00 KST의 절대 시각(ms) */
function kstWeekStartMs(year: number, week: number): number {
  const jan4 = Date.UTC(year, 0, 4);
  const week1Monday = jan4 - ((new Date(jan4).getUTCDay() + 6) % 7) * MS_PER_DAY;
  return week1Monday + (week - 1) * MS_PER_WEEK - KST_OFFSET_MS;
}

/** Date → '2026-W27' 형식의 ISO 주차 문자열 (KST 기준) */
export function toISOWeekString(date: Date): string {
  const { year, week } = getKSTISOWeek(date);
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

  const startMs = kstWeekStartMs(year, week);

  // 존재하지 않는 주차 방어 (예: 53주가 없는 해의 W53)
  const check = getKSTISOWeek(new Date(startMs));
  if (check.year !== year || check.week !== week) {
    return null;
  }

  return { week: weekString, start: new Date(startMs), end: new Date(startMs + MS_PER_WEEK - 1) };
}

/** 기준일로부터 과거 N개 주차 목록 (최신순, 기준일이 속한 주 포함) */
export function getRecentWeeks(count: number, from: Date = new Date()): WeekRange[] {
  const weeks: WeekRange[] = [];

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

/** WeekRange → '6월 29일 ~ 7월 5일' 표시용 기간 라벨 (KST 기준) */
export function formatWeekRange(range: WeekRange): string {
  const start = toKSTClock(range.start);
  const end = toKSTClock(range.end);
  return `${start.getUTCMonth() + 1}월 ${start.getUTCDate()}일 ~ ${end.getUTCMonth() + 1}월 ${end.getUTCDate()}일`;
}
