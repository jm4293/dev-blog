'use client';

import { X } from 'lucide-react';
import { ReactNode } from 'react';

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
}

/**
 * 재사용 가능한 필터 모달 컴포넌트
 * - 헤더: 제목 + 닫기 버튼 (고정)
 * - 콘텐츠: 스크롤 가능 영역
 * - 푸터: 초기화/완료 버튼 (고정, 항상 보임)
 */
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
}: FilterModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="flex max-h-[80vh] w-full max-w-2xl flex-col rounded-lg bg-white shadow-xl dark:bg-gray-800">
          <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Close modal"
            >
              <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-600 dark:text-gray-400">로딩 중...</div>
              </div>
            ) : isEmpty ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-600 dark:text-gray-400">{emptyMessage}</div>
              </div>
            ) : (
              children
            )}
          </div>

          <div className="flex flex-shrink-0 justify-end gap-3 border-t border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <button
              onClick={onReset}
              className="rounded-lg border border-gray-300 px-6 py-2 font-semibold text-gray-900 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
            >
              초기화
            </button>
            <button
              onClick={onComplete || onClose}
              className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              완료
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
