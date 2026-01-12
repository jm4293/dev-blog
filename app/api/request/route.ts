import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/supabase/server.supabase';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// DOMPurify 초기화 (서버 사이드에서 사용하기 위해)
const window = new JSDOM('').window;
const DOMPurifyServer = DOMPurify(window as any);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, companyName, tagName, blogUrl, message, email } = body;

    // 입력 데이터 sanitize
    const sanitizedData = {
      type: typeof type === 'string' ? type.trim() : '',
      companyName: typeof companyName === 'string' ? DOMPurifyServer.sanitize(companyName.trim()) : '',
      tagName: typeof tagName === 'string' ? DOMPurifyServer.sanitize(tagName.trim()) : '',
      blogUrl: typeof blogUrl === 'string' ? blogUrl.trim() : '',
      message: typeof message === 'string' ? DOMPurifyServer.sanitize(message.trim()) : '',
      email: typeof email === 'string' ? email.trim() : '',
    };

    // 유효성 검사
    if (!sanitizedData.type || !sanitizedData.message) {
      return NextResponse.json({ error: '필수 필드가 누락되었습니다.' }, { status: 400 });
    }

    if (!['company', 'tag', 'other'].includes(sanitizedData.type)) {
      return NextResponse.json({ error: '유효하지 않은 요청 유형입니다.' }, { status: 400 });
    }

    // 메시지 길이 제한 (너무 짧거나 긴 메시지 방지)
    if (sanitizedData.message.length < 10) {
      return NextResponse.json({ error: '메시지가 너무 짧습니다. 최소 10자 이상 입력해주세요.' }, { status: 400 });
    }
    if (sanitizedData.message.length > 1000) {
      return NextResponse.json({ error: '메시지가 너무 깁니다. 최대 1000자까지 입력 가능합니다.' }, { status: 400 });
    }

    // 스팸 패턴 검사
    const spamPatterns = [
      /(.)\1{10,}/, // 같은 문자 10번 이상 반복
      /https?:\/\/[^\s]{50,}/, // 너무 긴 URL
      /[A-Z]{20,}/, // 대문자 20개 이상
    ];

    if (spamPatterns.some((pattern) => pattern.test(sanitizedData.message))) {
      return NextResponse.json({ error: '스팸으로 의심되는 내용이 포함되어 있습니다.' }, { status: 400 });
    }

    // 회사 추가 요청 시 필수 필드 확인
    if (sanitizedData.type === 'company' && (!sanitizedData.companyName || !sanitizedData.blogUrl)) {
      return NextResponse.json({ error: '회사명과 블로그 URL은 필수입니다.' }, { status: 400 });
    }

    // 태그 추가 요청 시 필수 필드 확인
    if (sanitizedData.type === 'tag' && !sanitizedData.tagName) {
      return NextResponse.json({ error: '태그명은 필수입니다.' }, { status: 400 });
    }

    // 이메일 유효성 검사 (제공된 경우)
    if (sanitizedData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedData.email)) {
      return NextResponse.json({ error: '유효하지 않은 이메일 주소입니다.' }, { status: 400 });
    }

    // Supabase 클라이언트 생성
    const supabase = getSupabaseServerClient();

    // 최근 요청 수 확인 (Rate Limiting)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: recentRequests, error: countError } = await supabase
      .from('requests' as any)
      .select('id', { count: 'exact' })
      .gte('created_at', oneHourAgo);

    if (countError) {
      console.error('Rate limit check error:', countError);
    } else if (recentRequests && recentRequests.length >= 10) {
      return NextResponse.json(
        {
          error: '너무 많은 요청이 접수되었습니다. 1시간 후에 다시 시도해주세요.',
        },
        { status: 429 },
      );
    }

    // 중복 요청 방지 (같은 내용의 최근 요청 확인)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data: duplicateRequests, error: duplicateError } = await supabase
      .from('requests' as any)
      .select('id')
      .eq('message', sanitizedData.message)
      .gte('created_at', fiveMinutesAgo);

    if (duplicateError) {
      console.error('Duplicate check error:', duplicateError);
    } else if (duplicateRequests && duplicateRequests.length > 0) {
      return NextResponse.json(
        {
          error: '같은 내용의 요청이 최근에 접수되었습니다. 잠시 후에 다시 시도해주세요.',
        },
        { status: 429 },
      );
    }

    // 요청 데이터 저장
    const { data, error } = await supabase.from('requests' as any).insert({
      type: sanitizedData.type,
      company_name: sanitizedData.companyName || null,
      tag_name: sanitizedData.tagName || null,
      blog_url: sanitizedData.blogUrl || null,
      message: sanitizedData.message,
      email: sanitizedData.email || null,
      status: 'pending',
    } as any);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: '요청 저장에 실패했습니다.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: '요청이 성공적으로 접수되었습니다.',
    });
  } catch (error) {
    console.error('Request error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
