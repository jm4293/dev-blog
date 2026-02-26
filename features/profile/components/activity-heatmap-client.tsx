'use client';

import { useState } from 'react';
import { format, startOfYear, endOfYear, eachDayOfInterval, getDay, getMonth } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/utils';
import type { BookmarkStats } from '../services';

interface MonthLabel {
  label: string;
  weekIndex: number;
}

const LEVELS = [
  { count: 0, color: 'bg-gray-200 dark:bg-gray-700', label: '0' },
  { count: 1, color: 'bg-emerald-200 dark:bg-emerald-900', label: '1-2' },
  { count: 3, color: 'bg-emerald-400 dark:bg-emerald-800', label: '3-5' },
  { count: 6, color: 'bg-emerald-600 dark:bg-emerald-600', label: '6-10' },
  { count: 11, color: 'bg-emerald-800 dark:bg-emerald-500', label: '10+' },
];

const MIN_YEAR = 2025;
const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];
const DISPLAYED_DAYS = [1, 3, 5]; // 월, 수, 금

function getColorForCount(count: number): string {
  if (count === 0) return LEVELS[0].color;
  if (count <= 2) return LEVELS[1].color;
  if (count <= 5) return LEVELS[2].color;
  if (count <= 10) return LEVELS[3].color;
  return LEVELS[4].color;
}

function generateWeeks(year: number): (Date | null)[][] {
  const startDate = startOfYear(new Date(year, 0, 1));
  const endDate = endOfYear(new Date(year, 0, 1));
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  const weeks: (Date | null)[][] = [];
  let currentWeek: (Date | null)[] = [];

  // 첫 주의 빈 칸 채우기
  const firstDayOfWeek = getDay(allDays[0]);
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push(null);
  }

  allDays.forEach((day) => {
    currentWeek.push(day);
    if (getDay(day) === 6) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  // 마지막 주 처리
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  return weeks;
}

function generateMonthLabels(weeks: (Date | null)[][]): MonthLabel[] {
  const monthLabels: MonthLabel[] = [];
  let lastMonth = -1;

  weeks.forEach((week, weekIndex) => {
    const firstDayInWeek = week.find((day) => day !== null);
    if (firstDayInWeek) {
      const month = getMonth(firstDayInWeek);
      if (month !== lastMonth) {
        monthLabels.push({
          label: `${month + 1}월`,
          weekIndex,
        });
        lastMonth = month;
      }
    }
  });

  return monthLabels;
}

function HeatmapCell({
  day,
  stats,
  hoveredDay,
  onHover,
}: {
  day: Date | null;
  stats: BookmarkStats;
  hoveredDay: { date: string; count: number } | null;
  onHover: (data: { date: string; count: number } | null) => void;
}) {
  if (!day) {
    return <div className="h-[10px] w-[10px] bg-transparent" />;
  }

  const dateKey = format(day, 'yyyy-MM-dd');
  const count = stats.stats[dateKey] || 0;
  const colorClass = getColorForCount(count);

  return (
    <div className="group relative">
      <div
        className={cn(
          'h-[10px] w-[10px] cursor-pointer transition-all group-hover:ring-2 group-hover:ring-emerald-500 dark:group-hover:ring-emerald-400',
          colorClass,
        )}
        onMouseEnter={() => onHover({ date: dateKey, count })}
        onMouseLeave={() => onHover(null)}
      />
      {hoveredDay?.date === dateKey && (
        <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white shadow-lg dark:bg-gray-700">
          {count}개
          <div className="absolute left-1/2 top-full -mt-px -translate-x-1/2">
            <div className="border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ActivityHeatmapClientProps {
  stats: BookmarkStats;
  selectedYear: number;
}

export function ActivityHeatmapClient({ stats, selectedYear }: ActivityHeatmapClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentYear = new Date().getFullYear();
  const [hoveredDay, setHoveredDay] = useState<{ date: string; count: number } | null>(null);

  const weeks = generateWeeks(selectedYear);
  const monthLabels = generateMonthLabels(weeks);
  const canGoNext = selectedYear < currentYear;
  const canGoPrev = selectedYear > MIN_YEAR;

  const handleYearChange = (newYear: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newYear === currentYear) {
      params.delete('year');
    } else {
      params.set('year', String(newYear));
    }
    const newUrl = params.toString() ? `/profile?${params.toString()}` : '/profile';
    router.push(newUrl);
  };

  return (
    <>
      {/* 헤더 */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">즐겨찾기 활동</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            총 <span className="font-medium text-emerald-600 dark:text-emerald-400">{stats.total}</span>개
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleYearChange(selectedYear - 1)}
            disabled={!canGoPrev}
            className={cn(
              'rounded-md p-1.5 transition-colors',
              !canGoPrev
                ? 'cursor-not-allowed opacity-30'
                : 'text-gray-700 hover:bg-white dark:text-gray-300 dark:hover:bg-gray-600',
            )}
            title="이전 년도"
            aria-label="이전 년도"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[60px] px-2 text-center text-sm font-semibold text-gray-900 dark:text-gray-100">
            {selectedYear}년
          </span>
          <button
            onClick={() => handleYearChange(selectedYear + 1)}
            disabled={!canGoNext}
            className={cn(
              'rounded-md p-1.5 transition-colors',
              !canGoNext
                ? 'cursor-not-allowed opacity-30'
                : 'text-gray-700 hover:bg-white dark:text-gray-300 dark:hover:bg-gray-600',
            )}
            title="다음 년도"
            aria-label="다음 년도"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 히트맵 */}
      <div className="relative">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full pb-2">
            {/* 월 레이블 */}
            <div className="mb-2 flex">
              <div className="w-[29px]"></div>
              <div className="relative h-4 flex-1">
                {monthLabels.map((month, index) => (
                  <div
                    key={index}
                    className="absolute whitespace-nowrap text-xs text-gray-600 dark:text-gray-400"
                    style={{ left: `${month.weekIndex * 13}px` }}
                  >
                    {month.label}
                  </div>
                ))}
              </div>
            </div>

            {/* 히트맵 그리드 */}
            <div className="flex gap-[3px]">
              {/* 요일 레이블 */}
              <div className="flex w-[26px] flex-shrink-0 flex-col gap-[3px] text-xs text-gray-600 dark:text-gray-400">
                {WEEK_DAYS.map((day, index) => (
                  <div key={index} className="flex h-[10px] items-center">
                    {DISPLAYED_DAYS.includes(index) ? day : ''}
                  </div>
                ))}
              </div>

              {/* 주차별 그리드 */}
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {week.map((day, dayIndex) => (
                    <HeatmapCell
                      key={dayIndex}
                      day={day}
                      stats={stats}
                      hoveredDay={hoveredDay}
                      onHover={setHoveredDay}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 범례 */}
      <div className="mt-2 flex items-center justify-end gap-2 text-xs text-gray-600 dark:text-gray-400">
        <span>적음</span>
        {LEVELS.map((level, index) => (
          <div key={index} className={cn('h-3 w-3 rounded-sm', level.color)} title={level.label}></div>
        ))}
        <span>많음</span>
      </div>
    </>
  );
}
