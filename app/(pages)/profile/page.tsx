import { Metadata } from 'next';
import { getCurrentUser } from '@/supabase/getCurrentUser';
import { ProfileClient } from '@/features/profile/ui/ProfileClient';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '내 정보 | devBlog.kr',
  description: '프로필 정보 및 계정 설정',
};

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">프로필</h1>
        <p className="mb-8">프로필을 보려면 로그인해야 합니다.</p>
        <Link href="/auth/login" className="mr-4 text-blue-600 hover:underline">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">로그인하러 가기</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">프로필</h1>

      <ProfileClient user={user} />
    </div>
  );
}
