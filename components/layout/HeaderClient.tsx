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
            className={`rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-2 ${
              item.active ? 'font-bold text-foreground' : 'text-muted-foreground hover:text-foreground'
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
