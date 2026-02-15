import Image from 'next/image';
import { User as UserIcon, Mail, Github, Calendar } from 'lucide-react';
import type { User } from '@supabase/auth-js';
import { ProfileInfoCard } from './ProfileInfoCard';
import { ActivityHeatmap } from '../components/ActivityHeatmap';
import { ProfileClient } from './ProfileClient';
import { NotificationSettings } from '@/features/notifications';
import { formatDateKo } from '@/utils';

interface ProfileContentProps {
  user: User;
  year?: number;
}

export function ProfileContent({ user, year }: ProfileContentProps) {
  const displayName = user.user_metadata?.name || user.user_metadata?.user_name || '사용자';
  const joinDate = formatDateKo(user.created_at);

  return (
    <section aria-label="사용자 프로필" className="mx-auto max-w-3xl">
      <article className="mb-6 rounded-xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-8 flex items-center gap-6">
          <div className="relative">
            {user.user_metadata?.avatar_url ? (
              <Image
                src={user.user_metadata.avatar_url}
                alt={displayName}
                width={96}
                height={96}
                className="rounded-full border-4 border-blue-100 dark:border-blue-900"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-blue-100 bg-gradient-to-br from-blue-500 to-blue-600 dark:border-blue-900">
                <UserIcon className="h-12 w-12 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <h2 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">{displayName}</h2>
            <p className="text-gray-600 dark:text-gray-400">devBlog.kr 회원</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ProfileInfoCard icon={Mail} label="이메일" value={user.email || ''} isActive />
          {user.user_metadata?.user_name && (
            <ProfileInfoCard icon={Github} label="GitHub" value={`@${user.user_metadata.user_name}`} isActive />
          )}
          <ProfileInfoCard icon={Calendar} label="가입일" value={joinDate} isActive />
        </div>
      </article>

      <div className="mb-6 overflow-visible rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <ActivityHeatmap year={year} />
      </div>

      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">알림 설정</h3>
        <NotificationSettings />
      </div>

      <ProfileClient user={user} />
    </section>
  );
}
