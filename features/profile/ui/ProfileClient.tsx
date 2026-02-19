'use client';

import { useLogout } from '@/features/auth/hooks/useLogout';
import { useDeleteAccount } from '@/features/auth/hooks/useDeleteAccount';
import { DeleteAccountConfirmModal } from '@/components/modal';
import type { User } from '@supabase/auth-js';
import { useState } from 'react';
import { LogOut, Trash2 } from 'lucide-react';

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
      {/* 로그아웃 */}
      <div className="mb-4 rounded-xl border border-border bg-card p-6">
        <h3 className="mb-1 text-sm font-semibold text-foreground">로그아웃</h3>
        <p className="mb-4 text-sm text-muted-foreground">현재 기기에서 로그아웃합니다.</p>
        <button
          onClick={handleLogout}
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LogOut className="h-4 w-4" />
          {isPending ? '로그아웃 중...' : '로그아웃'}
        </button>
      </div>

      {/* 회원 탈퇴 */}
      <div className="mb-4 rounded-xl border border-destructive/30 bg-card p-6">
        <h3 className="mb-1 text-sm font-semibold text-destructive">회원 탈퇴</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          회원탈퇴 시 모든 데이터가 영구 삭제되며 복구할 수 없습니다.
        </p>
        <button
          onClick={handleDeleteAccount}
          disabled={isDeleting || showDeleteConfirm}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-destructive/50 px-4 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
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
