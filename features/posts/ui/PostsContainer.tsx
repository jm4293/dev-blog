'use client';

import { useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PostList, SearchBar } from '@/features/posts';
import { Pagination } from '@/components/pagination/Pagination';
import { GridSkeleton } from '@/components/skeleton';
import { usePosts } from '../hooks';

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
  const sortParam = (searchParams.get('sort') || 'newest') as 'newest' | 'oldest';

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
    sort: sortParam,
  });

  const posts = data?.posts || [];
  const totalPages = data?.totalPages || 0;

  // 페이지 변경 시 URL 업데이트
  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams();
      if (page > 1) params.set('page', page.toString());
      if (searchQuery) params.set('search', searchQuery);
      if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));
      if (selectedCompanyNames.length > 0) params.set('companies', selectedCompanyNames.join(','));
      if (sortParam !== 'newest') params.set('sort', sortParam);

      const newUrl = params.toString() ? `/?${params.toString()}` : '/';
      router.push(newUrl);
    },
    [router, searchQuery, selectedTags, selectedCompanyNames, sortParam],
  );

  return (
    <>
      <SearchBar />

      {isLoading && <GridSkeleton />}

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
