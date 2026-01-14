'use client';

import { useState, useEffect } from 'react';
import { X, Filter } from 'lucide-react';
import { Company } from '@/supabase/types.supabase';
import { CompanyFilter, TagFilter } from '@/components/search';

interface SearchBarProps {
  onSearchChange?: (query: string) => void;
  onTagsChange?: (tags: string[]) => void;
  onCompaniesChange?: (companies: string[]) => void;
  initialSearch?: string;
  initialTagsString?: string;
  initialCompaniesString?: string;
}

export function SearchBar({
  onSearchChange,
  onTagsChange,
  onCompaniesChange,
  initialSearch = '',
  initialTagsString = '',
  initialCompaniesString = '',
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCompanyNames, setSelectedCompanyNames] = useState<string[]>([]);
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [featuredCompanies, setFeaturedCompanies] = useState<Company[]>([]);
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [isLoadingTags, setIsLoadingTags] = useState(false);

  // URL 파라미터가 변경되면 내부 상태 동기화
  useEffect(() => {
    setSearchQuery(initialSearch);
    const tagsArray = initialTagsString ? initialTagsString.split(',').filter((tag) => tag.trim()) : [];
    setSelectedTags(tagsArray);
    const companiesArray = initialCompaniesString
      ? initialCompaniesString.split(',').filter((name) => name.trim())
      : [];
    setSelectedCompanyNames(companiesArray);
  }, [initialSearch, initialTagsString, initialCompaniesString]);

  // 모든 회사, 인기 회사, 인기 태그 조회
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingCompanies(true);
      setIsLoadingTags(true);
      try {
        const [allCompaniesRes, featuredCompaniesRes, popularTagsRes] = await Promise.all([
          fetch('/api/companies'),
          fetch('/api/companies?featured=true'),
          fetch('/api/tags?featured=true'),
        ]);
        const allCompaniesData = await allCompaniesRes.json();
        const featuredCompaniesData = await featuredCompaniesRes.json();
        const popularTagsData = await popularTagsRes.json();

        setAllCompanies(allCompaniesData.companies || []);
        setFeaturedCompanies(featuredCompaniesData.companies || []);
        setPopularTags((popularTagsData.tags || []).map((tag: any) => tag.name));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoadingCompanies(false);
        setIsLoadingTags(false);
      }
    };

    fetchData();
  }, []);

  const [showTagModal, setShowTagModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearchChange?.(value);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => {
      const newTags = prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag];
      onTagsChange?.(newTags);
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
      onCompaniesChange?.(newCompanies);
      return newCompanies;
    });
  };

  const handleCompanyRemove = (companyName: string) => {
    handleCompanyToggle(companyName);
  };

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="게시글 검색..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => setShowCompanyModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors whitespace-nowrap">
          <Filter className="w-5 h-5" />
          회사 필터
        </button>
        <button
          onClick={() => setShowTagModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors whitespace-nowrap">
          <Filter className="w-5 h-5" />
          태그 필터
        </button>
      </div>

      {/* Popular Companies */}
      {/* {featuredCompanies.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">인기 회사</p>
          <div className="flex flex-wrap gap-2">
            {isLoadingCompanies ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">로딩 중...</p>
            ) : (
              featuredCompanies.map((company) => (
                <button
                  key={company.id}
                  onClick={() => handleCompanyToggle(company.name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                    selectedCompanyNames.includes(company.name)
                      ? 'bg-blue-600 text-white dark:bg-blue-500'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title={company.name}>
                  {company.logo_url && (
                    <img src={company.logo_url} alt={company.name} className="w-5 h-5 object-contain" />
                  )}
                  <span className="text-xs sm:text-sm">{company.name}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )} */}

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
                  }`}>
                  {tag}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Selected Companies & Tags */}
      <div className="space-y-2">
        {selectedCompanyNames.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              선택된 회사 ({selectedCompanyNames.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {[...selectedCompanyNames].sort().map((companyName) => (
                <span
                  key={companyName}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                  {companyName}
                  <button
                    onClick={() => handleCompanyRemove(companyName)}
                    className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
                    aria-label={`Remove ${companyName} company`}>
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
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                  {tag}
                  <button
                    onClick={() => handleTagRemove(tag)}
                    className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
                    aria-label={`Remove ${tag} tag`}>
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
        selectedCompanyNames={selectedCompanyNames}
        onCompanyToggle={handleCompanyToggle}
        isOpen={showCompanyModal}
        onClose={() => setShowCompanyModal(false)}
      />

      {/* Tag Filter Modal */}
      <TagFilter
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
        isOpen={showTagModal}
        onClose={() => setShowTagModal(false)}
      />
    </div>
  );
}
