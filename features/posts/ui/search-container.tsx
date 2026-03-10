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
  const { data: allTagsData, isLoading: isLoadingAllTags } = useTags({ sort: 'name' });

  const allBlogs = allBlogsData?.companies || [];
  const allTags = allTagsData?.tags || [];

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
        isLoading={isLoadingAllBlogs}
      />

      <TagFilterModal
        tags={allTags}
        selectedTags={filters.selectedTags}
        onTagsApply={filters.handleTagsApply}
        isOpen={filters.showTagModal}
        onClose={() => filters.setShowTagModal(false)}
        isLoading={isLoadingAllTags}
      />
    </section>
  );
}
