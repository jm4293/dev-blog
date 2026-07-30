import { NextRequest, NextResponse } from 'next/server';
import { isSafeRedirectPath } from '@/utils';
import { createSupabaseServerClient } from '@/supabase/server.supabase';

/** 로그인 후 복귀 경로 쿠키 (use-github-login이 OAuth 시작 전에 심음) */
const AUTH_NEXT_COOKIE = 'auth_next';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  // 복귀 경로: 쿠키 우선 (redirectTo 쿼리는 Supabase 허용 목록과 불일치해 사용하지 않음)
  // ?next= 쿼리는 하위 호환용으로만 유지
  const cookieNext = request.cookies.get(AUTH_NEXT_COOKIE)?.value;
  const nextParam = searchParams.get('next') ?? (cookieNext ? decodeURIComponent(cookieNext) : null);

  // 오픈 리다이렉트 방지: 내부 경로만 허용
  const next = isSafeRedirectPath(nextParam) ? nextParam : '/posts';

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
      // 복귀 경로 쿠키는 1회용 — 사용 후 즉시 삭제
      response.cookies.set(AUTH_NEXT_COOKIE, '', { maxAge: 0, path: '/' });
      return response;
    }
  }

  // 로그인 실패 시 에러 파라미터 추가
  const failureResponse = NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
  failureResponse.cookies.set(AUTH_NEXT_COOKIE, '', { maxAge: 0, path: '/' });
  return failureResponse;
}
