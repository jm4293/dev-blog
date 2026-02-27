import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { APP } from '@/utils';
import { getUser } from '@/features/auth';
import { ProfileContainer } from '@/features/profile';

export const metadata: Metadata = {
  title: '프로필',
  description: 'GitHub 계정으로 연동된 프로필 정보와 계정 설정을 관리하세요.',
  alternates: {
    canonical: `${APP.URL}/profile`,
  },
  openGraph: {
    title: '프로필 - devBlog.kr',
    description: 'GitHub 계정으로 연동된 프로필 정보와 계정 설정을 관리하세요.',
    url: `${APP.URL}/profile`,
    siteName: 'devBlog.kr',
    type: 'website',
    locale: 'ko_KR',
    images: [
      {
        url: `${APP.URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: '프로필 - devBlog.kr',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '프로필 - devBlog.kr',
    description: 'GitHub 계정으로 연동된 프로필 정보와 계정 설정을 관리하세요.',
    images: [`${APP.URL}/og-image.png`],
  },
  robots: {
    index: false,
    follow: false,
  },
};

interface ProfilePageProps {
  searchParams: Promise<{ year?: string }>;
}

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const user = await getUser();

  // 비로그인 시 로그인 페이지로 리다이렉트
  if (!user) {
    redirect('/auth/login?redirect=/profile');
  }

  const params = await searchParams;
  const year = params.year ? parseInt(params.year, 10) : undefined;

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-4">
        <h1 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white md:text-4xl">프로필</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">내 정보를 확인하고 관리하세요.</p>
      </header>

      <ProfileContainer user={user} year={year} />
    </div>
  );
}
