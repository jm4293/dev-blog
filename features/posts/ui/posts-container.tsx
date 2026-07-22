'use client';

import type { ReactNode } from 'react';
import { Pagination } from '@/components/pagination';
import { useLoginStatusHandler, useSearchFilters } from '../hooks';
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
  useLoginStatusHandler();

  const filters = useSearchFilters();
  const currentFilters = {
    page: filters.currentPage,
    search: filters.searchQuery,
    tags: filters.tagsParam,
    blogs: filters.blogsParam,
    sort: filters.sortParam,
  };

  const { data, isFetching } = usePosts(currentFilters, initialData);

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

      {posts.length === 0 && !isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground">게시글이 없습니다</p>
            <p className="mt-2 text-muted-foreground">
              {hasFilters ? '검색 조건을 변경해주세요' : '새로운 게시글이 곧 추가될 예정입니다'}
            </p>
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
