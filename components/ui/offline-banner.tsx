'use client';

import { useSyncExternalStore } from 'react';
import { WifiOff } from 'lucide-react';

function subscribeOnlineStatus(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function getOnlineSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true;
}

/**
 * 오프라인 안내 배너 (비차단)
 *
 * 전체 화면을 덮으면 이미 로드된 콘텐츠 읽기까지 막게 되므로,
 * 상단 스트립으로만 알리고 화면 사용은 계속 허용한다.
 * 온라인 복귀 시 자동으로 사라진다.
 */
export function OfflineBanner() {
  const isOnline = useSyncExternalStore(subscribeOnlineStatus, getOnlineSnapshot, getServerSnapshot);

  if (isOnline) return null;

  return (
    <div
      role="alert"
      className="fixed inset-x-0 top-0 z-[9999] flex items-center justify-center gap-3 border-b border-border bg-card px-4 py-2.5 text-sm shadow-lg"
    >
      <WifiOff aria-hidden="true" className="h-4 w-4 shrink-0 text-destructive" />
      <p className="text-foreground">
        네트워크 연결이 끊겼습니다.
        <span className="ml-1 text-muted-foreground">연결되면 자동으로 다시 동작합니다.</span>
      </p>
      <button
        onClick={() => window.location.reload()}
        className="shrink-0 rounded-md bg-foreground px-2.5 py-1 text-xs font-semibold text-background transition-opacity hover:opacity-90"
      >
        다시 시도
      </button>
    </div>
  );
}
