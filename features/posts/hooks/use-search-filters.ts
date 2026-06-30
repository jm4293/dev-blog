'use client';

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { buildQueryParams } from '@/utils';

interface InitialFilters {
  page: number;
  search: string;
  tags: string[];
  blogs: string[];
  sort: 'newest' | 'oldest';
}

export function useSearchFilters(initialFilters?: InitialFilters) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // 서버에서 전달받은 초기 필터 값 사용
  const currentPage = initialFilters?.page || 1;
  const searchQuery = initialFilters?.search || '';
  const tagsParam = initialFilters?.tags || [];
  const blogsParam = initialFilters?.blogs || [];
  const sortParam = initialFilters?.sort || 'newest';

  // 초기값을 initialFilters에서 직접 사용
  const [inputValue, setInputValue] = useState(searchQuery);
  const [selectedTags, setSelectedTags] = useState<string[]>(() => tagsParam);
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>(() => blogsParam);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);

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
        router.push(newUrl);
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
