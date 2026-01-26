'use client';

import { CompanyFilterModal, TagFilterModal } from '@/components/search';
import { useCompanies, useTags, useSearchFilters } from '../hooks';
import { SearchInput, PopularCompanies, PopularTags, ActiveFilters, SelectedBadges } from '../components';

interface InitialFilters {
  page: number;
  search: string;
  tags: string;
  companies: string;
  sort: 'newest' | 'oldest';
}

interface SearchBarProps {
  initialFilters?: InitialFilters;
}

export function SearchBar({ initialFilters }: SearchBarProps) {
  const filters = useSearchFilters(initialFilters);

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
        onCompanyFilterClick={() => filters.setShowCompanyModal(true)}
        onTagFilterClick={() => filters.setShowTagModal(true)}
        currentSort={filters.sortParam}
        onSortChange={filters.handleSortChange}
      />

      <PopularCompanies
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
        searchQuery={filters.debouncedSearchQuery}
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

      <CompanyFilterModal
        companies={allCompanies}
        selectedCompanyNames={filters.selectedCompanyNames}
        onCompanyToggle={filters.handleCompanyToggle}
        isOpen={filters.showCompanyModal}
        onClose={() => filters.setShowCompanyModal(false)}
        isLoading={isLoadingCompanies}
      />

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
