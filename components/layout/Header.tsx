import { HeaderClient } from './HeaderClient';
import Link from 'next/link';
import { MobileHamburger } from './MobileHamburger';
import { MobileMenu } from './MobileMenu';
import ThemeToggle from '../theme/ThemeToggle';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/posts" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 rounded-lg bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white">
            D
          </div>
          devBlog
        </Link>

        <HeaderClient />

        <div className="md:hidden flex items-center gap-2">
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
