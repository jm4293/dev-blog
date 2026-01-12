'use client';

import { AnimatedBackground } from '@/components/auth/AnimatedBackground';
import { Github, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <AnimatedBackground />

      {/* 로그인 컨테이너 */}
      <div className="relative z-50 w-full max-w-md animate-in fade-in duration-1000">
        <div className="text-center space-y-8">
          {/* 헤더 */}
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-400/30 dark:from-blue-400/15 dark:to-blue-500/15 dark:border-blue-500/30 mb-2">
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">&lt;/&gt;</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 bg-clip-text text-transparent dark:from-blue-300 dark:via-blue-400 dark:to-blue-500">
              devBlog.kr
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-base">한국 개발 기업 블로그 모음</p>
          </div>

          {/* 안내 문구 */}
          <div className="bg-white/5 dark:bg-gray-900/40 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/10 dark:border-blue-500/20 space-y-4 shadow-lg shadow-blue-500/5">
            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">🔐 로그인 방식</h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                devBlog.kr은 GitHub OAuth를 통한 로그인만 지원합니다.
              </p>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-800 dark:text-gray-200">📧 저장되는 정보</h3>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1.5 text-left">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 dark:text-blue-400 mt-0.5">✓</span>
                  <span>GitHub 계정의 이메일 주소</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 dark:text-blue-400 mt-0.5">✓</span>
                  <span>즐겨찾기 관리에만 사용</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500/70 dark:text-red-400/70 mt-0.5">✗</span>
                  <span>추가 정보는 저장되지 않음</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 로그인 버튼 */}
          <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl px-6 py-3.5 font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 dark:hover:shadow-blue-400/20 flex items-center justify-center gap-3 border border-blue-400/50 dark:border-blue-500/30 active:scale-95">
            <Github size={20} />
            <span>GitHub로 로그인</span>
          </button>

          {/* 하단 메시지 */}
          <p className="text-xs text-gray-500 dark:text-gray-600 leading-relaxed px-2">
            로그인하면 개인정보 보호정책과 약관에 동의하는 것입니다.
          </p>

          {/* 데코레이션 */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-blue-500/30 dark:to-blue-400/20" />
            <span className="text-xs text-gray-500 dark:text-gray-600">더 나은 개발 경험을 위해</span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-blue-500/30 dark:to-blue-400/20" />
          </div>

          {/* 뒤로가기 버튼 */}
          <button
            onClick={() => router.back()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 dark:bg-gray-900/30 backdrop-blur-md border border-white/20 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-800/50 transition-all duration-300 hover:scale-105 active:scale-95 group mt-4">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">뒤로가기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
