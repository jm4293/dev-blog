import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * On-Demand ISR (Incremental Static Regeneration) API
 * GitHub Actions에서 새 글 수집 후 호출하여 캐시 갱신
 *
 * 사용법:
 * POST /api/revalidate?secret=xxx&path=/posts
 */
export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get('secret');
  const path = searchParams.get('path');

  // 1. Secret 검증
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  // 2. Path 검증
  if (!path) {
    return NextResponse.json({ message: 'Missing path parameter' }, { status: 400 });
  }

  try {
    // 3. ISR 캐시 갱신
    revalidatePath(path);

    return NextResponse.json({
      revalidated: true,
      path,
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
