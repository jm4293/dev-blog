'use client';

import type { ReactNode } from 'react';
import { Pagination } from '@/components/pagination';
import type { GetPostsResponse } from '../services/fetch-posts';
import { PostList } from './post-list';
import { SearchWrapper } from './search-wrapper';

interface PostsFallbackProps {
  initialData: GetPostsResponse;
  trendingSlot?: ReactNode;
}

const noop = () => undefined;

/**
 * /posts 정적 HTML용 뷰 (Suspense fallback)
 *
 * PostsContainer는 useSearchParams를 쓰기 때문에 정적 프리렌더 시
 * fallback이 초기 HTML로 담긴다. 스켈레톤 대신 실제 콘텐츠를 렌더링해서
 * SEO(크롤러가 보는 HTML)와 첫 화면 표시를 보장하고,
 * hydration이 끝나면 동일한 모습의 PostsContainer가 이 뷰를 대체한다.
 */
export function PostsFallback({ initialData, trendingSlot }: PostsFallbackProps) {
  return (
    <>
      {trendingSlot != null && (
        <>
          {trendingSlot}
          <h2 className="mb-4 text-lg font-bold text-foreground md:text-xl">전체 글</h2>
        </>
      )}

      <section className="mb-8">
        <SearchWrapper
          value=""
          onChange={noop}
          onSearch={noop}
          onBlogFilterClick={noop}
          onTagFilterClick={noop}
          currentSort="newest"
          onSortChange={noop}
        />
      </section>

      <PostList posts={initialData.posts} />

      {initialData.totalPages > 0 && (
        <Pagination
          currentPage={1}
          totalPages={initialData.totalPages}
          totalCount={initialData.total}
          baseUrl="/posts"
        />
      )}
    </>
  );
}
