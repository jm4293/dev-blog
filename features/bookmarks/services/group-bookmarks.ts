import type { BookmarkWithPost } from './fetch-bookmarks';

export interface BookmarkGroup {
  label: string;
  bookmarks: BookmarkWithPost[];
}

/** 저장일(created_at) 기준 월별 그룹화 — 입력이 최신순이므로 그룹도 최신 월부터 */
export function groupBookmarksByMonth(bookmarks: BookmarkWithPost[]): BookmarkGroup[] {
  const grouped = new Map<string, BookmarkWithPost[]>();

  for (const bookmark of bookmarks) {
    const date = new Date(bookmark.created_at);
    const label = `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
    const list = grouped.get(label) || [];
    list.push(bookmark);
    grouped.set(label, list);
  }

  // Map은 삽입 순서를 유지하므로 최신순 정렬이 그대로 반영된다
  return Array.from(grouped.entries()).map(([label, items]) => ({ label, bookmarks: items }));
}
