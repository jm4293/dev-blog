'use client';

import { useState } from 'react';

/**
 * 모달이 열릴 때마다 내부 state를 리셋하기 위한 key를 생성합니다.
 * isOpen이 false→true로 전환될 때마다 key가 증가합니다.
 */
export function useResetKey(isOpen: boolean): number {
  const [openCount, setOpenCount] = useState(0);
  const [wasOpen, setWasOpen] = useState(false);

  if (isOpen && !wasOpen) {
    setOpenCount((c) => c + 1);
    setWasOpen(true);
  }
  if (!isOpen && wasOpen) {
    setWasOpen(false);
  }

  return openCount;
}
