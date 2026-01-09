'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import SearchBar from '@/components/search/SearchBar'
import PostList from '@/components/posts/PostList'
import Pagination from '@/components/posts/Pagination'
import { PostWithCompany } from '@/types/post'

interface PostsContainerProps {
  posts: PostWithCompany[]
}

const ITEMS_PER_PAGE = 9

export default function PostsContainer({ posts }: PostsContainerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // URL 파라미터에서 초기값 읽기
  useEffect(() => {
    const page = searchParams.get('page')
    const search = searchParams.get('search')
    const tags = searchParams.get('tags')

    if (page) {
      setCurrentPage(parseInt(page, 10))
    }
    if (search) {
      setSearchQuery(decodeURIComponent(search))
    }
    if (tags) {
      setSelectedTags(tags.split(',').filter((tag) => tag.trim()))
    }
  }, [searchParams])

  // 검색어 변경 시 URL 업데이트
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    updateUrl(1, query, selectedTags)
  }

  // 태그 변경 시 URL 업데이트
  const handleTagsChange = (tags: string[]) => {
    setSelectedTags(tags)
    updateUrl(1, searchQuery, tags)
  }

  // 페이지 변경 시 URL 업데이트
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    updateUrl(page, searchQuery, selectedTags)
  }

  // URL 업데이트 함수
  const updateUrl = (page: number, search: string, tags: string[]) => {
    const params = new URLSearchParams()
    if (page > 1) params.set('page', page.toString())
    if (search) params.set('search', encodeURIComponent(search))
    if (tags.length > 0) params.set('tags', tags.join(','))

    const newUrl = params.toString() ? `/?${params.toString()}` : '/'
    router.push(newUrl)
  }

  // 검색 및 필터링 로직
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // 검색어 필터링
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary?.toLowerCase().includes(searchQuery.toLowerCase())

      // 태그 필터링 (OR 조건: 선택된 태그 중 하나라도 포함하면 표시)
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => post.tags.includes(tag))

      return matchesSearch && matchesTags
    })
  }, [searchQuery, selectedTags, posts])

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE)
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <>
      {/* Search & Filter Section */}
      <SearchBar
        onSearchChange={handleSearchChange}
        onTagsChange={handleTagsChange}
      />

      {/* Posts Grid */}
      <PostList posts={paginatedPosts} />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl="/"
        onPageChange={handlePageChange}
        searchQuery={searchQuery}
        selectedTags={selectedTags}
      />
    </>
  )
}
