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
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      {/* Modal: Flexbox로 Header/Content/Footer 구조 (Footer는 항상 고정) */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
          {/* Header (고정) */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between flex-shrink-0 bg-white dark:bg-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Content (스크롤 가능) */}
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

          {/* Footer (고정, 항상 보임) */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-6 flex justify-end gap-3 flex-shrink-0 bg-white dark:bg-gray-800">
            <button
              onClick={onReset}
              className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              초기화
            </button>
            <button
              onClick={onComplete || onClose}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
            >
              완료
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
