'use client';

import { BlogFilterModal, TagFilterModal } from '@/components/search';
import { useCompanies, useSearchFilters, useTags } from '../hooks';
import { SearchInput, PopularBlogs, PopularTags, ActiveFilters, SelectedBadges } from '../components';

interface SearchBarProps {
  filters: ReturnType<typeof useSearchFilters>;
}

export function SearchBar({ filters }: SearchBarProps) {
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
      <SearchInput
        value={filters.inputValue}
        onChange={filters.handleSearchChange}
        onSearch={filters.handleSearchSubmit}
        onCompanyFilterClick={() => filters.setShowCompanyModal(true)}
        onTagFilterClick={() => filters.setShowTagModal(true)}
        currentSort={filters.sortParam}
        onSortChange={filters.handleSortChange}
      />

      <PopularBlogs
        companies={popularCompanies}
        selectedCompanyNames={filters.selectedCompanyNames}
        onCompanyToggle={filters.handleCompanyToggle}
        isLoading={isLoadingCompanies}
      />

      <PopularTags
        tags={popularTags}
        selectedTags={filters.selectedTags}
        onTagToggle={filters.handleTagToggle}
        isLoading={isLoadingTags}
      />

      <ActiveFilters
        searchQuery={filters.searchQuery}
        selectedCompanyNamesCount={filters.selectedCompanyNames.length}
        selectedTagsCount={filters.selectedTags.length}
        onReset={filters.handleReset}
      />

      <SelectedBadges
        selectedCompanyNames={filters.selectedCompanyNames}
        selectedTags={filters.selectedTags}
        onCompanyRemove={filters.handleCompanyToggle}
        onTagRemove={filters.handleTagToggle}
      />

      <BlogFilterModal
        companies={allCompanies}
        selectedCompanyNames={filters.selectedCompanyNames}
        onCompaniesApply={filters.handleCompaniesApply}
        isOpen={filters.showCompanyModal}
        onClose={() => filters.setShowCompanyModal(false)}
        isLoading={isLoadingCompanies}
      />

      <TagFilterModal
        tags={allTags}
        selectedTags={filters.selectedTags}
        onTagsApply={filters.handleTagsApply}
        isOpen={filters.showTagModal}
        onClose={() => filters.setShowTagModal(false)}
        isLoading={isLoadingTags}
      />
    </section>
  );
}
