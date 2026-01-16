'use client';

import { useEffect, useState } from 'react';

/**
 * 모바일 뷰포트 여부를 감지하는 훅
 * @returns 모바일 여부 (< 768px)
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 초기 값 설정
    setIsMobile(window.innerWidth < 768);

    // 리사이즈 이벤트 핸들러
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}
