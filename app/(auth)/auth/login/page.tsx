import { Metadata } from 'next';
import Link from 'next/link';
import { LoginCard } from '@/features/auth';
import { CosmicBackground } from '@/components/background';

export const metadata: Metadata = {
  title: '로그인 | devBlog',
  description: 'GitHub OAuth를 통해 devBlog.kr에 로그인하세요.',
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-8">
      <CosmicBackground />

      <div className="relative z-50 w-full max-w-md duration-1000 animate-in fade-in">
        <div className="space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white">devBlog.kr</h1>
          </div>

          <LoginCard />

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
