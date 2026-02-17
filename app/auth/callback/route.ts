import { createSupabaseServerClient } from '@/supabase/server.supabase';
import { NextResponse } from 'next/server';

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

      // 로그인 성공 쿼리 파라미터 추가
      const redirectUrl = `${next}${next.includes('?') ? '&' : '?'}login=success`;

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${redirectUrl}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${redirectUrl}`);
      } else {
        return NextResponse.redirect(`${origin}${redirectUrl}`);
      }
    }
  }

  // 로그인 실패 시 에러 파라미터 추가
  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
}
