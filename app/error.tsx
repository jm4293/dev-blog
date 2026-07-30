'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Home, RotateCw } from 'lucide-react';
import { CosmicBackgroundLazy } from '@/components/background';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 에러 로깅
    console.error(error);
  }, [error]);

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-8">
      <CosmicBackgroundLazy />

      <div className="relative z-50 w-full max-w-md duration-1000 animate-in fade-in">
        <div className="space-y-8 text-center">
          <div className="space-y-2">
            <p className="font-mono text-6xl font-bold text-white">500</p>
            <p className="text-white/60">문제가 발생했습니다</p>
          </div>

          <div className="rounded-lg border border-white/15 bg-white/5 p-8 backdrop-blur-sm">
            <h2 className="mb-2 text-lg font-semibold text-white">잠시 문제가 생겼어요</h2>
            <p className="mb-6 text-sm text-white/70">예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.</p>

            <button
              onClick={() => reset()}
              className="mx-auto flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 font-semibold text-black transition-colors hover:bg-white/90"
            >
              <RotateCw className="h-4 w-4" />
              다시 시도
            </button>
          </div>

          {/* /는 /posts로 301되므로 직행 (리다이렉트 1회 절약) */}
          <Link
            href="/posts"
            className="block w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-center font-semibold text-white/80 backdrop-blur-sm transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white"
          >
            <span className="flex items-center justify-center gap-2">
              <Home className="h-4 w-4" />
              포스트로 돌아가기
            </span>
          </Link>

          {/* 이 페이지는 사이드바/헤더가 없는 전체 화면이라 주요 메뉴로 가는 탈출구를 함께 제공 */}
          <nav aria-label="주요 메뉴" className="flex justify-center gap-4 text-sm text-white/60">
            <Link href="/digest" className="transition-colors hover:text-white">
              주간 인기글
            </Link>
            <Link href="/tags" className="transition-colors hover:text-white">
              태그
            </Link>
            <Link href="/companies" className="transition-colors hover:text-white">
              기업
            </Link>
          </nav>

          {error.digest && <p className="font-mono text-xs text-white/60">오류 코드: {error.digest}</p>}
        </div>
      </div>
    </div>
  );
}
