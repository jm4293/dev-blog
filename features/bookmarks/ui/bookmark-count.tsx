import { use } from 'react';
import { BookmarksResponse } from '../services';

interface BookmarkCountProps {
  data: Promise<BookmarksResponse>;
}

/** 즐겨찾기 총 개수 배지 — 목록과 같은 promise를 공유하므로 추가 조회 없음 */
export function BookmarkCount({ data }: BookmarkCountProps) {
  const { bookmarks } = use(data);

  if (bookmarks.length === 0) {
    return null;
  }

  return (
    <span className="ml-2 align-middle text-base font-medium text-muted-foreground md:text-lg">
      {bookmarks.length}개
    </span>
  );
}
