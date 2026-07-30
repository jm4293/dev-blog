/** 게시글 목록 정렬 옵션 (URL·API·훅이 공유하는 단일 타입) */
export type PostSortOption = 'newest' | 'oldest' | 'popular';

export const POST_SORT_OPTIONS: PostSortOption[] = ['newest', 'oldest', 'popular'];

export interface PostsSearchParams {
  page: number;
  search: string;
  tags: string[];
  blogs: string[];
  sort: PostSortOption;
}

/** 페이지 번호 상한 — 비정상 입력(?page=99999999)의 거대 OFFSET 스캔 방지 */
const MAX_PAGE = 10_000;

export function parsePostsSearchParams(params: Record<string, string | undefined>): PostsSearchParams {
  // Math.max(1, NaN)은 NaN이라 잘못된 page 값이 그대로 쿼리에 흘러 500이 나던 문제 방지
  const rawPage = Number.parseInt(params.page || '1', 10);
  const page = Number.isFinite(rawPage) ? Math.min(Math.max(1, rawPage), MAX_PAGE) : 1;

  return {
    page,
    search: params.search || '',
    tags: params.tags ? params.tags.split(',').filter(Boolean) : [],
    blogs: params.blogs ? params.blogs.split(',').filter(Boolean) : [],
    sort: POST_SORT_OPTIONS.includes(params.sort as PostSortOption) ? (params.sort as PostSortOption) : 'newest',
  };
}
