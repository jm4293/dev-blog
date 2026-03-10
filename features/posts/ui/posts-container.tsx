'use client';

import { Pagination } from '@/components/pagination';
import { PageLoadingSpinner } from '@/components/skeleton';
import { PostWithCompany } from '@/supabase/types.supabase';
import { useLoginStatusHandler, useSearchFilters } from '../hooks';
import { PostList } from './post-list';
import { SearchContainer } from './search-container';

interface InitialFilters {
  page: number;
  search: string;
  tags: string[];
  blogs: string[];
  sort: 'newest' | 'oldest';
}

interface GetPostsResponse {
  posts: PostWithCompany[];
  total: number;
  page: number;
  totalPages: number;
}

interface PostsContainerProps {
  initialData: GetPostsResponse;
  initialFilters: InitialFilters;
  loginStatus?: string;
  errorStatus?: string;
}

export function PostsContainer({ initialData, initialFilters, loginStatus, errorStatus }: PostsContainerProps) {
  useLoginStatusHandler({ loginStatus, errorStatus });

  const posts = initialData.posts;
  const totalPages = initialData.totalPages;
  const filters = useSearchFilters(initialFilters);
  const hasFilters = filters.searchQuery !== '' || filters.selectedTags.length > 0 || filters.selectedBlogs.length > 0;

  if (posts.length === 0) {
    return (
      <>
        <SearchContainer filters={filters} />

        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">게시글이 없습니다</p>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {hasFilters ? '검색 조건을 변경해주세요' : '새로운 게시글이 곧 추가될 예정입니다'}
            </p>
          </div>
        </div>
        {filters.isPending && <PageLoadingSpinner overlay />}
      </>
    );
  }

  return (
    <>
      <SearchContainer filters={filters} />
      <PostList posts={posts} />
      <Pagination
        currentPage={filters.currentPage}
        totalPages={totalPages}
        totalCount={initialData.total}
        baseUrl="/posts"
        onPageChange={filters.handlePageChange}
      />
      {filters.isPending && <PageLoadingSpinner overlay />}
    </>
  );
}
