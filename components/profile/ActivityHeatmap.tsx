'use client';

import { useEffect, useState } from 'react';
import { format, startOfYear, endOfYear, eachDayOfInterval, getDay, getMonth } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BookmarkStats {
  stats: Record<string, number>;
  total: number;
}

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
    return <div className="w-[10px] h-[10px] bg-transparent" />;
  }

  const dateKey = format(day, 'yyyy-MM-dd');
  const count = stats.stats[dateKey] || 0;
  const colorClass = getColorForCount(count);

  return (
    <div className="relative group">
      <div
        className={`w-[10px] h-[10px] rounded-sm ${colorClass} transition-all group-hover:ring-2 group-hover:ring-emerald-500 dark:group-hover:ring-emerald-400 cursor-pointer`}
        onMouseEnter={() => onHover({ date: dateKey, count })}
        onMouseLeave={() => onHover(null)}
      />
      {hoveredDay?.date === dateKey && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap shadow-lg z-50 pointer-events-none">
          {count}개
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
            <div className="border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ActivityHeatmap() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [stats, setStats] = useState<BookmarkStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredDay, setHoveredDay] = useState<{ date: string; count: number } | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/bookmarks/stats?year=${selectedYear}`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchStats();
  }, [selectedYear]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">즐겨찾기 활동</h3>
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const weeks = generateWeeks(selectedYear);
  const monthLabels = generateMonthLabels(weeks);
  const canGoNext = selectedYear < currentYear;
  const canGoPrev = selectedYear > MIN_YEAR;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6 overflow-visible">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">즐겨찾기 활동</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedYear((prev) => prev - 1)}
              disabled={!canGoPrev}
              className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                !canGoPrev ? 'opacity-30 cursor-not-allowed' : ''
              }`}
              title="이전 년도"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[60px] text-center">
              {selectedYear}년
            </span>
            <button
              onClick={() => setSelectedYear((prev) => prev + 1)}
              disabled={!canGoNext}
              className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                !canGoNext ? 'opacity-30 cursor-not-allowed' : ''
              }`}
              title="다음 년도"
            >
              <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{stats.total}</span> 개의 즐겨찾기
        </p>
      </div>

      {/* 히트맵 */}
      <div className="relative">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full pb-2">
            {/* 월 레이블 */}
            <div className="flex mb-2">
              <div className="w-[29px]"></div>
              <div className="flex-1 relative h-4">
                {monthLabels.map((month, index) => (
                  <div
                    key={index}
                    className="absolute text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap"
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
              <div className="flex flex-col gap-[3px] text-xs text-gray-600 dark:text-gray-400 w-[26px] flex-shrink-0">
                {WEEK_DAYS.map((day, index) => (
                  <div key={index} className="h-[10px] flex items-center">
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
      <div className="flex justify-end items-center gap-2 mt-2 text-xs text-gray-600 dark:text-gray-400">
        <span>적음</span>
        {LEVELS.map((level, index) => (
          <div key={index} className={`w-3 h-3 rounded-sm ${level.color}`} title={level.label}></div>
        ))}
        <span>많음</span>
      </div>
    </div>
  );
}
