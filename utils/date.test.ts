import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatRelativeTime, formatAbsoluteTime, parseDate } from './date';

describe('date 유틸', () => {
  beforeEach(() => {
    // 테스트 시간 고정 (2026-01-20)
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-20T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ✅ 테스트 1: 상대 시간 포맷팅 (최근)
  it('should format recent date as relative time', () => {
    const date = new Date('2026-01-20T00:00:00Z');
    const result = formatRelativeTime(date);

    // "약 0초 전" 또는 "방금 전" 형태
    expect(result).toContain('전');
  });

  // ✅ 테스트 2: 상대 시간 포맷팅 (1시간 전)
  it('should format time 1 hour ago', () => {
    const date = new Date('2026-01-19T23:00:00Z');
    const result = formatRelativeTime(date);

    expect(result).toContain('시간');
    expect(result).toContain('전');
  });

  // ✅ 테스트 3: 절대 시간 포맷팅 (기본 형식)
  it('should format absolute time with default format', () => {
    const date = new Date('2026-01-15T10:30:00Z');
    const result = formatAbsoluteTime(date);

    // "2026년 1월 15일" 형태
    expect(result).toContain('2026');
    expect(result).toContain('1월');
    expect(result).toContain('15');
  });

  // ✅ 테스트 4: 절대 시간 포맷팅 (커스텀 형식)
  it('should format absolute time with custom format', () => {
    const date = new Date('2026-01-15T10:30:00Z');
    const result = formatAbsoluteTime(date, 'yyyy-MM-dd');

    expect(result).toBe('2026-01-15');
  });

  // ✅ 테스트 5: 날짜 문자열 파싱
  it('should parse ISO date string to Date object', () => {
    const dateString = '2026-01-15T10:30:00Z';
    const result = parseDate(dateString);

    expect(result).toBeInstanceOf(Date);
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(0); // 0 = January
    expect(result.getDate()).toBe(15);
  });

  // ✅ 테스트 6: 문자열과 Date 객체 모두 처리
  it('should accept both string and Date object', () => {
    const dateString = '2026-01-15T10:30:00Z';
    const dateObject = new Date('2026-01-15T10:30:00Z');

    const resultFromString = formatAbsoluteTime(dateString);
    const resultFromDate = formatAbsoluteTime(dateObject);

    expect(resultFromString).toBe(resultFromDate);
  });

  // ✅ 테스트 7: 여러 날짜 포맷팅
  it('should format multiple dates correctly', () => {
    const dates = ['2026-01-01T00:00:00Z', '2026-02-14T00:00:00Z', '2026-12-25T00:00:00Z'];

    dates.forEach((date) => {
      const result = formatAbsoluteTime(date);
      expect(result).toContain('2026년');
    });
  });

  // ✅ 테스트 8: 다양한 커스텀 포맷 지원
  it('should support various custom formats', () => {
    const date = new Date('2026-01-15T10:30:45Z');

    const format1 = formatAbsoluteTime(date, 'yyyy-MM-dd');
    const format2 = formatAbsoluteTime(date, 'MM/dd/yyyy');
    const format3 = formatAbsoluteTime(date, 'd MMMM yyyy');

    expect(format1).toBe('2026-01-15');
    expect(format2).toContain('01');
    expect(format3).toContain('15');
  });
});
