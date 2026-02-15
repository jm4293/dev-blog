import { HeaderClient } from './HeaderClient';
import Link from 'next/link';
import { MobileHamburger } from './MobileHamburger';
import { MobileMenu } from './MobileMenu';
import { ThemeToggle } from '@/components/theme';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/80">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/posts" className="flex items-center gap-2 text-xl font-bold">
          devBlog.kr
        </Link>

        <HeaderClient />

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <MobileHamburger />
        </div>
      </nav>

      <div className="md:hidden">
        <MobileMenu />
      </div>
    </header>
  );
}
