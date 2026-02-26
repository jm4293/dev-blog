'use client';

import { useSyncExternalStore } from 'react';

function subscribeResize(callback: () => void) {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
}

function getSnapshot() {
  return window.innerWidth < 768;
}

function getServerSnapshot() {
  return false;
}

/**
 * 모바일 뷰포트 여부를 감지하는 훅
 * @returns 모바일 여부 (< 768px)
 */
export function useIsMobile() {
  return useSyncExternalStore(subscribeResize, getSnapshot, getServerSnapshot);
}
