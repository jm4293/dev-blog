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

  if (isLoading) {
    return <GridSkeleton />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (!isLoading && !error && posts.length === 0) {
    return (
      <NoPostsMessage
        searchQuery={filters.debouncedSearchQuery}
        selectedTagsLength={filters.selectedTags.length}
        selectedCompaniesLength={filters.selectedCompanyNames.length}
      />
    );
  }

  return (
    <>
      <SearchBar />

      <PostList posts={posts} isLoggedIn={isLoggedIn} />

      <Pagination
        currentPage={filters.currentPage}
        totalPages={totalPages}
        totalCount={data?.total}
        baseUrl="/"
        onPageChange={filters.handlePageChange}
        searchQuery={filters.searchQuery}
        tagsString={filters.tagsParam}
      />
    </>
  );
}
