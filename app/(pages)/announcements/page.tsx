import { Suspense } from 'react';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/utils';
import { AnnouncementsContainer, fetchAnnouncements } from '@/features/announcements';
import { SimpleSkeleton } from '@/components/skeleton';

export const metadata: Metadata = buildPageMetadata({
  title: '공지사항',
  description:
    '기술블로그를 한 곳에 모아보는 devBlog.kr의 최신 기능 업데이트, 새로 추가된 블로그, 버그 수정 등 모든 소식을 확인하세요.',
  path: '/announcements',
});

interface AnnouncementsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AnnouncementsPage({ searchParams }: AnnouncementsPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || '1', 10));

  const announcementsPromise = fetchAnnouncements({ page });

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-foreground md:text-4xl">새로운 소식</h1>
        <p className="mt-2 text-muted-foreground">devBlog.kr의 기능 업데이트와 새 소식을 전해드립니다.</p>
      </header>

      {/* data-nosnippet: 검색 스니펫에 공지 목록이 발췌되지 않도록 제외 → meta description이 노출됨 */}
      <section aria-label="공지사항 목록" data-nosnippet="">
        <Suspense fallback={<SimpleSkeleton />}>
          <AnnouncementsContainer data={announcementsPromise} />
        </Suspense>
      </section>
    </div>
  );
}
