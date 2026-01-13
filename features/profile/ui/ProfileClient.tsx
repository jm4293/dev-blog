'use client';

import { useLogout } from '@/features/auth/hooks/useLogout';
import type { User } from '@supabase/auth-js';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface ProfileClientProps {
  user: User;
}

export const ProfileClient = ({ user }: ProfileClientProps) => {
  const { mutate: logout, isPending } = useLogout();

  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      logout();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 mb-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">이메일</label>
            <p className="text-gray-900 dark:text-white">{user.email}</p>
          </div>

          {user.user_metadata?.name && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">이름</label>
              <p className="text-gray-900 dark:text-white">{user.user_metadata.name}</p>
            </div>
          )}

          {user.user_metadata?.user_name && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GitHub 사용자명</label>
              <p className="text-gray-900 dark:text-white">@{user.user_metadata.user_name}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">가입 날짜</label>
            <p className="text-gray-900 dark:text-white">
              {format(new Date(user.created_at), 'yyyy년 M월 d일', { locale: ko })}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleLogout}
          disabled={isPending}
          className="flex-1 px-6 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium">
          {isPending ? '로그아웃 중...' : '로그아웃'}
        </button>
      </div>
    </div>
  );
};
