'use client';

import { Bell, Bookmark, Sparkles } from 'lucide-react';
import { useGithubLogin } from '../hooks';

interface LoginCardProps {
  /** 콜백 실패 시 URL로 전달되는 에러 코드 (예: auth_failed) */
  callbackError?: string;
}

const BENEFITS = [
  { Icon: Bookmark, text: '마음에 드는 글을 즐겨찾기로 저장' },
  { Icon: Bell, text: '새 글이 올라오면 Push 알림 받기' },
  { Icon: Sparkles, text: '관심 태그·회사만 골라서 알림 설정' },
];

export function LoginCard({ callbackError }: LoginCardProps) {
  const { mutate, error, isPending, isSuccess } = useGithubLogin();

  // isSuccess 이후에도 GitHub으로 리다이렉트될 때까지 잠깐 머무르므로 계속 진행 중으로 표시
  const isRedirecting = isPending || isSuccess;

  const errorMessage = error
    ? '로그인에 실패했습니다. 잠시 후 다시 시도해주세요.'
    : callbackError
      ? 'GitHub 인증이 완료되지 않았습니다. 다시 시도해주세요.'
      : null;

  return (
    <div className="rounded-lg border border-white/15 bg-white/5 p-8 backdrop-blur-sm">
      <h2 className="mb-2 text-2xl font-semibold text-white">로그인</h2>
      <p className="mb-6 text-sm text-white/60">GitHub 계정으로 간편하게 시작하세요</p>

      <ul className="mb-6 space-y-3 text-left">
        {BENEFITS.map(({ Icon, text }) => (
          <li key={text} className="flex items-center gap-3 text-sm text-white/80">
            <Icon className="h-4 w-4 shrink-0 text-white/50" aria-hidden />
            {text}
          </li>
        ))}
      </ul>

      {errorMessage && !isRedirecting && (
        <div role="alert" className="mb-6 rounded-lg border border-red-400/40 bg-red-500/15 p-4">
          <p className="text-sm text-red-200">{errorMessage}</p>
        </div>
      )}

      <button
        onClick={() => mutate()}
        disabled={isRedirecting}
        aria-busy={isRedirecting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 font-semibold text-black transition-colors hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isRedirecting ? (
          <>
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            GitHub으로 이동 중...
          </>
        ) : (
          <>
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.544 2.914 1.186.092-.923.35-1.543.636-1.897-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.817c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.195 20 14.44 20 10.017 20 4.484 15.522 0 10 0z"
                clipRule="evenodd"
              />
            </svg>
            GitHub 로그인
          </>
        )}
      </button>

      {/* 진행 상황 안내 — 클릭 후 GitHub 페이지로 넘어가기까지의 공백을 설명 */}
      <p aria-live="polite" className="mt-3 min-h-4 text-xs text-white/50">
        {isRedirecting ? '잠시 후 GitHub 로그인 페이지로 이동합니다. 새로고침하지 마세요.' : ''}
      </p>
    </div>
  );
}
