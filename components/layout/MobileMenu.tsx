'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import ThemeToggle from '../theme/ThemeToggle';
import { useAtom } from 'jotai';
import { toggleMobileMenuAtom } from '@/atoms';

interface MenuItem {
  href: string;
  label: string;
}

export function MobileMenu({ isLoggedIn }: { isLoggedIn: boolean }) {
  const pathname = usePathname();
  const [isOpen, toggle] = useAtom(toggleMobileMenuAtom);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      window.history.pushState(null, '', window.location.href);
      const handlePopState = () => {
        toggle();
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, toggle]);

  const isActive = (href: string): boolean => {
    if (href === '/posts') {
      return pathname === '/' || pathname === '/posts';
    }

    return pathname.startsWith(href);
  };

  const menuItems: MenuItem[] = [
    { href: '/posts', label: '포스트' },
    { href: '/bookmarks', label: '즐겨찾기' },
    { href: '/profile', label: '프로필' },
    { href: '/request', label: '요청하기' },
  ];

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30" onClick={toggle} />}

      <div
        className={`fixed top-0 left-0 h-screen w-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="h-16 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg" onClick={toggle}>
            <div className="w-6 h-6 rounded-lg bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white text-xs">
              D
            </div>
            <span>devBlog</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {!isLoggedIn && (
              <Link href="/auth/login">
                <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors">
                  로그인
                </button>
              </Link>
            )}
            <button
              onClick={toggle}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              aria-label="Close menu">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 pt-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-3 rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'text-blue-600 dark:text-blue-400 font-semibold'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white'
              }`}
              onClick={toggle}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
