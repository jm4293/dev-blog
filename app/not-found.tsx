'use client';

import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';
import { CosmicBackgroundLazy } from '@/components/background';

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-8">
      <CosmicBackgroundLazy />

      <div className="relative z-50 w-full max-w-md duration-1000 animate-in fade-in">
        <div className="space-y-8 text-center">
          <div className="space-y-2">
            <p className="font-mono text-6xl font-bold text-white">404</p>
            <p className="text-white/60">페이지를 찾을 수 없습니다</p>
          </div>

          <div className="rounded-lg border border-white/15 bg-white/5 p-8 backdrop-blur-sm">
            <h2 className="mb-2 text-lg font-semibold text-white">페이지가 없어요</h2>
            <p className="mb-6 text-sm text-white/70">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>

            {/* /는 /posts로 301되므로 직행 (리다이렉트 1회 절약) */}
            <Link
              href="/posts"
              className="mx-auto mb-4 flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 font-semibold text-black transition-colors hover:bg-white/90"
            >
              <Home className="h-4 w-4" />
              포스트로 돌아가기
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
          </div>

          <button
            onClick={() => window.history.back()}
            className="block w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-center font-semibold text-white/80 backdrop-blur-sm transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white"
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
