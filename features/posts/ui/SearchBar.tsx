'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, Building2, Tag } from 'lucide-react';
import { CompanyFilter, SortButton, TagFilter } from '@/components/search';
import { useCompanies, useTags } from '../hooks';
import { CompanyLogoImage } from '@/components/image';

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL 파라미터에서 현재 상태 추출
  const searchQuery = searchParams.get('search') || '';
  const tagsParam = searchParams.get('tags') || '';
  const companiesParam = searchParams.get('companies') || '';
  const sortParam = (searchParams.get('sort') || 'newest') as 'newest' | 'oldest';

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCompanyNames, setSelectedCompanyNames] = useState<string[]>([]);

  // useQuery를 통한 캐싱된 데이터 조회
  const { data: allCompaniesData, isLoading: isLoadingAllCompanies } = useCompanies();
  const { data: popularTagsData, isLoading: isLoadingPopularTags } = useTags({ featured: true });
  const { data: popularCompaniesData } = useCompanies({ featured: true });
  const { data: allTagsData, isLoading: isLoadingAllTags } = useTags({ sort: 'name' });

  const allCompanies = allCompaniesData?.companies || [];
  const popularTags = (popularTagsData?.tags || []).map((tag) => tag.name);
  const popularCompanies = popularCompaniesData?.companies || [];
  const allTags = allTagsData?.tags || [];
  const isLoadingCompanies = isLoadingAllCompanies;
  const isLoadingTags = isLoadingPopularTags || isLoadingAllTags;

  // URL 파라미터가 변경되면 내부 상태 동기화
  useEffect(() => {
    const tagsArray = tagsParam ? tagsParam.split(',').filter((tag) => tag.trim()) : [];
    setSelectedTags(tagsArray);
    const companiesArray = companiesParam ? companiesParam.split(',').filter((name) => name.trim()) : [];
    setSelectedCompanyNames(companiesArray);
  }, [tagsParam, companiesParam]);

  const [showTagModal, setShowTagModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);

  // URL 업데이트 함수
  const updateUrl = useCallback(
    (page: number, search: string, tags: string[], companies: string[], sort: 'newest' | 'oldest') => {
      const params = new URLSearchParams();
      if (page > 1) params.set('page', page.toString());
      if (search) params.set('search', search);
      if (tags.length > 0) params.set('tags', tags.join(','));
      if (companies.length > 0) params.set('companies', companies.join(','));
      if (sort !== 'newest') params.set('sort', sort);

      const newUrl = params.toString() ? `/?${params.toString()}` : '/';
      router.push(newUrl);
    },
    [router],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateUrl(1, value, selectedTags, selectedCompanyNames, sortParam);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => {
      const newTags = prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag];
      updateUrl(1, searchQuery, newTags, selectedCompanyNames, sortParam);
      return newTags;
    });
  };

  const handleTagRemove = (tag: string) => {
    handleTagToggle(tag);
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

  const handleCompanyRemove = (companyName: string) => {
    handleCompanyToggle(companyName);
  };

  const handleSortChange = (sort: 'newest' | 'oldest') => {
    updateUrl(1, searchQuery, selectedTags, selectedCompanyNames, sort);
  };

  return (
    <div className="mb-8">
      <div className="hidden md:flex gap-4">
        <SortButton currentSort={sortParam} onSortChange={handleSortChange} />
        <input
          type="text"
          placeholder="게시글 검색..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => setShowCompanyModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors whitespace-nowrap"
        >
          <Building2 className="w-5 h-5" />
          기업 필터
        </button>
        <button
          onClick={() => setShowTagModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors whitespace-nowrap"
        >
          <Tag className="w-5 h-5" />
          태그 필터
        </button>
      </div>

      <div className="md:hidden space-y-3">
        <div className="flex gap-3">
          <SortButton currentSort={sortParam} onSortChange={handleSortChange} />
          <input
            type="text"
            placeholder="게시글 검색..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCompanyModal(true)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors"
          >
            <Building2 className="w-5 h-5" />
            기업 필터
          </button>
          <button
            onClick={() => setShowTagModal(true)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors"
          >
            <Tag className="w-5 h-5" />
            태그 필터
          </button>
        </div>
      </div>

      {/* Popular Companies */}
      {popularCompanies.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">인기 기업</p>
          <div className="flex flex-wrap gap-2">
            {isLoadingCompanies ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">로딩 중...</p>
            ) : (
              popularCompanies.map((company) => (
                <button
                  key={company.id}
                  onClick={() => handleCompanyToggle(company.name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                    selectedCompanyNames.includes(company.name)
                      ? 'bg-blue-600 text-white dark:bg-blue-500'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title={company.name}
                >
                  <CompanyLogoImage
                    logoUrl={company.logo_url}
                    companyName={company.name}
                    width={20}
                    height={20}
                    className="w-5 h-5 object-contain"
                  />
                  <span className="text-xs sm:text-sm">{company.name}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Popular Tags */}
      {popularTags.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">인기 태그</p>
          <div className="flex flex-wrap gap-2">
            {isLoadingTags ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">로딩 중...</p>
            ) : (
              popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-600 text-white dark:bg-blue-500'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {tag}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Selected Companies & Tags */}
      {(selectedCompanyNames.length > 0 || selectedTags.length > 0 || searchQuery) && (
        <div className="flex items-center justify-between px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">필터링된 결과</p>
            {searchQuery && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                검색: <span className="font-medium text-blue-600 dark:text-blue-400">{searchQuery}</span>
              </p>
            )}
            {(selectedCompanyNames.length > 0 || selectedTags.length > 0) && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                기업 {selectedCompanyNames.length}개, 태그 {selectedTags.length}개 선택됨
              </p>
            )}
          </div>
          <button
            onClick={() => {
              updateUrl(1, '', [], [], 'newest');
            }}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors whitespace-nowrap ml-4"
          >
            초기화
          </button>
        </div>
      )}

      <div className="space-y-2">
        {selectedCompanyNames.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              선택된 기업 ({selectedCompanyNames.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {[...selectedCompanyNames].sort().map((companyName) => (
                <span
                  key={companyName}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                >
                  {companyName}
                  <button
                    onClick={() => handleCompanyRemove(companyName)}
                    className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
                    aria-label={`Remove ${companyName} company`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {selectedTags.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              선택된 태그 ({selectedTags.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {[...selectedTags].sort().map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                >
                  {tag}
                  <button
                    onClick={() => handleTagRemove(tag)}
                    className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
                    aria-label={`Remove ${tag} tag`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Company Filter Modal */}
      <CompanyFilter
        companies={allCompanies}
        selectedCompanyNames={selectedCompanyNames}
        onCompanyToggle={handleCompanyToggle}
        isOpen={showCompanyModal}
        onClose={() => setShowCompanyModal(false)}
        isLoading={isLoadingCompanies}
      />

      {/* Tag Filter Modal */}
      <TagFilter
        tags={allTags}
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
        isOpen={showTagModal}
        onClose={() => setShowTagModal(false)}
        isLoading={isLoadingTags}
      />
    </div>
  );
}
