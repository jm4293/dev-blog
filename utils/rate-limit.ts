/**
 * Rate Limiting 유틸리티
 * 메모리 기반 IP 주소 Rate Limiting
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// Rate Limiting 저장소 (메모리 기반)
const rateLimitStore = new Map<string, RateLimitRecord>();

// 기본 설정
export const RATE_LIMIT_CONFIG = {
  // 공개 API (게시글 조회)
  PUBLIC: {
    WINDOW: 60 * 60 * 1000, // 1시간 (ms)
    MAX_REQUESTS: 100,
  },

  // 인증 필요 API (즐겨찾기, 북마크)
  AUTHENTICATED: {
    WINDOW: 60 * 60 * 1000, // 1시간 (ms)
    MAX_REQUESTS: 1000,
  },

  // 로그인 시도
  LOGIN: {
    WINDOW: 15 * 60 * 1000, // 15분 (ms)
    MAX_REQUESTS: 5,
  },

  // 블로그 요청 폼
  REQUEST_FORM: {
    WINDOW: 60 * 60 * 1000, // 1시간 (ms)
    MAX_REQUESTS: 5,
  },
} as const;

/**
 * Rate Limit 확인 및 카운트 증가
 * @param ip - 클라이언트 IP 주소
 * @param config - 설정 (MAX_REQUESTS, WINDOW) 또는 (limit, window)
 * @returns 요청 허용 여부
 */
export function checkRateLimit(
  ip: string,
  config?: { readonly WINDOW: number; readonly MAX_REQUESTS: number } | { limit: number; window: number },
): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  // config 정규화
  const limit =
    config && 'MAX_REQUESTS' in config
      ? config.MAX_REQUESTS
      : (config?.['limit'] ?? RATE_LIMIT_CONFIG.PUBLIC.MAX_REQUESTS);
  const window = config && 'WINDOW' in config ? config.WINDOW : (config?.['window'] ?? RATE_LIMIT_CONFIG.PUBLIC.WINDOW);

  if (!record || now > record.resetTime) {
    // 새로운 기간 시작
    rateLimitStore.set(ip, { count: 1, resetTime: now + window });
    return true;
  }

  if (record.count >= limit) {
    // 제한 초과
    return false;
  }

  // 카운트 증가
  record.count++;
  return true;
}

/**
 * IP 주소 추출
 * @param request - NextRequest 또는 일반 Request 객체
 * @returns IP 주소
 */
export function extractIP(request: Request): string {
  // NextRequest의 경우 request.ip 사용
  if ('ip' in request) {
    return (request as any).ip || 'unknown';
  }

  // 일반 Request의 경우 헤더에서 추출
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  return request.headers.get('x-real-ip') || 'unknown';
}

/**
 * Rate Limit 응답 생성
 * @param message - 에러 메시지
 * @returns NextResponse (429 Too Many Requests)
 */
export function createRateLimitResponse(message: string = 'Too many requests. Rate limit: 100 requests per hour') {
  return new Response(JSON.stringify({ error: message }), {
    status: 429,
    headers: {
      'Content-Type': 'application/json',
      'Retry-After': '3600', // 1시간 후 재시도 권장
    },
  });
}

/**
 * 오래된 레코드 정리 (선택사항)
 * 매 시간마다 한 번씩 호출하면 메모리 누수 방지
 */
export function cleanupExpiredRecords(): void {
  const now = Date.now();
  const expiredKeys: string[] = [];

  for (const [ip, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      expiredKeys.push(ip);
    }
  }

  expiredKeys.forEach((ip) => rateLimitStore.delete(ip));
}
