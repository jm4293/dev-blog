import { Metadata } from 'next';
import Link from 'next/link';
import { LoginCard } from '@/features/auth';
import { CosmicBackground } from '@/components/background';

export const metadata: Metadata = {
  title: '로그인',
  description: 'GitHub 계정으로 devBlog.kr에 로그인하고 즐겨찾기와 새 글 알림을 이용하세요.',
};

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  // 콜백 실패 시 /auth/login?error=auth_failed 로 리다이렉트됨
  const { error } = await searchParams;

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-8">
      <CosmicBackground />

      <div className="relative z-50 w-full max-w-md duration-1000 animate-in fade-in">
        <div className="space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white">devBlog.kr</h1>
          </div>

          <LoginCard callbackError={error} />

          <Link
            href="/posts"
            className="block w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-center font-semibold text-white/80 backdrop-blur-sm transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white"
          >
            뒤로가기
          </Link>
        </div>
      </div>
    </div>
  );
}
