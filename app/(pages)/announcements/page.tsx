import type { Metadata } from 'next';
import { AnnouncementsContainer } from '@/features/announcements';
import { fetchAnnouncements } from '@/features/announcements/services';
import { APP } from '@/utils/constants';
import { Suspense } from 'react';
import { SimpleSkeleton } from '@/components/skeleton';

export const metadata: Metadata = {
  title: '공지사항',
  description: '최신 기능 업데이트, 새로운 블로그 추가, 버그 수정 등 devBlog.kr의 공지사항과 소식을 확인하세요.',
  alternates: {
    canonical: `${APP.URL}/announcements`,
  },
  openGraph: {
    title: '공지사항 - devBlog.kr',
    description: '최신 기능 업데이트, 새로운 블로그 추가, 버그 수정 등 devBlog.kr의 소식을 확인하세요.',
    url: `${APP.URL}/announcements`,
    siteName: 'devBlog.kr',
    type: 'website',
    locale: 'ko_KR',
    images: [
      {
        url: `${APP.URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: '공지사항 - devBlog.kr',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '공지사항 - devBlog.kr',
    description: '최신 기능 업데이트, 새로운 블로그 추가, 버그 수정 등 devBlog.kr의 소식을 확인하세요.',
    images: [`${APP.URL}/og-image.png`],
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
      <header className="mb-4">
        <h1 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white md:text-4xl">새로운 소식</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          devBlog.kr의 최신 업데이트, 새로운 기능, 버그 수정 사항을 확인하세요.
        </p>
      </header>

      <section aria-label="공지사항 목록">
        <Suspense fallback={<SimpleSkeleton />}>
          <AnnouncementsContainer data={announcementsPromise} />
        </Suspense>
      </section>
    </div>
  );
}
