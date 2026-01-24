'use client';

import { PostList, SearchBar } from '@/features/posts';
import { GridSkeleton } from '@/components/skeleton';
import { usePosts, useSearchFilters } from '../hooks';
import { NoPostsMessage, ErrorMessage } from '../components';
import { Pagination } from '@/components/pagination';

interface PostsContainerProps {
  isLoggedIn: boolean;
}

export function PostsContainer({ isLoggedIn }: PostsContainerProps) {
  const filters = useSearchFilters();

  const { data, isLoading, error } = usePosts({
    page: filters.currentPage,
    search: filters.searchQuery,
    tagsString: filters.tagsParam,
    companiesString: filters.companiesParam,
    sort: filters.sortParam,
  });

  const posts = data?.posts || [];
  const totalPages = data?.totalPages || 0;

  return (
    <>
      <SearchBar />

      {isLoading && <GridSkeleton />}

      {error && <ErrorMessage error={error} />}

      {!isLoading && !error && posts.length === 0 && (
        <NoPostsMessage
          searchQuery={filters.debouncedSearchQuery}
          selectedTagsLength={filters.selectedTags.length}
          selectedCompaniesLength={filters.selectedCompanyNames.length}
        />
      )}

      {!isLoading && posts.length > 0 && <PostList posts={posts} isLoggedIn={isLoggedIn} />}

      {!isLoading && posts.length > 0 && (
        <Pagination
          currentPage={filters.currentPage}
          totalPages={totalPages}
          totalCount={data?.total}
          baseUrl="/"
          onPageChange={filters.handlePageChange}
          searchQuery={filters.searchQuery}
          tagsString={filters.tagsParam}
        />
      )}
    </>
  );
}
