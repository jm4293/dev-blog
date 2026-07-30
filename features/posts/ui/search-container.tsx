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
  // 모달을 열기 전까지는 전체 블로그/태그 목록을 가져오지 않음 (방문자 대부분은 필터를 열지 않음)
  const { data: allBlogsData, isLoading: isLoadingAllBlogs } = useBlogs({ enabled: filters.showBlogModal });
  const { data: allTagsData, isLoading: isLoadingAllTags } = useTags({ sort: 'name', enabled: filters.showTagModal });

  const allBlogs = allBlogsData?.companies || [];
  const allTags = allTagsData?.tags || [];

  return (
    <section className="mb-8">
      <SearchWrapper
        value={filters.inputValue}
        onChange={filters.handleSearchChange}
        onSearch={filters.handleSearchSubmit}
        onClear={filters.handleSearchClear}
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
