import { Suspense } from 'react';
import type { Metadata } from 'next';
import { APP } from '@/utils';
import { AnnouncementsContainer, fetchAnnouncements } from '@/features/announcements';
import { SimpleSkeleton } from '@/components/skeleton';

const DESCRIPTION =
  '개발블로그·기술블로그 큐레이션 플랫폼 devBlog.kr의 최신 기능 업데이트, 새로 추가된 블로그, 버그 수정 등 모든 소식을 한 곳에서 확인하세요.';

export const metadata: Metadata = {
  title: '공지사항',
  description: DESCRIPTION,
  alternates: {
    canonical: `${APP.URL}/announcements`,
  },
  openGraph: {
    title: '공지사항 - devBlog.kr',
    description: DESCRIPTION,
    url: `${APP.URL}/announcements`,
    siteName: 'devBlog.kr',
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: '공지사항 - devBlog.kr',
    description: DESCRIPTION,
  },
};

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
      </header>

      <section aria-label="공지사항 목록">
        <Suspense fallback={<SimpleSkeleton />}>
          <AnnouncementsContainer data={announcementsPromise} />
        </Suspense>
      </section>
    </div>
  );
}
