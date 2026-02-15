import { UserX } from 'lucide-react';

interface DeleteAccountConfirmModalProps {
  open: boolean;
  isDeleting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const DeleteAccountConfirmModal = ({
  open,
  isDeleting,
  onOpenChange,
  onConfirm,
}: DeleteAccountConfirmModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <UserX className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">회원탈퇴 확인</h3>
        </div>

        <div className="mb-6 space-y-2">
          <p className="font-medium text-gray-700 dark:text-gray-300">정말로 회원탈퇴 하시겠습니까?</p>
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
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-500 dark:hover:bg-red-600"
          >
            {isDeleting ? '진행 중...' : '탈퇴하기'}
          </button>
        </div>
      </div>
    </div>
  );
};
