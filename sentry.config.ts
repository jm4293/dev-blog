import * as Sentry from '@sentry/nextjs';

/**
 * Sentry 설정
 * - 프로덕션 환경에서만 활성화
 * - 개발 모드에서는 비활성화
 */
export function initSentry() {
  // 개발 모드에서는 Sentry 비활성화
  if (process.env.NODE_ENV === 'development') {
    return;
  }

  // 프로덕션에서만 Sentry 초기화
  if (!process.env.SENTRY_DSN) {
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'production',
    tracesSampleRate: 1.0,
    debug: false,
  });
}

/**
 * 에러를 Sentry에 보고
 * @param error 에러 객체
 * @param context 추가 컨텍스트 정보
 */
export function captureException(error: Error | unknown, context?: Record<string, any>) {
  // 개발 모드에서는 콘솔에만 출력
  if (process.env.NODE_ENV === 'development') {
    if (context) {
    }
    return;
  }

  // 프로덕션에서는 Sentry로 전송
  Sentry.captureException(error, {
    contexts: context ? { custom: context } : undefined,
  });
}

/**
 * 메시지를 Sentry에 보고
 * @param message 메시지
 * @param level 로그 레벨
 * @param context 추가 컨텍스트 정보
 */
export function captureMessage(
  message: string,
  level: 'fatal' | 'error' | 'warning' | 'info' = 'error',
  context?: Record<string, any>,
) {
  // 개발 모드에서는 콘솔에만 출력
  if (process.env.NODE_ENV === 'development') {
    return;
  }

  // 프로덕션에서는 Sentry로 전송
  Sentry.captureMessage(message, level);
}
