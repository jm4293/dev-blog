'use client';

import type { ReactNode } from 'react';
import { Pagination } from '@/components/pagination';
import { useSearchFilters } from '../hooks';
import { isDefaultFilters, usePosts } from '../hooks/use-posts';
import type { GetPostsResponse } from '../services/fetch-posts';
import { PostList } from './post-list';
import { SearchContainer } from './search-container';

interface PostsContainerProps {
  /** 정적 페이지가 빌드 시 내려준 기본 목록 (1페이지, 필터 없음) */
  initialData: GetPostsResponse;
  /** 서버에서 렌더링된 인기 글 섹션 (필터 사용 중에는 숨김) */
  trendingSlot?: ReactNode;
}

export function PostsContainer({ initialData, trendingSlot }: PostsContainerProps) {
  const filters = useSearchFilters();
  const currentFilters = {
    page: filters.currentPage,
    search: filters.searchQuery,
    tags: filters.tagsParam,
    blogs: filters.blogsParam,
    sort: filters.sortParam,
  };

  const { data, isFetching, isError, refetch } = usePosts(currentFilters, initialData);

  const hasFilters = filters.searchQuery !== '' || filters.tagsParam.length > 0 || filters.blogsParam.length > 0;
  const showTrending = trendingSlot != null && isDefaultFilters(currentFilters);
  const isLoading = isFetching || filters.isPending;

  const posts = data?.posts ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <>
      {showTrending && (
        <>
          {trendingSlot}
          <h2 className="mb-4 text-lg font-bold text-foreground md:text-xl">전체 글</h2>
        </>
      )}

      <SearchContainer filters={filters} />

      {isError && posts.length === 0 ? (
        // 조회 실패를 "결과 없음"으로 위장하지 않는다 — 사용자가 재시도할 수 있어야 함
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground">게시글을 불러오지 못했습니다</p>
            <p className="mt-2 text-muted-foreground">일시적인 오류일 수 있습니다. 잠시 후 다시 시도해주세요.</p>
            <button
              onClick={() => refetch()}
              className="mt-4 rounded-lg bg-foreground px-4 py-2 font-semibold text-background transition-opacity hover:opacity-90"
            >
              다시 시도
            </button>
          </div>
        </div>
      ) : posts.length === 0 && !isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground">게시글이 없습니다</p>
            <p className="mt-2 text-muted-foreground">
              {hasFilters ? '검색 조건을 변경해주세요' : '새로운 게시글이 곧 추가될 예정입니다'}
            </p>
            {hasFilters && (
              <button
                onClick={filters.handleReset}
                className="mt-4 rounded-lg bg-foreground px-4 py-2 font-semibold text-background transition-opacity hover:opacity-90"
              >
                필터 초기화
              </button>
            )}
          </div>
        </div>
      ) : (
        // 재조회 중에는 keepPreviousData로 유지된 이전 목록을 가리지 않고
        // 살짝 흐리게만 처리한다 (전체 화면 블로킹 금지 — 사용자는 계속 읽을 수 있어야 함)
        <div
          aria-busy={isLoading}
          className={`transition-opacity duration-200 ${isLoading ? 'pointer-events-none opacity-60' : ''}`}
        >
          <PostList posts={posts} />
          {totalPages > 0 && (
            <Pagination
              currentPage={filters.currentPage}
              totalPages={totalPages}
              totalCount={data?.total ?? 0}
              baseUrl="/posts"
              onPageChange={filters.handlePageChange}
            />
          )}
        </div>
      )}
    </>
  );
}
