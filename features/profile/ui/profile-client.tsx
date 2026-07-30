'use client';

import { useState } from 'react';
import { LogOut, Trash2 } from 'lucide-react';
import { useDeleteAccount } from '@/features/auth/hooks/use-delete-account';
import { useLogout } from '@/features/auth/hooks/use-logout';
import { ConfirmModal, DeleteAccountConfirmModal } from '@/components/modal';

export function ProfileClient() {
  const { mutate: logout, isPending } = useLogout();
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <>
      {/* 로그아웃 */}
      <div className="mb-4 rounded-xl border border-border bg-card p-6">
        <h3 className="mb-1 text-sm font-semibold text-foreground">로그아웃</h3>
        <p className="mb-4 text-sm text-muted-foreground">현재 기기에서 로그아웃합니다.</p>
        <button
          onClick={() => setShowLogoutConfirm(true)}
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
          onClick={() => setShowDeleteConfirm(true)}
          disabled={isDeleting || showDeleteConfirm}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-destructive/50 px-4 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
          {isDeleting ? '회원탈퇴 중...' : '회원탈퇴'}
        </button>
      </div>

      <ConfirmModal
        open={showLogoutConfirm}
        title="로그아웃"
        description="현재 기기에서 로그아웃할까요?"
        confirmLabel="로그아웃"
        icon={LogOut}
        isPending={isPending}
        pendingLabel="로그아웃 중..."
        onOpenChange={setShowLogoutConfirm}
        onConfirm={() => {
          setShowLogoutConfirm(false);
          logout();
        }}
      />

      {/* 탈퇴는 파괴적 동작이므로 상세 안내가 있는 전용 모달 1회 확인 (confirm 중복 확인 제거) */}
      <DeleteAccountConfirmModal
        open={showDeleteConfirm}
        isDeleting={isDeleting}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={deleteAccount}
      />
    </>
  );
}
