'use client';

import { useEffect } from 'react';

/**
 * 서비스워커 상시 등록
 *
 * 기존에는 알림 구독 훅에서만 등록되어 알림을 켜지 않은 사용자는
 * 서비스워커가 없었다 (PWA 설치 가능성 판정 요건 미충족).
 * 앱 시작 시 항상 등록해 두고, 알림 구독은 이 등록을 재사용한다.
 */
export function RegisterServiceWorker() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.register('/sw.js').catch(() => {
      // 등록 실패는 앱 동작에 영향 없음 (다음 방문 시 재시도)
    });
  }, []);

  return null;
}
