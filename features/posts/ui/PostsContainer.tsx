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
  companies: string;
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

  if (posts.length === 0) {
    return (
      <>
        <SearchBar initialFilters={initialFilters} />
        <NoPostsMessage
          searchQuery={filters.debouncedSearchQuery}
          selectedTagsLength={filters.selectedTags.length}
          selectedCompaniesLength={filters.selectedCompanyNames.length}
        />
      </>
    );
  }

  return (
    <>
      <SearchBar initialFilters={initialFilters} />
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
    </>
  );
}
