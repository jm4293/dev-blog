import { Metadata } from 'next';
import { getCurrentUser } from '@/supabase/getCurrentUser';
import { ActivityHeatmap, ProfileClient, ProfileInfoCard } from '@/features/profile';
import { User as UserIcon, Mail, Github, Calendar } from 'lucide-react';
import Image from 'next/image';
import { APP } from '@/utils/constants';

export const metadata: Metadata = {
  title: '프로필 | devBlog.kr',
  description: 'GitHub 계정으로 연동된 프로필 정보와 계정 설정을 관리하세요.',
  alternates: {
    canonical: `${APP.URL}/profile`,
  },
  openGraph: {
    title: '프로필 | devBlog.kr',
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
        alt: '프로필 | devBlog.kr',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '프로필 | devBlog.kr',
    description: 'GitHub 계정으로 연동된 프로필 정보와 계정 설정을 관리하세요.',
    images: [`${APP.URL}/og-image.png`],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ProfilePage() {
  const user = await getCurrentUser();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">프로필</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {user ? '내 정보를 확인하고 관리하세요.' : '로그인하고 프로필 정보를 확인하세요.'}
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {!user ? (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 mb-6">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">로그인이 필요합니다</h2>
                <p className="text-gray-600 dark:text-gray-400">프로필 정보를 확인하려면 로그인하세요</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProfileInfoCard icon={Mail} label="이메일" value="로그인 후 확인 가능" />
                <ProfileInfoCard icon={Github} label="GitHub" value="로그인 후 확인 가능" />
                <ProfileInfoCard icon={Calendar} label="가입일" value="로그인 후 확인 가능" />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 mb-6">
              <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                  {user.user_metadata?.avatar_url ? (
                    <Image
                      src={user.user_metadata.avatar_url}
                      alt={user.user_metadata?.name || user.user_metadata?.user_name || '사용자'}
                      width={96}
                      height={96}
                      className="rounded-full border-4 border-blue-100 dark:border-blue-900"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center border-4 border-blue-100 dark:border-blue-900">
                      <UserIcon className="w-12 h-12 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {user.user_metadata?.name || user.user_metadata?.user_name || '사용자'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">devBlog.kr 회원</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProfileInfoCard icon={Mail} label="이메일" value={user.email || ''} isActive />
                {user.user_metadata?.user_name && (
                  <ProfileInfoCard icon={Github} label="GitHub" value={`@${user.user_metadata.user_name}`} isActive />
                )}
                <ProfileInfoCard
                  icon={Calendar}
                  label="가입일"
                  value={new Intl.DateTimeFormat('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }).format(new Date(user.created_at))}
                  isActive
                />
              </div>
            </div>

            <ActivityHeatmap />

            <ProfileClient user={user} />
          </>
        )}
      </div>
    </div>
  );
}
