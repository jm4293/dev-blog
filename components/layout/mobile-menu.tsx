'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { toggleMobileMenuAtom } from '@/atoms';
import { useBackClose, useClickOutside } from '@/hooks';
import { cn, MENU_ITEMS } from '@/utils';
import { useAtom } from 'jotai';
import { useUser } from '@/features/auth';

export function MobileMenu() {
  const pathname = usePathname();
  const { data: user } = useUser();
  const isLoggedIn = !!user;

  const [isOpen, toggle] = useAtom(toggleMobileMenuAtom);
  const menuRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string): boolean => {
    if (href === '/posts') {
      return pathname === '/' || pathname === '/posts';
    }
    return pathname.startsWith(href);
  };

  useBackClose(isOpen, toggle);
  useClickOutside(menuRef, isOpen, toggle);

  // 열릴 때 첫 메뉴 항목으로 포커스 이동, ESC로 닫기
  useEffect(() => {
    if (!isOpen) return;

    menuRef.current?.querySelector<HTMLElement>('a[href]')?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        toggle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, toggle]);

  return (
    <div
      ref={menuRef}
      role="dialog"
      aria-modal={isOpen || undefined}
      aria-label="내비게이션 메뉴"
      aria-hidden={!isOpen}
      className={cn(
        'pointer-events-none absolute left-0 right-0 top-16 border-b border-border bg-background shadow-lg transition-[transform,opacity] duration-200',
        isOpen ? 'pointer-events-auto translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
      )}
    >
      <nav className="container mx-auto space-y-1 px-4 py-4">
        {MENU_ITEMS.map((item) => {
          const requiresAuth = item.href === '/bookmarks' || item.href === '/profile';
          const showLoginRequired = requiresAuth && !isLoggedIn;

          return (
            <Link
              key={item.href}
              href={item.href}
              tabIndex={isOpen ? 0 : -1}
              className={cn(
                'flex items-center justify-between rounded-lg px-4 py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-1',
                isActive(item.href) ? 'bg-foreground font-semibold text-background' : 'text-foreground hover:bg-muted',
              )}
              onClick={toggle}
            >
              <span>{item.label}</span>
              {showLoginRequired && <span className="text-xs text-muted-foreground opacity-75">(로그인 필요)</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
