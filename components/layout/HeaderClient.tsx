'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from '../theme/ThemeToggle';
import { MobileMenu } from './MobileMenu';

interface NavItem {
  href: string;
  label: string;
  active: boolean;
}

export function HeaderClient({ isLoggedIn }: { isLoggedIn: boolean }) {
  const pathname = usePathname();

  const isActive = (href: string): boolean => {
    if (href === '/posts') {
      return pathname === '/' || pathname === '/posts';
    }

    return pathname.startsWith(href);
  };

  const navItems: NavItem[] = [
    { href: '/posts', label: '포스트', active: isActive('/posts') },
    { href: '/bookmarks', label: '즐겨찾기', active: isActive('/bookmarks') },
    { href: '/profile', label: '프로필', active: isActive('/profile') },
    { href: '/announcements', label: '새로운 소식', active: isActive('/announcements') },
    { href: '/request', label: '요청하기', active: isActive('/request') },
  ];

  return (
    <>
      <div className="hidden md:flex items-center gap-8">
        <nav className="flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors ${
                item.active
                  ? 'text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
              }`}
            >
              {item.label}
            </Link>
          ))}

          <ThemeToggle />
          {!isLoggedIn && (
            <Link href="/auth/login">
              <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors">
                로그인
              </button>
            </Link>
          )}
        </nav>
      </div>

      <MobileMenu isLoggedIn={isLoggedIn} />
    </>
  );
}
