import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/supabase/server.supabase';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  let next = searchParams.get('next') ?? '/posts';

  if (code) {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development';

      let redirectBase: string;
      if (isLocalEnv) {
        redirectBase = origin;
      } else if (forwardedHost) {
        redirectBase = `https://${forwardedHost}`;
      } else {
        redirectBase = origin;
      }

      // 로그인 성공 표시는 URL 파라미터 대신 1회용 쿠키 사용
      // (URL에 담으면 라우터 캐시/히스토리에 남아 토스트가 재발화하는 문제가 있음)
      const response = NextResponse.redirect(`${redirectBase}${next}`);
      response.cookies.set('login_success', '1', {
        maxAge: 60,
        path: '/',
        sameSite: 'lax',
        httpOnly: false, // 클라이언트에서 읽고 삭제해야 함
      });
      return response;
    }
  }

  // 로그인 실패 시 에러 파라미터 추가
  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
}
