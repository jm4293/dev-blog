'use client';

import { useCallback, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { buildQueryParams } from '@/utils';
import { useFilterModal } from './useFilterModal';

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
  const [selectedCompanyNames, setSelectedCompanyNames] = useState<string[]>(() => blogsParam);
  const { showTagModal, showCompanyModal, setShowTagModal, setShowCompanyModal } = useFilterModal();

  // 최신 값을 읽기 위한 ref (stale closure 방지)
  const selectedTagsRef = useRef(selectedTags);
  const selectedCompanyNamesRef = useRef(selectedCompanyNames);
  const sortParamRef = useRef(sortParam);
  selectedTagsRef.current = selectedTags;
  selectedCompanyNamesRef.current = selectedCompanyNames;
  sortParamRef.current = sortParam;

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

      const newUrl = params.toString() ? `/?${params.toString()}` : '/';
      startTransition(() => {
        router.push(newUrl);
      });
    },
    [router, startTransition],
  );

  // 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSearchSubmit = () => {
    updateUrl(1, inputValue, selectedTagsRef.current, selectedCompanyNamesRef.current, sortParamRef.current);
  };

  const handleTagsApply = (tags: string[]) => {
    setSelectedTags(tags);
    updateUrl(1, searchQuery, tags, selectedCompanyNames, sortParam);
  };

  const handleCompaniesApply = (companies: string[]) => {
    setSelectedCompanyNames(companies);
    updateUrl(1, searchQuery, selectedTags, companies, sortParam);
  };

  const handleTagToggle = (tag: string) => {
    handleTagsApply(selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag]);
  };

  const handleCompanyToggle = (companyName: string) => {
    handleCompaniesApply(
      selectedCompanyNames.includes(companyName)
        ? selectedCompanyNames.filter((name) => name !== companyName)
        : [...selectedCompanyNames, companyName],
    );
  };

  const handleSortChange = (sort: 'newest' | 'oldest') => {
    updateUrl(1, searchQuery, selectedTags, selectedCompanyNames, sort);
  };

  const handleReset = () => {
    setInputValue('');
    setSelectedTags([]);
    setSelectedCompanyNames([]);
    updateUrl(1, '', [], [], 'newest');
  };

  const handlePageChange = (page: number) => {
    updateUrl(page, searchQuery, selectedTags, selectedCompanyNames, sortParam);
  };

  return {
    // 상태
    currentPage,
    inputValue,
    searchQuery,
    tagsParam,
    blogsParam,
    selectedTags,
    selectedCompanyNames,
    sortParam,
    showTagModal,
    showCompanyModal,
    isPending,

    // 액션
    setShowTagModal,
    setShowCompanyModal,
    handleSearchChange,
    handleSearchSubmit,
    handleTagToggle,
    handleCompanyToggle,
    handleTagsApply,
    handleCompaniesApply,
    handleSortChange,
    handleReset,
    handlePageChange,
  };
}
