import type { Metadata } from 'next';
import { AnnouncementsContainer } from '@/features/announcements';
import { APP } from '@/utils/constants';

export const metadata: Metadata = {
  title: '공지사항 | devBlog.kr 업데이트 소식',
  description: '최신 기능 업데이트, 새로운 기업 추가, 버그 수정 등 devBlog.kr의 공지사항과 소식을 확인하세요.',
  alternates: {
    canonical: `${APP.URL}/announcements`,
  },
  openGraph: {
    title: '공지사항 | devBlog.kr 업데이트 소식',
    description: '최신 기능 업데이트, 새로운 기업 추가, 버그 수정 등 devBlog.kr의 소식을 확인하세요.',
    url: `${APP.URL}/announcements`,
    siteName: 'devBlog.kr',
    type: 'website',
    locale: 'ko_KR',
    images: [
      {
        url: `${APP.URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: '공지사항 | devBlog.kr',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '공지사항 | devBlog.kr 업데이트 소식',
    description: '최신 기능 업데이트, 새로운 기업 추가, 버그 수정 등 devBlog.kr의 소식을 확인하세요.',
    images: [`${APP.URL}/og-image.png`],
  },
};

export default function AnnouncementsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">새로운 소식</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          devBlog.kr의 최신 업데이트, 새로운 기능, 버그 수정 사항을 확인하세요.
        </p>
      </section>

      <AnnouncementsContainer />
    </div>
  );
}
