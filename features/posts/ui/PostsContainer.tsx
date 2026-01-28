'use client';

import { PostList, SearchBar } from '@/features/posts';
import { useSearchFilters } from '../hooks';
import { NoPostsMessage } from '../components';
import { Pagination } from '@/components/pagination';
import { GetPostsResponse } from '../types';

interface InitialFilters {
  page: number;
  search: string;
  tags: string;
  blogs: string;
  sort: 'newest' | 'oldest';
}

interface PostsContainerProps {
  isLoggedIn: boolean;
  initialData: GetPostsResponse;
  initialFilters: InitialFilters;
}

export function PostsContainer({ isLoggedIn, initialData, initialFilters }: PostsContainerProps) {
  const posts = initialData.posts;
  const totalPages = initialData.totalPages;
  const filters = useSearchFilters(initialFilters);

  const loadingOverlay = filters.isPending && (
    <div className="fixed inset-x-0 top-16 bottom-0 z-30 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="flex items-center gap-1">
        <span className="animate-pulse text-2xl font-bold text-blue-600 dark:text-blue-500 [animation-delay:-0.4s]">
          d
        </span>
        <span className="animate-pulse text-2xl font-bold text-blue-600 dark:text-blue-500 [animation-delay:-0.3s]">
          e
        </span>
        <span className="animate-pulse text-2xl font-bold text-blue-600 dark:text-blue-500 [animation-delay:-0.2s]">
          v
        </span>
        <span className="animate-pulse text-2xl font-bold text-blue-600 dark:text-blue-500 [animation-delay:-0.1s]">
          B
        </span>
        <span className="animate-pulse text-2xl font-bold text-blue-600 dark:text-blue-500">l</span>
        <span className="animate-pulse text-2xl font-bold text-blue-600 dark:text-blue-500 [animation-delay:-0.05s]">
          o
        </span>
        <span className="animate-pulse text-2xl font-bold text-blue-600 dark:text-blue-500 [animation-delay:-0.1s]">
          g
        </span>
      </div>
    </div>
  );

  if (posts.length === 0) {
    return (
      <>
        <SearchBar filters={filters} />
        <NoPostsMessage
          searchQuery={filters.debouncedSearchQuery}
          selectedTagsLength={filters.selectedTags.length}
          selectedCompaniesLength={filters.selectedCompanyNames.length}
        />
        {loadingOverlay}
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
        searchQuery={filters.searchQuery}
        tagsString={filters.tagsParam}
      />
      {loadingOverlay}
    </>
  );
}
