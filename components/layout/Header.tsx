import Link from 'next/link';
import ThemeToggle from '../theme/ThemeToggle';
import { MobileMenu } from './MobileMenu';
import { MobileHamburger } from './MobileHamburger';
import { getCurrentUser } from '@/supabase';

export async function Header() {
  const user = await getCurrentUser();

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white">
              D
            </div>
            devBlog
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
                포스트
              </Link>
              <Link
                href="/bookmarks"
                className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
                즐겨찾기
              </Link>
              <Link
                href="/request"
                className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
                요청하기
              </Link>
              {!!user && (
                <Link
                  href="/profile"
                  className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
                  프로필
                </Link>
              )}
              <ThemeToggle />
              {!user && (
                <Link href="/auth/login">
                  <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors">
                    로그인
                  </button>
                </Link>
              )}
            </nav>
          </div>

          <div className="md:hidden">
            <MobileHamburger />
          </div>
        </div>
      </header>

      <MobileMenu isLoggedIn={!!user} />
    </>
  );
}
