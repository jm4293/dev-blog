'use client';

import { useLogout } from '@/features/auth/hooks/useLogout';
import { useDeleteAccount } from '@/features/auth/hooks/useDeleteAccount';
import { DeleteAccountConfirmModal } from '@/components/modal';
import type { User } from '@supabase/auth-js';
import { useState } from 'react';

interface ProfileClientProps {
  user: User;
}

export const ProfileClient = ({ user }: ProfileClientProps) => {
  const { mutate: logout, isPending } = useLogout();
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      logout();
    }
  };

  const handleDeleteAccount = () => {
    if (!confirm('정말로 회원탈퇴 하시겠습니까?\n계정과 모든 북마크가 삭제되며 복구할 수 없습니다.')) {
      return;
    }

    setShowDeleteConfirm(true);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-blue-200 dark:border-blue-900/50 p-6 mb-6">
        <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-3">로그아웃</h3>
        <button
          onClick={handleLogout}
          disabled={isPending}
          className="w-full px-4 py-2.5 rounded-lg border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          {isPending ? '로그아웃 중...' : '로그아웃'}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-red-200 dark:border-red-900/50 p-6 mb-6">
        <h3 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-3">회원 탈퇴</h3>
        <div className="mb-4">
          <p className="text-sm text-red-700 dark:text-red-400">
            회원탈퇴 시 모든 데이터가 영구 삭제되며 복구할 수 없습니다.
          </p>
        </div>

        <button
          onClick={handleDeleteAccount}
          disabled={isDeleting || showDeleteConfirm}
          className="w-full px-4 py-2.5 rounded-lg border-2 border-red-600 dark:border-red-700 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          {isDeleting ? '회원탈퇴 중...' : '회원탈퇴'}
        </button>
      </div>

      <DeleteAccountConfirmModal
        open={showDeleteConfirm}
        isDeleting={isDeleting}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={deleteAccount}
      />
    </>
  );
};
