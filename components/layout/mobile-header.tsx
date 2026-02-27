import Link from 'next/link';
import { ThemeToggle } from '@/components/theme';
import { MobileHamburger } from './mobile-hamburger';
import { MobileMenu } from './mobile-menu';

export function MobileHeader() {
  return (
    <div className="md:hidden">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <nav className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/posts" className="flex items-center gap-2 text-xl font-bold text-foreground">
            devBlog.kr
          </Link>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <MobileHamburger />
          </div>
        </nav>

        <div className="md:hidden">
          <MobileMenu />
        </div>
      </header>
    </div>
  );
}
