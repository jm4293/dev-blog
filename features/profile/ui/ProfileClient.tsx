'use client';

import { useLogout } from '@/features/auth/hooks/useLogout';
import { useDeleteAccount } from '@/features/auth/hooks/useDeleteAccount';
import type { User } from '@supabase/auth-js';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
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
    // 첫 번째 확인
    if (!confirm('정말로 회원탈퇴 하시겠습니까?\n계정과 모든 북마크가 삭제되며 복구할 수 없습니다.')) {
      return;
    }

    // 두 번째 확인 모달 표시
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    deleteAccount();
    setShowDeleteConfirm(false);
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

      <div className="flex gap-4 mb-8">
        <button
          onClick={handleLogout}
          disabled={isPending}
          className="flex-1 px-6 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium">
          {isPending ? '로그아웃 중...' : '로그아웃'}
        </button>
      </div>

      <div className="text-right">
        <button
          onClick={handleDeleteAccount}
          disabled={isDeleting || showDeleteConfirm}
          className="text-sm text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {isDeleting ? '회원탈퇴 중...' : '회원탈퇴'}
        </button>
      </div>

      {/* 회원탈퇴 최종 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 w-full max-w-lg mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">회원탈퇴 확인</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
              정말로 회원탈퇴 하시겠습니까?
              <br />
              <br />
              • 모든 북마크가 영구 삭제됩니다
              <br />
              • 이 작업은 복구할 수 없습니다
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">
                취소
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium">
                {isDeleting ? '진행 중...' : '회원탈퇴'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
