'use client';

import { DesktopSidebar } from './desktop-sidebar';
import { FooterContainer } from './footer-container';
import { MobileHeader } from './mobile-header';

export function LayoutContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-10 min-h-screen">
      <a
        href="#main-content"
        className="sr-only z-[100] rounded-lg bg-foreground px-4 py-2 font-medium text-background focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        본문 바로가기
      </a>
      <DesktopSidebar />
      <MobileHeader />

      {/* 사이드바 호버 확장은 오버레이 방식이므로 본문 패딩은 접힌 폭(64px)으로 고정 */}
      <div className="with-sidebar-offset pt-16 md:pt-0">
        <main id="main-content" className="min-h-screen">
          {children}
        </main>
        <FooterContainer />
      </div>
    </div>
  );
}
