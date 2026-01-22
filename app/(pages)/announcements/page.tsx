import type { Metadata } from 'next';
import { AnnouncementsContainer } from '@/features/announcements';

export const metadata: Metadata = {
  title: '공지사항 | devBlog.kr 업데이트 소식',
  description: '최신 기능 업데이트, 새로운 기업 추가, 버그 수정 등 devBlog.kr의 공지사항과 소식을 확인하세요.',
  keywords: ['공지사항', 'devBlog', '업데이트', '새로운 기능', '개발 블로그'],
  openGraph: {
    title: '공지사항 | devBlog.kr 업데이트 소식',
    description: '최신 기능 업데이트, 새로운 기업 추가, 버그 수정 등 devBlog.kr의 소식을 확인하세요.',
    type: 'website',
  },
};

export default function AnnouncementsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">새로운 소식</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          devBlog.kr의 최신 업데이트, 새로운 기능, 버그 수정 사항을 확인하세요.
        </p>
      </div>

      <AnnouncementsContainer />
    </div>
  );
}
