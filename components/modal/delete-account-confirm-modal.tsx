import { UserX } from 'lucide-react';

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
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-destructive/10">
            <UserX className="h-6 w-6 text-destructive" />
          </div>
          <h3 className="text-xl font-bold text-foreground">회원탈퇴 확인</h3>
        </div>

        <div className="mb-6 space-y-2">
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
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-lg border border-border px-4 py-2.5 font-medium text-foreground transition-colors hover:bg-muted"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 rounded-lg bg-destructive px-4 py-2.5 font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? '진행 중...' : '탈퇴하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
