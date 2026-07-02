'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { buildQueryParams } from '@/utils';

/**
 * 검색/필터 상태 훅 — URL 쿼리스트링이 단일 소스
 * (/posts는 정적 페이지라 서버가 필터를 읽지 않으며, URL 변경 시 클라이언트 쿼리가 다시 조회한다)
 */
export function useSearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // URL에서 현재 필터 파싱
  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
  const searchQuery = searchParams.get('search') || '';
  const tagsParam = useMemo(() => searchParams.get('tags')?.split(',').filter(Boolean) || [], [searchParams]);
  const blogsParam = useMemo(() => searchParams.get('blogs')?.split(',').filter(Boolean) || [], [searchParams]);
  const sortParam = (searchParams.get('sort') as 'newest' | 'oldest') || 'newest';

  // 로컬 UI 상태 (검색 입력, 모달 내 선택)
  const [inputValue, setInputValue] = useState(searchQuery);
  const [selectedTags, setSelectedTags] = useState<string[]>(() => tagsParam);
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>(() => blogsParam);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);

  // URL 변경(뒤로가기 등) 시 로컬 상태 동기화 — 렌더 중 상태 조정 패턴
  const paramsKey = `${searchQuery}|${tagsParam.join(',')}|${blogsParam.join(',')}`;
  const [prevParamsKey, setPrevParamsKey] = useState(paramsKey);
  if (prevParamsKey !== paramsKey) {
    setPrevParamsKey(paramsKey);
    setInputValue(searchQuery);
    setSelectedTags(tagsParam);
    setSelectedBlogs(blogsParam);
  }

  // 최신 값을 읽기 위한 ref (stale closure 방지)
  const selectedTagsRef = useRef(selectedTags);
  const selectedBlogsRef = useRef(selectedBlogs);
  const sortParamRef = useRef(sortParam);

  useEffect(() => {
    selectedTagsRef.current = selectedTags;
    selectedBlogsRef.current = selectedBlogs;
    sortParamRef.current = sortParam;
  }, [selectedTags, selectedBlogs, sortParam]);

  // URL 업데이트 함수
  const updateUrl = useCallback(
    (page: number, search: string, tags: string[], blogs: string[], sort: 'newest' | 'oldest') => {
      const params = buildQueryParams({
        page: page > 1 ? page : undefined,
        search,
        tags: tags.length > 0 ? tags.join(',') : undefined,
        blogs: blogs.length > 0 ? blogs.join(',') : undefined,
        sort: sort !== 'newest' ? sort : undefined,
      });

      const newUrl = params.toString() ? `/posts?${params.toString()}` : '/posts';
      startTransition(() => {
        router.push(newUrl, { scroll: false });
      });
    },
    [router, startTransition],
  );

  // 핸들러
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const handleSearchSubmit = useCallback(() => {
    updateUrl(1, inputValue, selectedTagsRef.current, selectedBlogsRef.current, sortParamRef.current);
  }, [updateUrl, inputValue]);

  const handleTagsApply = useCallback(
    (tags: string[]) => {
      setSelectedTags(tags);
      updateUrl(1, searchQuery, tags, selectedBlogs, sortParam);
    },
    [updateUrl, searchQuery, selectedBlogs, sortParam],
  );

  const handleBlogsApply = useCallback(
    (blogs: string[]) => {
      setSelectedBlogs(blogs);
      updateUrl(1, searchQuery, selectedTags, blogs, sortParam);
    },
    [updateUrl, searchQuery, selectedTags, sortParam],
  );

  const handleTagToggle = useCallback(
    (tag: string) => {
      handleTagsApply(selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag]);
    },
    [handleTagsApply, selectedTags],
  );

  const handleBlogToggle = useCallback(
    (blogName: string) => {
      handleBlogsApply(
        selectedBlogs.includes(blogName)
          ? selectedBlogs.filter((name) => name !== blogName)
          : [...selectedBlogs, blogName],
      );
    },
    [handleBlogsApply, selectedBlogs],
  );

  const handleSortChange = useCallback(
    (sort: 'newest' | 'oldest') => {
      updateUrl(1, searchQuery, selectedTags, selectedBlogs, sort);
    },
    [updateUrl, searchQuery, selectedTags, selectedBlogs],
  );

  const handleReset = useCallback(() => {
    setInputValue('');
    setSelectedTags([]);
    setSelectedBlogs([]);
    updateUrl(1, '', [], [], 'newest');
  }, [updateUrl]);

  const handlePageChange = useCallback(
    (page: number) => {
      updateUrl(page, searchQuery, selectedTags, selectedBlogs, sortParam);
    },
    [updateUrl, searchQuery, selectedTags, selectedBlogs, sortParam],
  );

  return {
    // 상태
    currentPage,
    inputValue,
    searchQuery,
    tagsParam,
    blogsParam,
    selectedTags,
    selectedBlogs,
    sortParam,
    showTagModal,
    showBlogModal,
    isPending,

    // 액션
    setShowTagModal,
    setShowBlogModal,
    handleSearchChange,
    handleSearchSubmit,
    handleTagToggle,
    handleBlogToggle,
    handleTagsApply,
    handleBlogsApply,
    handleSortChange,
    handleReset,
    handlePageChange,
  };
}
