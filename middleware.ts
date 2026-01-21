import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const redirectToPosts = (request: NextRequest) => {
  if (request.nextUrl.pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/posts';
    return NextResponse.redirect(url);
  }
};

export function middleware(request: NextRequest) {
  return redirectToPosts(request);
}

export const config = {
  matcher: [
    // API 라우트, 정적 파일, 이미지 제외
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};
