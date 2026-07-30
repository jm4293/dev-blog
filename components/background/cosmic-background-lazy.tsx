'use client';

import dynamic from 'next/dynamic';

// gsap 등 무거운 의존성을 초기/SSR 번들에서 제외하고 하이드레이션 이후 로드
// (캔버스 애니메이션은 원래 useEffect에서만 동작하므로 동작 변화 없음)
export const CosmicBackgroundLazy = dynamic(() => import('./cosmic-background').then((m) => m.CosmicBackground), {
  ssr: false,
});
