'use client';

import { PostList } from './PostList';
import { SearchBar } from './SearchBar';
import { useSearchFilters, useLoginStatusHandler } from '../hooks';
import { Pagination } from '@/components/pagination';
import { PageLoadingSpinner } from '@/components/skeleton';
import { GetPostsResponse } from '../types';

interface InitialFilters {
  page: number;
  search: string;
  tags: string[];
  blogs: string[];
  sort: 'newest' | 'oldest';
}

interface PostsContainerProps {
  isLoggedIn: boolean;
  initialData: GetPostsResponse;
  initialFilters: InitialFilters;
  loginStatus?: string;
  errorStatus?: string;
}

export function PostsContainer({
  isLoggedIn,
  initialData,
  initialFilters,
  loginStatus,
  errorStatus,
}: PostsContainerProps) {
  useLoginStatusHandler({ loginStatus, errorStatus });

  const posts = initialData.posts;
  const totalPages = initialData.totalPages;
  const filters = useSearchFilters(initialFilters);
  const hasFilters =
    filters.debouncedSearchQuery !== '' || filters.selectedTags.length > 0 || filters.selectedCompanyNames.length > 0;

  if (posts.length === 0) {
    return (
      <>
        <SearchBar filters={filters} />

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
      <SearchBar filters={filters} />
      <PostList posts={posts} isLoggedIn={isLoggedIn} />
      <Pagination
        currentPage={filters.currentPage}
        totalPages={totalPages}
        totalCount={initialData.total}
        baseUrl="/"
        onPageChange={filters.handlePageChange}
      />
      {filters.isPending && <PageLoadingSpinner overlay />}
    </>
  );
}
