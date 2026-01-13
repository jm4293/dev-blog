import { LoginContainer } from '@/features/login';

export const metadata = {
  title: '로그인 | devBlog.kr',
  description: 'GitHub OAuth를 통해 devBlog.kr에 로그인하세요.',
};

export default function LoginPage() {
  return <LoginContainer />;
}
