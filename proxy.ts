import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export default async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Supabase 클라이언트 생성 (세션 검증용)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // 세션 확인
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 1. 메인 페이지(/) 리다이렉트 (기존 로직)
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/posts', request.url), { status: 301 });
  }

  // 2. 인증 필요 라우트 보호
  const protectedRoutes = ['/bookmarks', '/profile'];
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/auth/login', request.url);
    // 로그인 후 원래 페이지로 돌아가기 위한 redirect 파라미터
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 3. 로그인 페이지 접근 시 이미 로그인된 경우 /posts로 리다이렉트
  if (request.nextUrl.pathname === '/auth/login' && session) {
    // redirect 파라미터가 있으면 해당 페이지로, 없으면 /posts로
    const redirectPath = request.nextUrl.searchParams.get('redirect') || '/posts';
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
