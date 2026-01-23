import { EmptyState } from '@/components/ui/EmptyState';
import { Heart } from 'lucide-react';

export function EmptyLoginState() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const dayName = today.toLocaleDateString('ko-KR', { weekday: 'short' });

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 py-3 px-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{year}년</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{month}월</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{day}일</span>
                  <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">({dayName})</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 font-bold text-sm">
                0
              </span>
            </div>
          </div>
        </div>

        <EmptyState
          icon={Heart}
          title="저장된 포스트가 없습니다"
          description="즐겨찾기를 위해서는 로그인이 필요합니다.
마음에 드는 게시글에 하트 버튼을 클릭하여 저장하세요."
        />
      </div>
    </div>
  );
}
