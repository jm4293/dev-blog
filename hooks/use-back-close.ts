import { useEffect } from 'react';

/** 열린 상태에서 브라우저 뒤로가기 시 onClose 호출 */
export function useBackClose(isOpen: boolean, onClose: () => void) {
  useEffect(() => {
    if (!isOpen) return;

    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => onClose();
    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, [isOpen, onClose]);
}
