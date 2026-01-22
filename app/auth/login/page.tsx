import { Metadata } from 'next';
import { AnimatedBackground, LoginCard } from '@/features/auth';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '로그인 | devBlog',
  description: 'GitHub OAuth를 통해 devBlog.kr에 로그인하세요.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative">
      <AnimatedBackground />

      <div className="relative z-50 w-full max-w-md animate-in fade-in duration-1000">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">devBlog.kr</h1>
          </div>

          <LoginCard />

          <Link
            href="/posts"
            className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white font-semibold rounded-lg border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors block text-center"
          >
            뒤로가기
          </Link>
        </div>
      </div>
    </div>
  );
}
