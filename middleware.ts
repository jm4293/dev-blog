// import { type NextRequest, NextResponse } from 'next/server';
// import { createServerClient } from '@supabase/ssr';

// export async function middleware(request: NextRequest) {
//   let response = NextResponse.next({
//     request: {
//       headers: request.headers,
//     },
//   });

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return request.cookies.getAll();
//         },
//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value, options }) => {
//             response.cookies.set(name, value, options);
//           });
//         },
//       },
//     }
//   );

//   // 세션 확인 및 자동 refresh
//   await supabase.auth.getSession();

//   return response;
// }

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
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
