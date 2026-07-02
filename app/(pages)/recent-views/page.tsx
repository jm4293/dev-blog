import type { Metadata } from 'next';
import { buildPageMetadata } from '@/utils';
import { RecentViewsList } from '@/features/recent-views/ui';

export const metadata: Metadata = buildPageMetadata({
  title: '최근 본 글',
  description:
    '최근에 조회한 개발블로그·기술블로그 게시글을 다시 빠르게 찾아보세요. 로컬에 자동 저장되어 로그인 없이도 사용할 수 있습니다.',
  path: '/recent-views',
});

export default function RecentViewsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-foreground md:text-4xl">최근 본 글</h1>
      </header>

      <section aria-label="최근 본 게시글 목록">
        <RecentViewsList />
      </section>
    </div>
  );
}
