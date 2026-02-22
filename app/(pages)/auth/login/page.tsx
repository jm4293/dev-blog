import { Metadata } from 'next';
import { AnimatedBackground, LoginCard } from '@/features/auth';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '로그인 | devBlog',
  description: 'GitHub OAuth를 통해 devBlog.kr에 로그인하세요.',
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-8">
      <AnimatedBackground />

      <div className="relative z-50 w-full max-w-md duration-1000 animate-in fade-in">
        <div className="space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">devBlog.kr</h1>
          </div>

          <LoginCard />

          <Link
            href="/posts"
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-center font-semibold text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            뒤로가기
          </Link>
        </div>
      </div>
    </div>
  );
}
