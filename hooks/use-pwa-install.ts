'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

/** Chrome 계열이 발화하는 설치 프롬프트 이벤트 (표준 타입 정의 없음) */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function subscribeDisplayMode(callback: () => void) {
  const mediaQuery = window.matchMedia('(display-mode: standalone)');
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
}

function getStandaloneSnapshot() {
  // iOS Safari는 display-mode 대신 navigator.standalone으로 노출
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function getServerSnapshot() {
  return false;
}

/**
 * PWA 설치 상태/유도 훅
 *
 * - isStandalone: 이미 홈 화면 앱으로 실행 중인지 (iOS 포함)
 * - canInstall: 브라우저가 설치 프롬프트를 제공하는지 (Chrome 계열의 beforeinstallprompt)
 * - promptInstall: 설치 프롬프트 표시 (수락 여부 반환)
 */
export function usePwaInstall() {
  const isStandalone = useSyncExternalStore(subscribeDisplayMode, getStandaloneSnapshot, getServerSnapshot);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (event: Event) => {
      // 브라우저 기본 미니 인포바 대신 우리 버튼으로 노출
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const promptInstall = async (): Promise<boolean> => {
    if (!installPrompt) {
      return false;
    }

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;

    if (choice.outcome === 'accepted') {
      setInstallPrompt(null);
    }

    return choice.outcome === 'accepted';
  };

  return {
    isStandalone,
    canInstall: installPrompt !== null,
    promptInstall,
  };
}
