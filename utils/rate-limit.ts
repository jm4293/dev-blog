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

  // config 정규화
  const limit =
    config && 'MAX_REQUESTS' in config
      ? config.MAX_REQUESTS
      : (config?.['limit'] ?? RATE_LIMIT_CONFIG.PUBLIC.MAX_REQUESTS);
  const window = config && 'WINDOW' in config ? config.WINDOW : (config?.['window'] ?? RATE_LIMIT_CONFIG.PUBLIC.WINDOW);

  // 설정(limit/window)별로 카운터를 분리한다 — IP만 키로 쓰면
  // PUBLIC(100/h)과 AUTHENTICATED(1000/h)가 같은 레코드를 공유해 서로의 한도를 오염시킨다
  const key = `${limit}:${window}:${ip}`;

  // 장수 인스턴스에서 만료 레코드가 무한 누적되지 않도록 확률적으로 정리
  // (별도 타이머 없이 요청 경로에서 1% 확률 + 상한 초과 시 즉시)
  if (rateLimitStore.size > 10_000 || Math.random() < 0.01) {
    cleanupExpiredRecords();
  }

  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    // 새로운 기간 시작
    rateLimitStore.set(key, { count: 1, resetTime: now + window });
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
 * 요청 헤더에서 클라이언트 IP 추출 (Server Action의 headers()용)
 *
 * x-vercel-forwarded-for는 Vercel 플랫폼이 덮어쓰므로 클라이언트가 위조할 수 없다.
 * x-forwarded-for만 신뢰하면 헤더 위조로 rate limit을 우회할 수 있어 우선순위를 둔다.
 */
export function extractIPFromHeaders(headersList: Headers): string {
  const vercelForwarded = headersList.get('x-vercel-forwarded-for');
  if (vercelForwarded) {
    return vercelForwarded.split(',')[0].trim();
  }

  const realIP = headersList.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  const forwardedFor = headersList.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  return 'unknown';
}

/**
 * IP 주소 추출
 * @param request - NextRequest 또는 일반 Request 객체
 * @returns IP 주소
 */
export function extractIP(request: Request): string {
  return extractIPFromHeaders(request.headers);
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
