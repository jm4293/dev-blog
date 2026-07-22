'use client';

import { ReactNode, useEffect } from 'react';
import { useFocusTrap } from '@/hooks';
import { X } from 'lucide-react';

interface FilterModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  onComplete?: () => void;
  children: ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  selectedCount?: number;
  icon?: ReactNode;
  /** 검색 등으로 콘텐츠 양이 수시로 변하는 모달은 높이를 고정해 흔들림 방지 */
  fixedHeight?: boolean;
}

export function FilterModal({
  title,
  isOpen,
  onClose,
  onReset,
  onComplete,
  children,
  isLoading = false,
  isEmpty = false,
  emptyMessage = '데이터가 없습니다.',
  selectedCount = 0,
  icon,
  fixedHeight = false,
}: FilterModalProps) {
  const dialogRef = useFocusTrap<HTMLDivElement>(isOpen);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // ESC 키로 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div aria-hidden="true" className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          tabIndex={-1}
          className={`glass-modal flex w-full animate-slide-up flex-col rounded-t-2xl shadow-2xl sm:max-w-lg sm:animate-scale-in sm:rounded-2xl ${
            fixedHeight ? 'h-[85vh] sm:h-[80vh]' : 'max-h-[85vh] sm:max-h-[80vh]'
          }`}
        >
          {/* 헤더 */}
          <div className="flex flex-shrink-0 items-center justify-between border-b border-border px-6 pb-4 pt-6">
            <div className="flex items-center gap-3">
              {icon && (
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted">
                  <span className="text-foreground">{icon}</span>
                </div>
              )}
              <div>
                <h2 className="text-lg font-bold text-foreground">{title}</h2>
                {selectedCount > 0 && (
                  <p className="mt-0.5 text-xs font-medium text-muted-foreground">{selectedCount}개 선택됨</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-muted transition-colors hover:bg-muted/80"
              aria-label="닫기"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* 콘텐츠 */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
                <p className="text-sm text-muted-foreground">불러오는 중...</p>
              </div>
            ) : isEmpty ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-sm text-muted-foreground">{emptyMessage}</p>
              </div>
            ) : (
              children
            )}
          </div>

          {/* 푸터 */}
          <div className="pb-safe-6 flex flex-shrink-0 gap-3 border-t border-border px-6 py-4">
            <button
              onClick={onReset}
              className="glass-card flex-1 rounded-xl py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted/60"
            >
              초기화
            </button>
            <button
              onClick={onComplete || onClose}
              className="flex-2 rounded-xl bg-foreground px-8 py-3 text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
            >
              {selectedCount > 0 ? `${selectedCount}개 적용` : '완료'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
