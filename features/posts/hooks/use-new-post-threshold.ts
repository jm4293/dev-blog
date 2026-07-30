'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';

/** 마지막 방문 시각 (localStorage — 세션이 끝난 뒤에도 유지) */
const LAST_VISIT_KEY = 'last-visited-at';

/** 이번 세션의 NEW 기준 시각 (sessionStorage — 탐색 중에 기준이 움직이지 않도록 고정) */
const SESSION_THRESHOLD_KEY = 'new-post-threshold';

/** 기준 시각을 읽고 방문 시각을 갱신한다 (클라이언트 전용, 쿼리 함수에서 호출) */
function readThreshold(): string {
  try {
    let stored = sessionStorage.getItem(SESSION_THRESHOLD_KEY);

    if (stored === null) {
      stored = localStorage.getItem(LAST_VISIT_KEY) ?? '';
      sessionStorage.setItem(SESSION_THRESHOLD_KEY, stored);
    }

    localStorage.setItem(LAST_VISIT_KEY, new Date().toISOString());
    return stored;
  } catch {
    // 사생활 보호 모드 등 storage 접근 불가 — NEW 표시만 생략
    return '';
  }
}

/**
 * "지난 방문 이후 새 글" 판정 기준 시각
 *
 * 세션 첫 진입 시 이전 방문 시각을 기준으로 고정하고, 방문 시각은 계속 갱신한다.
 * 브라우저를 닫았다가 다시 오면 그 사이에 발행된 글에 NEW 뱃지가 붙는다.
 * 첫 방문(기준 없음)이나 storage 접근 불가 시에는 null — NEW 표시 생략.
 * (마운트 후 계산되므로 하이드레이션 불일치 없음 — 뱃지는 마운트 직후 나타남)
 */
export function useNewPostThreshold(): Date | null {
  const { data } = useQuery({
    queryKey: queryKeys.posts.newThreshold(),
    queryFn: readThreshold,
    staleTime: Infinity,
  });

  if (!data) {
    return null;
  }

  const parsed = new Date(data);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
