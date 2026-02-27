'use client';

import { useBlogs, useSearchFilters, useTags } from '../hooks';
import { BlogFilterModal } from './blog-filter-modal';
import { SearchWrapper } from './search-wrapper';
import { SearchedResult } from './searched-result';
import { SearchedSelected } from './searched-selected';
import { TagFilterModal } from './tag-filter-modal';

interface SearchContainerProps {
  filters: ReturnType<typeof useSearchFilters>;
}

export function SearchContainer({ filters }: SearchContainerProps) {
  const { data: allBlogsData, isLoading: isLoadingAllBlogs } = useBlogs();
  const { data: popularBlogsData } = useBlogs({ featured: true });
  const { data: allTagsData, isLoading: isLoadingAllTags } = useTags({ sort: 'name' });
  const { data: popularTagsData, isLoading: isLoadingPopularTags } = useTags({ featured: true });

  const allBlogs = allBlogsData?.companies || [];
  const allTags = allTagsData?.tags || [];
  const popularTags = (popularTagsData?.tags || []).map((tag) => tag.name);
  const popularBlogs = popularBlogsData?.companies || [];
  const isLoadingBlogs = isLoadingAllBlogs;
  const isLoadingTags = isLoadingPopularTags || isLoadingAllTags;

  return (
    <section className="mb-8">
      <SearchWrapper
        value={filters.inputValue}
        onChange={filters.handleSearchChange}
        onSearch={filters.handleSearchSubmit}
        onBlogFilterClick={() => filters.setShowBlogModal(true)}
        onTagFilterClick={() => filters.setShowTagModal(true)}
        currentSort={filters.sortParam}
        onSortChange={filters.handleSortChange}
      />

      {/* <PopularBlogs
        companies={popularCompanies}
        selectedCompanyNames={filters.selectedBlogs}
        onCompanyToggle={filters.handleCompanyToggle}
        isLoading={isLoadingCompanies}
      /> */}

      {/* <PopularTags
        tags={popularTags}
        selectedTags={filters.selectedTags}
        onTagToggle={filters.handleTagToggle}
        isLoading={isLoadingTags}
      /> */}

      <SearchedResult
        searchQuery={filters.searchQuery}
        selectedCompanyNamesCount={filters.selectedBlogs.length}
        selectedTagsCount={filters.selectedTags.length}
        onReset={filters.handleReset}
      />

      <SearchedSelected
        selectedBlogs={filters.selectedBlogs}
        selectedTags={filters.selectedTags}
        onBlogRemove={filters.handleBlogToggle}
        onTagRemove={filters.handleTagToggle}
      />

      <BlogFilterModal
        blogs={allBlogs}
        selectedBlogs={filters.selectedBlogs}
        onBlogsApply={filters.handleBlogsApply}
        isOpen={filters.showBlogModal}
        onClose={() => filters.setShowBlogModal(false)}
        isLoading={isLoadingBlogs}
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
