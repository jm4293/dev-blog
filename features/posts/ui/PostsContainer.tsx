'use client';

import { useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PostList, SearchBar } from '@/features/posts';
import { Pagination } from '@/components/pagination/Pagination';
import { usePosts } from '../hooks';

const LoadingSpinner = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: 8 }).map((_, i) => (
      <div
        key={i}
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gray-300 dark:bg-gray-600" />
          <div className="flex-1">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-2" />
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16" />
          </div>
        </div>
        <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4" />
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded" />
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6" />
        </div>
        <div className="flex gap-2 mb-4">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-16" />
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-16" />
        </div>
      </div>
    ))}
  </div>
);

interface NoPostsProps {
  searchQuery: string;
  selectedTagsLength: number;
}

const NoPostsMessage = ({ searchQuery, selectedTagsLength }: NoPostsProps) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="text-center">
      <p className="text-lg font-semibold text-gray-900 dark:text-white">게시글이 없습니다</p>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        {searchQuery || selectedTagsLength > 0 ? '검색 조건을 변경해주세요' : '새로운 게시글이 곧 추가될 예정입니다'}
      </p>
    </div>
  </div>
);

export function PostsContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL 파라미터에서 현재 상태 추출
  // URLSearchParams는 자동으로 인코딩/디코딩를 처리하므로 수동 처리 불필요
  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const searchQuery = searchParams.get('search') || '';
  const tagsParam = searchParams.get('tags') || '';
  const companiesParam = searchParams.get('companies') || '';

  // 선택된 태그/기업 배열 (usePosts 훅에서는 문자열로 사용)
  const selectedTags = useMemo(() => (tagsParam ? tagsParam.split(',').filter((tag) => tag.trim()) : []), [tagsParam]);
  const selectedCompanyNames = useMemo(
    () => (companiesParam ? companiesParam.split(',').filter((name) => name.trim()) : []),
    [companiesParam],
  );

  // 실제 API에서 데이터 페칭 (태그는 문자열로 전달)
  const { data, isLoading, error } = usePosts({
    page: currentPage,
    search: searchQuery,
    tagsString: tagsParam,
    companiesString: companiesParam,
  });

  const posts = data?.posts || [];
  const totalPages = data?.totalPages || 0;

  // URL 업데이트 함수 (useCallback으로 메모이제이션)
  const updateUrl = useCallback(
    (page: number, search: string, tags: string[], companies: string[]) => {
      const params = new URLSearchParams();
      if (page > 1) params.set('page', page.toString());
      // URLSearchParams가 자동으로 인코딩하므로 추가 인코딩 불필요
      if (search) params.set('search', search);
      if (tags.length > 0) params.set('tags', tags.join(','));
      if (companies.length > 0) params.set('companies', companies.join(','));

      const newUrl = params.toString() ? `/?${params.toString()}` : '/';
      router.push(newUrl);
    },
    [router],
  );

  // 검색어 변경 시 URL 업데이트
  const handleSearchChange = useCallback(
    (query: string) => {
      updateUrl(1, query, selectedTags, selectedCompanyNames);
    },
    [updateUrl, selectedTags, selectedCompanyNames],
  );

  // 태그 변경 시 URL 업데이트 (페이지 리셋)
  const handleTagsChange = useCallback(
    (tags: string[]) => {
      updateUrl(1, searchQuery, tags, selectedCompanyNames);
    },
    [updateUrl, searchQuery, selectedCompanyNames],
  );

  // 기업 변경 시 URL 업데이트 (페이지 리셋)
  const handleCompaniesChange = useCallback(
    (companies: string[]) => {
      updateUrl(1, searchQuery, selectedTags, companies);
    },
    [updateUrl, searchQuery, selectedTags, selectedCompanyNames],
  );

  // 페이지 변경 시 URL 업데이트
  const handlePageChange = useCallback(
    (page: number) => {
      updateUrl(page, searchQuery, selectedTags, selectedCompanyNames);
    },
    [updateUrl, searchQuery, selectedTags, selectedCompanyNames],
  );

  return (
    <>
      <SearchBar
        onSearchChange={handleSearchChange}
        onTagsChange={handleTagsChange}
        onCompaniesChange={handleCompaniesChange}
        initialSearch={searchQuery}
        initialTagsString={tagsParam}
        initialCompaniesString={companiesParam}
      />

      {isLoading && <LoadingSpinner />}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
          <p className="text-red-800 dark:text-red-200">
            오류가 발생했습니다: {error instanceof Error ? error.message : '알 수 없는 오류'}
          </p>
        </div>
      )}

      {!isLoading && !error && posts.length === 0 && (
        <NoPostsMessage searchQuery={searchQuery} selectedTagsLength={selectedTags.length} />
      )}

      {!isLoading && posts.length > 0 && <PostList posts={posts} />}

      {!isLoading && posts.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={data?.total}
          baseUrl="/"
          onPageChange={handlePageChange}
          searchQuery={searchQuery}
          tagsString={tagsParam}
        />
      )}
    </>
  );
}
