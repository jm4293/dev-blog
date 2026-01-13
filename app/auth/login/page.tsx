import { Metadata } from 'next';
import { LoginCard } from '@/features/auth';
import { AnimatedBackground } from '@/components/auth';

export const metadata: Metadata = {
  title: '로그인 | devBlog.kr',
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
            <p className="text-lg text-gray-600 dark:text-gray-400">한국 개발 기업 블로그 모음</p>
          </div>

          <LoginCard />

          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>로그인하면 devBlog.kr의 모든 기능을 사용할 수 있습니다.</p>
            <p className="mt-2">
              아직 계정이 없으신가요?{' '}
              <a
                href="https://github.com/join"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline">
                GitHub 가입하기
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
