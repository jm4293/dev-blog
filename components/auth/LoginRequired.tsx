import Link from 'next/link';
import { LogIn, User as UserIcon } from 'lucide-react';

interface LoginRequiredProps {
  title?: string;
  description?: string;
}

export function LoginRequired({
  title = '로그인이 필요합니다',
  description = 'GitHub 계정으로 로그인하고 서비스를 이용하세요',
}: LoginRequiredProps) {
  return (
    <section className="max-w-2xl mx-auto">
      <article className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
          <p className="text-gray-600 dark:text-gray-400">{description}</p>
        </div>
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          <LogIn className="w-5 h-5" />
          GitHub로 로그인
        </Link>
      </article>
    </section>
  );
}
