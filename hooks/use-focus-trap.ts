'use client';

import { RefObject, useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * 다이얼로그 접근성용 포커스 트랩
 *
 * isActive가 true가 되면 컨테이너 안 첫 포커스 가능한 요소로 포커스를 옮기고,
 * Tab/Shift+Tab이 컨테이너 밖으로 나가지 않게 순환시키며,
 * 비활성화될 때 이전 포커스 위치를 복원한다.
 */
export function useFocusTrap<T extends HTMLElement>(isActive: boolean): RefObject<T> {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const firstFocusable = container.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    (firstFocusable ?? container).focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const items = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (items.length === 0) {
        event.preventDefault();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || !container.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !container.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, [isActive]);

  return containerRef;
}
