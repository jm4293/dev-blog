import { NextResponse } from 'next/server';
import { captureException } from '@/sentry.config';

interface ErrorContext {
  method?: string;
  endpoint?: string;
  [key: string]: any;
}

/**
 * API 에러 응답 처리 (Sentry 자동 보고)
 * @param error 에러 객체
 * @param message 에러 메시지
 * @param status HTTP 상태 코드 (기본값: 500)
 * @param context 추가 컨텍스트
 * @returns NextResponse
 */
export function handleApiError(
  error: Error | unknown,
  message: string = 'Internal Server Error',
  status: number = 500,
  context?: ErrorContext,
) {
  const errorMsg = error instanceof Error ? error.message : String(error);

  // Sentry에 에러 보고
  captureException(error, {
    ...context,
    errorMessage: errorMsg,
    httpStatus: status,
  });

  return NextResponse.json(
    {
      error: message,
      details: process.env.NODE_ENV === 'development' ? errorMsg : undefined,
    },
    { status },
  );
}

/**
 * 검증 에러 응답
 * @param message 에러 메시지
 * @param details 추가 정보
 * @returns NextResponse
 */
export function handleValidationError(message: string, details?: string) {
  return NextResponse.json(
    {
      error: message,
      details,
    },
    { status: 400 },
  );
}

/**
 * 인증 필요 에러 응답
 * @param message 에러 메시지 (기본값: 'Unauthorized')
 * @returns NextResponse
 */
export function handleUnauthorized(message: string = 'Unauthorized') {
  return NextResponse.json(
    {
      error: message,
    },
    { status: 401 },
  );
}

/**
 * 권한 없음 에러 응답
 * @param message 에러 메시지 (기본값: 'Forbidden')
 * @returns NextResponse
 */
export function handleForbidden(message: string = 'Forbidden') {
  return NextResponse.json(
    {
      error: message,
    },
    { status: 403 },
  );
}

/**
 * 찾을 수 없음 에러 응답
 * @param message 에러 메시지 (기본값: 'Not Found')
 * @returns NextResponse
 */
export function handleNotFound(message: string = 'Not Found') {
  return NextResponse.json(
    {
      error: message,
    },
    { status: 404 },
  );
}

/**
 * 충돌 에러 응답 (예: 중복 데이터)
 * @param message 에러 메시지 (기본값: 'Conflict')
 * @param details 추가 정보
 * @returns NextResponse
 */
export function handleConflict(message: string = 'Conflict', details?: string) {
  return NextResponse.json(
    {
      error: message,
      details,
    },
    { status: 409 },
  );
}
