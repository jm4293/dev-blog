'use client';

import { CompanyFilterModal, TagFilterModal } from '@/components/search';
import { useCompanies, useTags, useSearchFilters } from '../hooks';
import { SearchInput, PopularCompanies, PopularTags, ActiveFilters, SelectedBadges } from '../components';

export function SearchBar() {
  const filters = useSearchFilters();

  // useQuery를 통한 캐싱된 데이터 조회
  const { data: allCompaniesData, isLoading: isLoadingAllCompanies } = useCompanies();
  const { data: allTagsData, isLoading: isLoadingAllTags } = useTags({ sort: 'name' });
  const { data: popularTagsData, isLoading: isLoadingPopularTags } = useTags({ featured: true });
  const { data: popularCompaniesData } = useCompanies({ featured: true });

  const allCompanies = allCompaniesData?.companies || [];
  const allTags = allTagsData?.tags || [];
  const popularTags = (popularTagsData?.tags || []).map((tag) => tag.name);
  const popularCompanies = popularCompaniesData?.companies || [];
  const isLoadingCompanies = isLoadingAllCompanies;
  const isLoadingTags = isLoadingPopularTags || isLoadingAllTags;

  return (
    <section className="mb-8">
      {/* Search Input & Filter Buttons */}
      <SearchInput
        value={filters.inputValue}
        onChange={filters.handleSearchChange}
        onCompanyFilterClick={() => filters.setShowCompanyModal(true)}
        onTagFilterClick={() => filters.setShowTagModal(true)}
        currentSort={filters.sortParam}
        onSortChange={filters.handleSortChange}
      />

      {/* Popular Companies */}
      <PopularCompanies
        companies={popularCompanies}
        selectedCompanyNames={filters.selectedCompanyNames}
        onCompanyToggle={filters.handleCompanyToggle}
        isLoading={isLoadingCompanies}
      />

      {/* Popular Tags */}
      <PopularTags
        tags={popularTags}
        selectedTags={filters.selectedTags}
        onTagToggle={filters.handleTagToggle}
        isLoading={isLoadingTags}
      />

      {/* Active Filters Summary */}
      <ActiveFilters
        searchQuery={filters.debouncedSearchQuery}
        selectedCompanyNamesCount={filters.selectedCompanyNames.length}
        selectedTagsCount={filters.selectedTags.length}
        onReset={filters.handleReset}
      />

      {/* Selected Badges */}
      <SelectedBadges
        selectedCompanyNames={filters.selectedCompanyNames}
        selectedTags={filters.selectedTags}
        onCompanyRemove={filters.handleCompanyToggle}
        onTagRemove={filters.handleTagToggle}
      />

      {/* Company Filter Modal */}
      <CompanyFilterModal
        companies={allCompanies}
        selectedCompanyNames={filters.selectedCompanyNames}
        onCompanyToggle={filters.handleCompanyToggle}
        isOpen={filters.showCompanyModal}
        onClose={() => filters.setShowCompanyModal(false)}
        isLoading={isLoadingCompanies}
      />

      {/* Tag Filter Modal */}
      <TagFilterModal
        tags={allTags}
        selectedTags={filters.selectedTags}
        onTagToggle={filters.handleTagToggle}
        isOpen={filters.showTagModal}
        onClose={() => filters.setShowTagModal(false)}
        isLoading={isLoadingTags}
      />
    </section>
  );
}
