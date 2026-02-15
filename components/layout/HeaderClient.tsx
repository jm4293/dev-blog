'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme';

interface NavItem {
  href: string;
  label: string;
  active: boolean;
}

export function HeaderClient() {
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
    <div className="hidden items-center gap-8 md:flex">
      <nav className="flex items-center gap-8">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`transition-colors ${
              item.active
                ? 'font-semibold text-blue-600 dark:text-blue-400'
                : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
            }`}
          >
            {item.label}
          </Link>
        ))}

        <ThemeToggle />
      </nav>
    </div>
  );
}
