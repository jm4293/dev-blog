import { Metadata } from 'next';
import { getUser } from '@/features/auth';
import { ProfileContent } from '@/features/profile';
import { APP } from '@/utils/constants';
import { LoginRequired } from '@/components/auth';

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
  const params = await searchParams;
  const year = params.year ? parseInt(params.year, 10) : undefined;
  const user = await getUser();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <header className="mb-4">
          <h1 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white md:text-4xl">프로필</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">내 정보를 확인하고 관리하세요.</p>
        </header>
        <LoginRequired description="GitHub 계정으로 로그인하고 프로필 정보를 확인하세요" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-4">
        <h1 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white md:text-4xl">프로필</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">내 정보를 확인하고 관리하세요.</p>
      </header>

      <ProfileContent user={user} year={year} />
    </div>
  );
}
