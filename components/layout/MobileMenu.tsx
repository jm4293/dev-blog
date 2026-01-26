'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAtom } from 'jotai';
import { toggleMobileMenuAtom } from '@/atoms';

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
      className={`absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-200 ${
        isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}
    >
      <nav className="container mx-auto px-4 py-4 space-y-1">
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-3 rounded-lg transition-colors ${
              isActive(item.href)
                ? 'text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white'
            }`}
            onClick={toggle}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
