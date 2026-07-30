'use client';

import { useEffect } from 'react';
import { useFocusTrap } from '@/hooks';
import { AlertTriangle, type LucideIcon } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  /** 본문 설명 (복잡한 본문은 children으로 대체 가능) */
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** 진행 중 상태 — 확인 버튼 비활성 + pendingLabel 표시 */
  isPending?: boolean;
  pendingLabel?: string;
  /** 삭제/탈퇴 등 파괴적 동작이면 확인 버튼을 destructive 스타일로 */
  destructive?: boolean;
  icon?: LucideIcon;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  children?: React.ReactNode;
}

/**
 * 공통 확인 모달 — window.confirm 대체
 *
 * 브라우저 confirm은 앱 톤과 이질적이고 스타일/문구 제어가 불가능하다.
 * 포커스 트랩 + ESC 닫기 + aria 속성을 갖춘 앱 공통 다이얼로그로 통일한다.
 */
export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  isPending = false,
  pendingLabel = '진행 중...',
  destructive = false,
  icon: Icon = AlertTriangle,
  onOpenChange,
  onConfirm,
  children,
}: ConfirmModalProps) {
  const dialogRef = useFocusTrap<HTMLDivElement>(open);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        tabIndex={-1}
        className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-center gap-3">
          <div
            className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${
              destructive ? 'bg-destructive/10' : 'bg-muted'
            }`}
          >
            <Icon className={`h-6 w-6 ${destructive ? 'text-destructive' : 'text-foreground'}`} aria-hidden="true" />
          </div>
          <h3 id="confirm-modal-title" className="text-xl font-bold text-foreground">
            {title}
          </h3>
        </div>

        <div className="mb-6 space-y-2">
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
          {children}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-lg border border-border px-4 py-2.5 font-medium text-foreground transition-colors hover:bg-muted"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className={`flex-1 rounded-lg px-4 py-2.5 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              destructive
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                : 'bg-foreground text-background hover:bg-foreground/90'
            }`}
          >
            {isPending ? pendingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
