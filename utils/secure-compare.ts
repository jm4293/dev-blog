import { timingSafeEqual } from 'crypto';

/**
 * 타이밍 공격에 안전한 시크릿 비교 (Node.js 서버 전용 — 배럴 미포함, 직접 경로로 import)
 *
 * `===` 문자열 비교는 일치하는 접두사 길이에 따라 소요 시간이 달라져
 * 타이밍 부채널로 시크릿을 유추할 여지가 있다. 상수 시간 비교로 차단한다.
 */
export function secureCompare(a: string | null | undefined, b: string | null | undefined): boolean {
  if (!a || !b) return false;

  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);

  if (bufferA.length !== bufferB.length) return false;

  return timingSafeEqual(bufferA, bufferB);
}
