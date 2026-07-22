import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { secureCompare } from '@/utils/secure-compare';

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get('path');

  // 시크릿은 URL 쿼리(로그에 평문으로 남음) 대신 Authorization 헤더로 받는다
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!secureCompare(token, process.env.REVALIDATE_SECRET)) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  if (!path) {
    return NextResponse.json({ message: 'Missing path parameter' }, { status: 400 });
  }

  try {
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
