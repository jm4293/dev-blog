import { AnnouncementsContainer } from '@/features/announcements';

export const metadata = {
  title: '새로운 소식 | devBlog.kr',
  description: '최신 기능 업데이트, 새로운 기업 추가, 버그 수정 등 devBlog.kr의 소식을 확인하세요.',
};

export default function AnnouncementsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">새로운 소식</h1>
        <p className="text-gray-600 dark:text-gray-400">
          devBlog.kr의 최신 업데이트, 새로운 기능, 버그 수정 사항을 확인하세요.
        </p>
      </div>

      <AnnouncementsContainer />
    </div>
  );
}
