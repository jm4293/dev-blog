import type { Metadata } from 'next';
import Link from 'next/link';
import { APP, buildPageMetadata, formatWeekLabel, getRecentWeeks, toISOWeekString } from '@/utils';
import { CalendarDays } from 'lucide-react';

export const revalidate = 3600; // 1시간

export const metadata: Metadata = buildPageMetadata({
  title: '주간 인기글',
  description: '한 주 동안 기업 기술블로그에서 가장 인기 있었던 글을 주차별로 모았습니다.',
  path: '/digest',
});

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: APP.URL },
    { '@type': 'ListItem', position: 2, name: '주간 인기글', item: `${APP.URL}/digest` },
  ],
};

export default function DigestIndexPage() {
  const weeks = getRecentWeeks(12);
  const currentWeek = toISOWeekString(new Date());

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground md:text-4xl">주간 인기글</h1>
        <p className="mt-2 text-muted-foreground">한 주 동안 가장 인기 있었던 기술 블로그 글을 모아봤어요.</p>
      </header>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {weeks.map((week) => {
          const isCurrent = week.week === currentWeek;
          return (
            <li key={week.week}>
              <Link
                href={`/digest/${week.week}`}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <CalendarDays className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
                <div>
                  <p className="font-semibold text-foreground">
                    {formatWeekLabel(week.week)}
                    {isCurrent && <span className="ml-2 text-xs font-normal text-muted-foreground">(진행 중)</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {week.start.getMonth() + 1}월 {week.start.getDate()}일 ~ {week.end.getMonth() + 1}월{' '}
                    {week.end.getDate()}일
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
