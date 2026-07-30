'use client';

import { UserX } from 'lucide-react';
import { ConfirmModal } from './confirm-modal';

interface DeleteAccountConfirmModalProps {
  open: boolean;
  isDeleting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteAccountConfirmModal({
  open,
  isDeleting,
  onOpenChange,
  onConfirm,
}: DeleteAccountConfirmModalProps) {
  return (
    <ConfirmModal
      open={open}
      title="회원탈퇴 확인"
      icon={UserX}
      destructive
      isPending={isDeleting}
      confirmLabel="탈퇴하기"
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
    >
      <p className="font-medium text-foreground">정말로 회원탈퇴 하시겠습니까?</p>
      <ul className="space-y-1 text-sm text-muted-foreground">
        <li className="flex items-start gap-2">
          <span className="text-destructive">•</span>
          <span>모든 북마크가 영구 삭제됩니다</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-destructive">•</span>
          <span>이 작업은 복구할 수 없습니다</span>
        </li>
      </ul>
    </ConfirmModal>
  );
}
