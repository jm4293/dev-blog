/**
 * 오픈 리다이렉트 방지용 내부 경로 검증 (엣지/클라이언트 안전)
 *
 * `//evil.com`, `/\evil.com` 형태는 브라우저가 외부 URL로 해석하므로 차단하고,
 * 슬래시로 시작하는 순수 내부 경로만 허용한다.
 */
export function isSafeRedirectPath(path: string | null | undefined): path is string {
  if (!path) return false;
  return path.startsWith('/') && !path.startsWith('//') && !path.startsWith('/\\');
}
