/**
 * URL 정규화 — 게시글 중복 판정 전용 키(canonical_url) 생성
 *
 * 같은 글이 표기만 다른 URL로 수집되는 것을 막는다:
 * - Medium 계열 피드의 ?source=rss----해시---N 트래킹 파라미터 (피드 재생성 시 값이 바뀜)
 * - 끝 슬래시 유무 (/post vs /post/), http→https, www. 유무, utm_* 파라미터, #fragment
 *
 * 원본 url은 표시/이동용으로 그대로 저장하고, 이 함수의 결과는 중복 판정에만 쓴다.
 */

const TRACKING_PARAM_NAMES = new Set(['source', 'ref', 'fbclid', 'gclid', 'igshid', 'spm']);

export function normalizeUrl(raw: string): string {
  try {
    const url = new URL(raw);
    url.protocol = 'https:';
    url.hostname = url.hostname.toLowerCase().replace(/^www\./, '');
    url.hash = '';

    for (const key of [...url.searchParams.keys()]) {
      if (key.startsWith('utm_') || TRACKING_PARAM_NAMES.has(key)) {
        url.searchParams.delete(key);
      }
    }
    url.searchParams.sort();

    let normalized = url.toString();
    if (url.pathname !== '/' && !url.search && normalized.endsWith('/')) {
      normalized = normalized.slice(0, -1);
    }
    return normalized;
  } catch {
    // URL 파싱 불가면 원본 그대로 (정확 일치 판정으로 폴백)
    return raw;
  }
}
