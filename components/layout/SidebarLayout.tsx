'use client';

import { Suspense } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';

function HeaderFallback() {
  return (
    <header className="sticky top-0 z-50 h-16 animate-pulse border-b border-border bg-background/80 backdrop-blur-md" />
  );
}

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {/* Desktop Sidebar — fixed, overlays content on hover */}
      <Sidebar />

      {/* Main content — offset by collapsed sidebar width on desktop only */}
      {/* pt-16: compensate for fixed mobile header height (64px) */}
      <div className="pt-16 md:ml-[64px] md:pt-0">
        {/* Mobile header — sticky so it stays at top while scrolling */}
        <div className="md:hidden">
          <Suspense fallback={<HeaderFallback />}>
            <Header />
          </Suspense>
        </div>

        <main className="min-h-screen">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
