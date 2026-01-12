import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '로그인 - devBlog.kr',
  description: 'devBlog.kr에 로그인하세요',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
