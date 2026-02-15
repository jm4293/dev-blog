'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAtom } from 'jotai';
import { toggleMobileMenuAtom } from '@/atoms';
import { cn } from '@/utils';

interface MenuItem {
  href: string;
  label: string;
}

const MENU_ITEMS: MenuItem[] = [
  { href: '/posts', label: '포스트' },
  { href: '/bookmarks', label: '즐겨찾기' },
  { href: '/profile', label: '프로필' },
  { href: '/announcements', label: '새로운 소식' },
  { href: '/request', label: '요청하기' },
];

const ANIMATION_DURATION = 200;

export function MobileMenu() {
  const pathname = usePathname();
  const [isOpen, toggle] = useAtom(toggleMobileMenuAtom);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string): boolean => {
    if (href === '/posts') {
      return pathname === '/' || pathname === '/posts';
    }
    return pathname.startsWith(href);
  };

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, ANIMATION_DURATION);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      toggle();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen, toggle]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        toggle();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, toggle]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      ref={menuRef}
      className={cn(
        'absolute left-0 right-0 top-16 border-b border-gray-200 bg-white shadow-lg transition-all duration-200 dark:border-gray-700 dark:bg-gray-900',
        isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
      )}
    >
      <nav className="container mx-auto space-y-1 px-4 py-4">
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'block rounded-lg px-4 py-3 transition-colors',
              isActive(item.href)
                ? 'bg-blue-50 font-semibold text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800',
            )}
            onClick={toggle}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
