'use client';

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { buildQueryParams } from '@/utils';
import { useDebounce } from '@/hooks';

interface InitialFilters {
  page: number;
  search: string;
  tags: string;
  companies: string;
  sort: 'newest' | 'oldest';
}

// 초기 배열 파싱 헬퍼
const parseArrayParam = (param: string): string[] => (param ? param.split(',').filter((item) => item.trim()) : []);

export function useSearchFilters(initialFilters?: InitialFilters) {
  const router = useRouter();
  const isInitialMount = useRef(true);
  const [isPending, startTransition] = useTransition();

  // 서버에서 전달받은 초기 필터 값 사용
  const currentPage = initialFilters?.page || 1;
  const searchQuery = initialFilters?.search || '';
  const tagsParam = initialFilters?.tags || '';
  const companiesParam = initialFilters?.companies || '';
  const sortParam = initialFilters?.sort || 'newest';

  // 초기값을 initialFilters에서 직접 파싱
  const [inputValue, setInputValue] = useState(searchQuery);
  const [selectedTags, setSelectedTags] = useState<string[]>(() => parseArrayParam(tagsParam));
  const [selectedCompanyNames, setSelectedCompanyNames] = useState<string[]>(() => parseArrayParam(companiesParam));
  const [showTagModal, setShowTagModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);

  // 디바운스된 검색어 (500ms 지연)
  const debouncedSearchQuery = useDebounce(inputValue, 500);

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
      startTransition(() => {
        router.push(newUrl);
      });
    },
    [router, startTransition],
  );

  // 디바운스된 검색어가 변경되면 URL 업데이트 (초기 마운트 제외)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    updateUrl(1, debouncedSearchQuery, selectedTags, selectedCompanyNames, sortParam); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery]);

  // 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag];
    setSelectedTags(newTags);
    updateUrl(1, searchQuery, newTags, selectedCompanyNames, sortParam);
  };

  const handleCompanyToggle = (companyName: string) => {
    const newCompanies = selectedCompanyNames.includes(companyName)
      ? selectedCompanyNames.filter((name) => name !== companyName)
      : [...selectedCompanyNames, companyName];
    setSelectedCompanyNames(newCompanies);
    updateUrl(1, searchQuery, selectedTags, newCompanies, sortParam);
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
    debouncedSearchQuery,
    searchQuery,
    tagsParam,
    companiesParam,
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
    handleTagToggle,
    handleCompanyToggle,
    handleSortChange,
    handleReset,
    handlePageChange,
  };
}
