import { Metadata } from 'next';
import { getCurrentUser } from '@/supabase/getCurrentUser';
import { ProfileClient } from '@/features/profile/ui/ProfileClient';
import { ActivityHeatmap } from '@/components/profile/ActivityHeatmap';
import Link from 'next/link';
import { User, ArrowRight, UserIcon, Mail, Github, Calendar } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export const metadata: Metadata = {
  title: '프로필 | devBlog.kr',
  description: 'GitHub 계정으로 연동된 프로필 정보와 계정 설정을 관리하세요.',
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
          {user ? '내 정보를 확인하고 관리하세요.' : 'GitHub 계정으로 로그인하고 나만의 개발 공간을 만들어보세요.'}
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {!user ? (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 mb-6">
              <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center border-4 border-gray-100 dark:border-gray-700">
                    <UserIcon className="w-12 h-12 text-white" />
                  </div>
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">로그인이 필요합니다</h2>
                  <p className="text-gray-600 dark:text-gray-400">프로필 정보를 확인하려면 로그인하세요</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                  <Mail className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">이메일</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">로그인 후 확인 가능</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                  <Github className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">GitHub</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">로그인 후 확인 가능</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                  <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">가입일</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">로그인 후 확인 가능</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                >
                  로그인하러 가기
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <ActivityHeatmap />
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
                <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">이메일</p>
                    <p className="text-sm text-gray-900 dark:text-white truncate">{user.email}</p>
                  </div>
                </div>

                {user.user_metadata?.user_name && (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <Github className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">GitHub</p>
                      <p className="text-sm text-gray-900 dark:text-white truncate">@{user.user_metadata.user_name}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">가입일</p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {format(new Date(user.created_at), 'yyyy년 M월 d일', { locale: ko })}
                    </p>
                  </div>
                </div>
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
