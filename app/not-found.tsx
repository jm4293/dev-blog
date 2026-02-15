'use client';

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { AnimatedBackground } from '@/features/auth';

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-8">
      <AnimatedBackground />

      <div className="relative z-50 w-full max-w-md duration-1000 animate-in fade-in">
        <div className="space-y-8 text-center">
          <div className="space-y-2">
            <p className="font-mono text-6xl font-bold text-gray-900 dark:text-white">404</p>
            <p className="text-gray-500 dark:text-gray-400">페이지를 찾을 수 없습니다</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">페이지가 없어요</h2>
            <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
              요청하신 페이지가 존재하지 않거나 이동되었습니다.
            </p>

            <Link
              href="/"
              className="mx-auto mb-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-3 font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              <Home className="h-4 w-4" />
              홈으로 돌아가기
            </Link>
          </div>

          <button
            onClick={() => window.history.back()}
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-center font-semibold text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span className="flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              이전 페이지
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
