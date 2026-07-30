import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { secureCompare } from '@/utils/secure-compare';

// 갱신 허용 경로 화이트리스트 — 시크릿이 유출되더라도 임의 경로 대량 무효화(캐시 스탬피드)를 막는다
const ALLOWED_EXACT = new Set(['/posts', '/tags', '/companies', '/digest', '/sitemap.xml']);
const ALLOWED_PATTERN = /^\/(tags|companies|digest)\/[^/]{1,100}$/;
const MAX_PATHS = 50;

function isAllowedPath(path: string): boolean {
  return ALLOWED_EXACT.has(path) || ALLOWED_PATTERN.test(path);
}

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  // paths(쉼표 구분 다중 경로) 우선, 기존 path(단일)도 하위 호환 지원
  const pathsParam = searchParams.get('paths') ?? searchParams.get('path');

  // 시크릿은 URL 쿼리(로그에 평문으로 남음) 대신 Authorization 헤더로 받는다
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!secureCompare(token, process.env.REVALIDATE_SECRET)) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  if (!pathsParam) {
    return NextResponse.json({ message: 'Missing paths parameter' }, { status: 400 });
  }

  const paths = pathsParam
    .split(',')
    .map((path) => path.trim())
    .filter(Boolean)
    .slice(0, MAX_PATHS);

  if (paths.length === 0) {
    return NextResponse.json({ message: 'Missing paths parameter' }, { status: 400 });
  }

  const invalidPaths = paths.filter((path) => !isAllowedPath(path));
  if (invalidPaths.length > 0) {
    return NextResponse.json({ message: 'Invalid paths', invalid: invalidPaths }, { status: 400 });
  }

  try {
    paths.forEach((path) => revalidatePath(path));

    return NextResponse.json({
      revalidated: true,
      paths,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: 'Error revalidating',
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
