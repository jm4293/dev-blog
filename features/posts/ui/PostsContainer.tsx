'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PostList, SearchBar } from '@/features/posts';
import { useSearchFilters } from '../hooks';
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
