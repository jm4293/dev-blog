'use client';

import { useLogout } from '@/features/auth/hooks/useLogout';
import { useDeleteAccount } from '@/features/auth/hooks/useDeleteAccount';
import type { User } from '@supabase/auth-js';
import { useState } from 'react';
import { LogOut, UserX } from 'lucide-react';

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

  const avatarUrl = user.user_metadata?.avatar_url;
  const displayName = user.user_metadata?.name || user.user_metadata?.user_name || '사용자';

  return (
    <>
      {/* 로그아웃 버튼 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <button
          onClick={handleLogout}
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
        >
          <LogOut className="w-5 h-5" />
          {isPending ? '로그아웃 중...' : '로그아웃'}
        </button>
      </div>

      {/* 위험 영역 */}
      <div className="border border-red-200 dark:border-red-800 rounded-xl p-6 bg-red-50/50 dark:bg-red-900/10">
        <div className="flex items-start gap-3 mb-4">
          <UserX className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-red-700 dark:text-red-400">
              회원탈퇴 시 모든 데이터가 영구 삭제되며 복구할 수 없습니다.
            </p>
          </div>
        </div>

        <button
          onClick={handleDeleteAccount}
          disabled={isDeleting || showDeleteConfirm}
          className="w-full px-4 py-2.5 rounded-lg border-2 border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          {isDeleting ? '회원탈퇴 중...' : '회원탈퇴'}
        </button>
      </div>

      {/* 회원탈퇴 최종 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <UserX className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">회원탈퇴 확인</h3>
            </div>

            <div className="mb-6 space-y-2">
              <p className="text-gray-700 dark:text-gray-300 font-medium">정말로 회원탈퇴 하시겠습니까?</p>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  <span>모든 북마크가 영구 삭제됩니다</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  <span>이 작업은 복구할 수 없습니다</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                취소
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isDeleting ? '진행 중...' : '탈퇴하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
