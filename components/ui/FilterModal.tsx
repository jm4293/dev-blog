'use client';

import { X } from 'lucide-react';
import { ReactNode, useEffect } from 'react';

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
}: FilterModalProps) {
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

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
        <div className="flex max-h-[85vh] w-full animate-slide-up flex-col rounded-t-2xl bg-white shadow-2xl dark:bg-gray-900 sm:max-h-[80vh] sm:max-w-lg sm:animate-scale-in sm:rounded-2xl">
          {/* 헤더 */}
          <div className="flex flex-shrink-0 items-center justify-between px-6 pb-4 pt-6">
            <div className="flex items-center gap-3">
              {icon && (
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30">
                  <span className="text-blue-600 dark:text-blue-400">{icon}</span>
                </div>
              )}
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
                {selectedCount > 0 && (
                  <p className="mt-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
                    {selectedCount}개 선택됨
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
              aria-label="닫기"
            >
              <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* 구분선 */}
          <div className="mx-6 h-px bg-gray-100 dark:bg-gray-800" />

          {/* 콘텐츠 */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12">
                <div className="border-3 h-8 w-8 animate-spin rounded-full border-gray-200 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400" />
                <p className="text-sm text-gray-500 dark:text-gray-400">불러오는 중...</p>
              </div>
            ) : isEmpty ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-sm text-gray-500 dark:text-gray-400">{emptyMessage}</p>
              </div>
            ) : (
              children
            )}
          </div>

          {/* 푸터 */}
          <div className="pb-safe-6 flex flex-shrink-0 gap-3 px-6 py-4">
            <button
              onClick={onReset}
              className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              초기화
            </button>
            <button
              onClick={onComplete || onClose}
              className="flex-2 rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {selectedCount > 0 ? `${selectedCount}개 적용` : '완료'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
