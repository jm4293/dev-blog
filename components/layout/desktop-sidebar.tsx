'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { sidebarHoveredAtom } from '@/atoms';
import { useTheme } from '@/hooks';
import { MENU_ITEMS } from '@/utils';
import { useSetAtom } from 'jotai';
import { Code2, Moon, Sun } from 'lucide-react';
import { useUser } from '@/features/auth';

const COLLAPSED_W = 64;
const EXPANDED_W = 240;

// GSAP은 hover 애니메이션에만 쓰이므로 초기 번들에서 제외 (마운트 후 비동기 로드)
type Gsap = typeof import('gsap').default;
let gsapCache: Gsap | null = null;

async function loadGsap(): Promise<Gsap> {
  if (!gsapCache) {
    gsapCache = (await import('gsap')).default;
  }
  return gsapCache;
}

export function DesktopSidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { data: user } = useUser();
  const isLoggedIn = !!user;
  const setSidebarHovered = useSetAtom(sidebarHoveredAtom);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const logoLabelRef = useRef<HTMLSpanElement>(null);
  const themeLabelRef = useRef<HTMLSpanElement>(null);

  const isActive = (href: string) =>
    href === '/posts' ? pathname === '/' || pathname === '/posts' : pathname.startsWith(href);

  const getAllLabels = () =>
    [logoLabelRef.current, ...labelRefs.current.filter(Boolean), themeLabelRef.current].filter(Boolean);

  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleMouseEnter = () => {
    setSidebarHovered(true);
    const el = sidebarRef.current;
    if (!el) return;
    void loadGsap().then((gsap) => {
      if (reducedMotion()) {
        gsap.set(el, { width: EXPANDED_W });
        gsap.set(getAllLabels(), { opacity: 1, width: 'auto' });
        return;
      }
      gsap.killTweensOf(el);
      gsap.killTweensOf(getAllLabels());
      gsap.to(el, { width: EXPANDED_W, duration: 0.25, ease: 'power2.out' });
      gsap.to(getAllLabels(), { opacity: 1, width: 'auto', duration: 0.2, stagger: 0.02, ease: 'power2.out' });
    });
  };

  const handleMouseLeave = () => {
    setSidebarHovered(false);
    const el = sidebarRef.current;
    if (!el) return;
    void loadGsap().then((gsap) => {
      if (reducedMotion()) {
        gsap.set(el, { width: COLLAPSED_W });
        gsap.set(getAllLabels(), { opacity: 0, width: 0 });
        return;
      }
      gsap.killTweensOf(el);
      gsap.killTweensOf(getAllLabels());
      gsap.to(el, { width: COLLAPSED_W, duration: 0.2, ease: 'power2.in' });
      gsap.to(getAllLabels(), { opacity: 0, width: 0, duration: 0.15, ease: 'power2.in' });
    });
  };

  // 마운트 후 GSAP 미리 로드 + 픽셀 기준 초기값 설정 (첫 hover 지연 방지)
  useEffect(() => {
    void loadGsap().then((gsap) => {
      if (sidebarRef.current) {
        gsap.set(sidebarRef.current, { width: COLLAPSED_W });
      }
      const labels = getAllLabels();
      if (labels.length > 0) {
        gsap.set(labels, { opacity: 0, width: 0 });
      }
    });
  }, []);

  // Collapse sidebar on route change (e.g., navigating away before mouseleave fires)
  useEffect(() => {
    setSidebarHovered(false);
    void loadGsap().then((gsap) => {
      const el = sidebarRef.current;
      if (el) {
        gsap.killTweensOf(el);
        gsap.set(el, { width: COLLAPSED_W });
      }
      const labels = getAllLabels();
      if (labels.length > 0) {
        gsap.killTweensOf(labels);
        gsap.set(labels, { opacity: 0, width: 0 });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div
      ref={sidebarRef}
      className="glass-sidebar fixed left-0 top-0 z-30 hidden h-full flex-col overflow-hidden md:flex"
      style={{ width: COLLAPSED_W }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Logo */}
      <div className="flex h-16 items-center px-4 py-3">
        <Link href="/posts" className="flex min-w-0 items-center gap-3">
          <Code2 className="h-6 w-6 flex-shrink-0 text-foreground" />
          <span
            ref={logoLabelRef}
            className="overflow-hidden whitespace-nowrap text-lg font-bold text-foreground"
            style={{ width: 0, opacity: 0 }}
          >
            devBlog.kr
          </span>
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex flex-1 flex-col gap-1 px-2 py-4">
        {MENU_ITEMS.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const requiresAuth = item.href === '/bookmarks' || item.href === '/profile';
          const showLoginRequired = requiresAuth && !isLoggedIn;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 overflow-hidden rounded-lg px-3 py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-1 ${
                active ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
              title={item.label}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span
                ref={(el) => {
                  labelRefs.current[index] = el;
                }}
                className="flex items-center gap-2 overflow-hidden whitespace-nowrap text-sm font-medium"
                style={{ width: 0, opacity: 0 }}
              >
                {item.label}
                {showLoginRequired && <span className="text-xs text-muted-foreground opacity-75">(로그인 필요)</span>}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Theme Toggle */}
      <div className="border-t border-border p-3">
        {theme !== null && (
          <button
            onClick={toggleTheme}
            className="flex w-full items-center gap-3 overflow-hidden rounded-lg px-3 py-2 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-1"
            aria-label="테마 변경"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
            ) : (
              <Moon className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
            )}
            <span
              ref={themeLabelRef}
              className="overflow-hidden whitespace-nowrap text-sm font-medium text-muted-foreground"
              style={{ width: 0, opacity: 0 }}
            >
              테마 변경
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
