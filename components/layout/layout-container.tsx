'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { sidebarHoveredAtom } from '@/atoms';
import { useAtom } from 'jotai';
import { DesktopSidebar } from './desktop-sidebar';
import { FooterContainer } from './footer-container';
import { MobileHeader } from './mobile-header';

export function LayoutContainer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarHovered, setSidebarHovered] = useAtom(sidebarHoveredAtom);

  useEffect(() => {
    setSidebarHovered(false);
  }, [pathname, setSidebarHovered]);

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

      <div
        className="pt-16 transition-[padding-left] duration-300 ease-out md:pt-0"
        data-sidebar-expanded={isSidebarHovered}
      >
        <main id="main-content" className="min-h-screen">
          {children}
        </main>
        <FooterContainer />
      </div>
    </div>
  );
}
