'use client';

import { useEffect } from 'react';
import { CosmicBackground } from '@/components/background';
import { pretendard } from './fonts';
import './globals.css';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // 에러 로깅
    console.error(error);
  }, [error]);

  return (
    <html lang="ko" className={`dark ${pretendard.variable}`}>
      <body className="min-h-screen">
        <div className="relative flex min-h-screen items-center justify-center px-4 py-8">
          <CosmicBackground />

          <div className="relative z-50 w-full max-w-md duration-1000 animate-in fade-in">
            <div className="space-y-8 text-center">
              <div className="space-y-2">
                <p className="font-mono text-6xl font-bold text-white">500</p>
                <p className="text-white/60">문제가 발생했습니다</p>
              </div>

              <div className="rounded-lg border border-white/15 bg-white/5 p-8 backdrop-blur-sm">
                <h2 className="mb-2 text-lg font-semibold text-white">잠시 문제가 생겼어요</h2>
                <p className="mb-6 text-sm text-white/70">
                  예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
                </p>

                <button
                  onClick={() => reset()}
                  className="mx-auto flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 font-semibold text-black transition-colors hover:bg-white/90"
                >
                  다시 시도
                </button>
              </div>

              {error.digest && <p className="font-mono text-xs text-white/40">오류 코드: {error.digest}</p>}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
