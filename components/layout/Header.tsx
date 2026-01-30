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
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="4" fill="#2563EB" />

            <text
              x="16.5"
              y="18"
              fontFamily="Arial, sans-serif"
              fontSize="24"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
            >
              D
            </text>
          </svg>
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
