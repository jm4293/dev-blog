'use client';

import { useBookmarksList } from '../hooks';

/** 즐겨찾기 총 개수 배지 — 목록과 같은 쿼리 캐시를 공유하므로 추가 조회 없음 */
export function BookmarkCount() {
  const { data } = useBookmarksList();
  const count = data?.bookmarks.length ?? 0;

  if (count === 0) {
    return null;
  }

  return <span className="ml-2 align-middle text-base font-medium text-muted-foreground md:text-lg">{count}개</span>;
}
