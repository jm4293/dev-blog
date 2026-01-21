'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { parseSearchParams, buildQueryParams } from '@/utils';
import { useDebounce } from '@/hooks';

export function useSearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL 파라미터에서 현재 상태 추출
  const {
    page: currentPage,
    search: searchQuery,
    tags: tagsParam,
    companies: companiesParam,
    sort: sortParam,
  } = parseSearchParams(searchParams, {
    page: { default: 1, parse: (v) => Math.max(1, parseInt(v, 10)) },
    search: { default: '' },
    tags: { default: '' },
    companies: { default: '' },
    sort: { default: 'newest' as 'newest' | 'oldest' },
  });

  const [inputValue, setInputValue] = useState(searchQuery);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCompanyNames, setSelectedCompanyNames] = useState<string[]>([]);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);

  // 디바운스된 검색어 (500ms 지연)
  const debouncedSearchQuery = useDebounce(inputValue, 500);

  // URL 파라미터가 변경되면 내부 상태 동기화
  useEffect(() => {
    const tagsArray = tagsParam ? tagsParam.split(',').filter((tag) => tag.trim()) : [];
    setSelectedTags(tagsArray);
    const companiesArray = companiesParam ? companiesParam.split(',').filter((name) => name.trim()) : [];
    setSelectedCompanyNames(companiesArray);
    setInputValue(searchQuery);
  }, [tagsParam, companiesParam, searchQuery]);

  // URL 업데이트 함수
  const updateUrl = useCallback(
    (page: number, search: string, tags: string[], companies: string[], sort: 'newest' | 'oldest') => {
      const params = buildQueryParams({
        page: page > 1 ? page : undefined,
        search,
        tags: tags.length > 0 ? tags.join(',') : undefined,
        companies: companies.length > 0 ? companies.join(',') : undefined,
        sort: sort !== 'newest' ? sort : undefined,
      });

      const newUrl = params.toString() ? `/?${params.toString()}` : '/';
      router.push(newUrl);
    },
    [router],
  );

  // 디바운스된 검색어가 변경되면 URL 업데이트
  useEffect(() => {
    updateUrl(1, debouncedSearchQuery, selectedTags, selectedCompanyNames, sortParam); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery]);

  // 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => {
      const newTags = prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag];
      updateUrl(1, searchQuery, newTags, selectedCompanyNames, sortParam);
      return newTags;
    });
  };

  const handleCompanyToggle = (companyName: string) => {
    setSelectedCompanyNames((prev) => {
      const newCompanies = prev.includes(companyName)
        ? prev.filter((name) => name !== companyName)
        : [...prev, companyName];
      updateUrl(1, searchQuery, selectedTags, newCompanies, sortParam);
      return newCompanies;
    });
  };

  const handleSortChange = (sort: 'newest' | 'oldest') => {
    updateUrl(1, searchQuery, selectedTags, selectedCompanyNames, sort);
  };

  const handleReset = () => {
    updateUrl(1, '', [], [], 'newest');
  };

  const handlePageChange = (page: number) => {
    updateUrl(page, searchQuery, selectedTags, selectedCompanyNames, sortParam);
  };

  return {
    // 상태
    currentPage,
    inputValue,
    debouncedSearchQuery,
    searchQuery,
    tagsParam,
    companiesParam,
    selectedTags,
    selectedCompanyNames,
    sortParam,
    showTagModal,
    showCompanyModal,

    // 액션
    setShowTagModal,
    setShowCompanyModal,
    handleSearchChange,
    handleTagToggle,
    handleCompanyToggle,
    handleSortChange,
    handleReset,
    handlePageChange,
  };
}
