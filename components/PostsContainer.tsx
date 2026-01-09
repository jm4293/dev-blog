'use client'

import { useCallback, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import SearchBar from '@/components/search/SearchBar'
import PostList from '@/components/posts/PostList'
import Pagination from '@/components/posts/Pagination'
import { usePosts } from '@/shared/lib/hooks'

export default function PostsContainer() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // URL 파라미터에서 현재 상태 추출
  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const searchQuery = searchParams.get('search')
    ? decodeURIComponent(searchParams.get('search')!)
    : ''
  const tagsParam = searchParams.get('tags') || ''

  // 선택된 태그 배열 (usePosts 훅에서는 문자열로 사용)
  const selectedTags = useMemo(
    () => (tagsParam ? tagsParam.split(',').filter((tag) => tag.trim()) : []),
    [tagsParam]
  )

  // 실제 API에서 데이터 페칭 (태그는 문자열로 전달)
  const { posts, totalPages, isLoading, error } = usePosts({
    page: currentPage,
    search: searchQuery,
    tagsString: tagsParam,
  })

  // URL 업데이트 함수 (useCallback으로 메모이제이션)
  const updateUrl = useCallback(
    (page: number, search: string, tags: string[]) => {
      const params = new URLSearchParams()
      if (page > 1) params.set('page', page.toString())
      if (search) params.set('search', encodeURIComponent(search))
      if (tags.length > 0) params.set('tags', tags.join(','))

      const newUrl = params.toString() ? `/?${params.toString()}` : '/'
      router.push(newUrl)
    },
    [router]
  )

  // 검색어 변경 시 URL 업데이트
  const handleSearchChange = useCallback(
    (query: string) => {
      updateUrl(1, query, selectedTags)
    },
    [updateUrl, selectedTags]
  )

  // 태그 변경 시 URL 업데이트 (페이지 리셋)
  const handleTagsChange = useCallback(
    (tags: string[]) => {
      updateUrl(1, searchQuery, tags)
    },
    [updateUrl, searchQuery]
  )

  // 페이지 변경 시 URL 업데이트
  const handlePageChange = useCallback(
    (page: number) => {
      updateUrl(page, searchQuery, selectedTags)
    },
    [updateUrl, searchQuery, selectedTags]
  )

  return (
    <>
      {/* Search & Filter Section */}
      <SearchBar
        onSearchChange={handleSearchChange}
        onTagsChange={handleTagsChange}
        initialSearch={searchQuery}
        initialTagsString={tagsParam}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mb-4 inline-block">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              게시글을 불러오는 중입니다...
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
          <p className="text-red-800 dark:text-red-200">
            오류가 발생했습니다: {error}
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              게시글이 없습니다
            </p>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {searchQuery || selectedTags.length > 0
                ? '검색 조건을 변경해주세요'
                : '새로운 게시글이 곧 추가될 예정입니다'}
            </p>
          </div>
        </div>
      )}

      {/* Posts Grid */}
      {!isLoading && posts.length > 0 && <PostList posts={posts} />}

      {/* Pagination */}
      {!isLoading && posts.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl="/"
          onPageChange={handlePageChange}
          searchQuery={searchQuery}
          tagsString={tagsParam}
        />
      )}
    </>
  )
}
