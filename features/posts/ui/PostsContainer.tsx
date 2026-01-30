'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PostList, SearchBar } from '@/features/posts';
import { useSearchFilters } from '../hooks';
import { NoPostsMessage } from '../components';
import { Pagination } from '@/components/pagination';
import { PageLoadingSpinner } from '@/components/skeleton';
import { GetPostsResponse } from '../types';
import { useToast } from '@/hooks';

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const posts = initialData.posts;
  const totalPages = initialData.totalPages;
  const filters = useSearchFilters(initialFilters);

  // 로그인 성공/실패 토스트 표시
  useEffect(() => {
    if (loginStatus === 'success') {
      showToast({
        message: '로그인 성공! devBlog.kr에 오신 것을 환영합니다.',
        type: 'success',
        duration: 3000,
      });

      // URL 쿼리 파라미터 제거 (토스트 중복 방지)
      const params = new URLSearchParams(searchParams.toString());
      params.delete('login');
      const newUrl = params.toString() ? `/posts?${params.toString()}` : '/posts';
      router.replace(newUrl, { scroll: false });
    }

    if (errorStatus === 'auth_failed') {
      showToast({
        message: '로그인에 실패했습니다. 다시 시도해주세요.',
        type: 'error',
        duration: 3000,
      });

      const params = new URLSearchParams(searchParams.toString());
      params.delete('error');
      const newUrl = params.toString() ? `/posts?${params.toString()}` : '/posts';
      router.replace(newUrl, { scroll: false });
    }
  }, [loginStatus, errorStatus, showToast, router, searchParams]);

  if (posts.length === 0) {
    return (
      <>
        <SearchBar filters={filters} />
        <NoPostsMessage
          searchQuery={filters.debouncedSearchQuery}
          selectedTagsLength={filters.selectedTags.length}
          selectedCompaniesLength={filters.selectedCompanyNames.length}
        />
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
        searchQuery={filters.searchQuery}
        tagsString={filters.tagsParam}
      />
      {filters.isPending && <PageLoadingSpinner overlay />}
    </>
  );
}
