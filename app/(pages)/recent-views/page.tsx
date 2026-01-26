import { RecentViewsList } from '@/features/recent-views/ui';
import { getCurrentUser } from '@/supabase';
import { APP } from '@/utils/constants';

export const metadata = {
  title: '최근 본 글 | devBlog.kr',
  description: '최근에 조회한 게시글 목록을 확인하세요. 관심 있는 기술 블로그 포스트를 다시 찾아보세요.',
  alternates: {
    canonical: `${APP.URL}/recent-views`,
  },
  openGraph: {
    title: '최근 본 글 | devBlog.kr',
    description: '최근에 조회한 게시글 목록을 확인하세요.',
    url: `${APP.URL}/recent-views`,
    siteName: 'devBlog.kr',
    type: 'website',
    locale: 'ko_KR',
    images: [
      {
        url: `${APP.URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: '최근 본 글 | devBlog.kr',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '최근 본 글 | devBlog.kr',
    description: '최근에 조회한 게시글 목록을 확인하세요.',
    images: [`${APP.URL}/og-image.png`],
  },
};

export default async function RecentViewsPage() {
  const user = await getCurrentUser();

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">최근 본 글</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">최근에 조회한 게시글 목록입니다.</p>
      </section>

      <RecentViewsList isLoggedIn={!!user} />
    </div>
  );
}
