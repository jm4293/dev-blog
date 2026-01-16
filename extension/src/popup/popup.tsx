import React, { useState, useEffect } from 'react';
import { fetchPosts, fetchCompanies, fetchTags, formatDate } from '../api/client';
import type { Post, Company, Tag } from '../types';
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';

interface PopupState {
  posts: Post[];
  companies: Company[];
  tags: Tag[];
  selectedCompanies: string[];
  selectedTags: string[];
  searchQuery: string;
  page: number;
  loading: boolean;
  error: string | null;
  total: number;
  pages: number;
}

export function PopupApp() {
  const [state, setState] = useState<PopupState>({
    posts: [],
    companies: [],
    tags: [],
    selectedCompanies: [],
    selectedTags: [],
    searchQuery: '',
    page: 1,
    loading: false,
    error: null,
    total: 0,
    pages: 0,
  });

  // 게시글 로드
  const loadPosts = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetchPosts({
        page: state.page,
        limit: 10,
        search: state.searchQuery,
        tags: state.selectedTags.length > 0 ? state.selectedTags : undefined,
        companies: state.selectedCompanies.length > 0 ? state.selectedCompanies : undefined,
      });

      setState((prev) => ({
        ...prev,
        posts: response.data,
        total: response.pagination.total,
        pages: response.pagination.pages,
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : '게시글 로드 실패',
        loading: false,
      }));
    }
  };

  // 초기 로드
  useEffect(() => {
    const loadInitial = async () => {
      try {
        const [companies, tags] = await Promise.all([fetchCompanies(), fetchTags()]);

        setState((prev) => ({
          ...prev,
          companies,
          tags,
        }));
      } catch (error) {}
    };

    loadInitial();
    loadPosts();
  }, []);

  // 필터 변경 시 게시글 다시 로드
  useEffect(() => {
    if (state.page === 1) {
      loadPosts();
    } else {
      setState((prev) => ({ ...prev, page: 1 }));
    }
  }, [state.selectedCompanies, state.selectedTags, state.searchQuery]);

  // 페이지 변경 시
  useEffect(() => {
    if (state.page > 0) {
      loadPosts();
    }
  }, [state.page]);

  const handleSearchChange = (value: string) => {
    setState((prev) => ({ ...prev, searchQuery: value, page: 1 }));
  };

  const handleCompanyToggle = (companyId: string) => {
    setState((prev) => ({
      ...prev,
      selectedCompanies: prev.selectedCompanies.includes(companyId)
        ? prev.selectedCompanies.filter((id) => id !== companyId)
        : [...prev.selectedCompanies, companyId],
      page: 1,
    }));
  };

  const handleTagToggle = (tagName: string) => {
    setState((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tagName)
        ? prev.selectedTags.filter((t) => t !== tagName)
        : [...prev.selectedTags, tagName],
      page: 1,
    }));
  };

  const handleOpenPost = (url: string) => {
    chrome.tabs.create({ url });
  };

  return (
    <div className="w-[500px] bg-white dark:bg-gray-900 flex flex-col">
      {/* 헤더 */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-blue-600">devBlog</span>
        </div>
        <a
          href="https://devblog.kr"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          웹사이트
        </a>
      </div>

      {/* 검색 & 필터 */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700 space-y-3">
        {/* 검색 */}
        <input
          type="text"
          placeholder="게시글 검색..."
          value={state.searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* 회사 필터 */}
        {state.companies.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">회사</label>
            <div className="grid grid-cols-2 gap-2 max-h-24 overflow-y-auto">
              {state.companies.map((company) => (
                <button
                  key={company.id}
                  onClick={() => handleCompanyToggle(company.id)}
                  className={`flex items-center gap-2 p-2 rounded text-xs transition-colors ${
                    state.selectedCompanies.includes(company.id)
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {company.logo_url && <img src={company.logo_url} alt={company.name} className="w-4 h-4 rounded" />}
                  <span className="truncate">{company.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 태그 필터 */}
        {state.tags.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">태그</label>
            <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
              {state.tags.slice(0, 8).map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => handleTagToggle(tag.name)}
                  className={`px-2 py-1 rounded text-xs transition-colors whitespace-nowrap ${
                    state.selectedTags.includes(tag.name)
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 게시글 목록 */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
        {state.loading && (
          <div className="text-center py-8 text-gray-500">
            <div className="animate-spin inline-block w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
            <p className="mt-2 text-sm">로딩 중...</p>
          </div>
        )}

        {!state.loading && state.error && (
          <div className="text-center py-8 text-red-500 text-sm">
            <p>❌ {state.error}</p>
          </div>
        )}

        {!state.loading && state.posts.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            <p>📭 결과가 없습니다</p>
          </div>
        )}

        {state.posts.map((post) => (
          <div
            key={post.id}
            onClick={() => handleOpenPost(post.url)}
            className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer transition-all group"
          >
            {/* 헤더 */}
            <div className="flex items-start gap-2 mb-2">
              {post.company?.logo_url && (
                <img
                  src={post.company.logo_url}
                  alt={post.company.name}
                  className="w-5 h-5 rounded flex-shrink-0 mt-0.5"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  {post.company?.name || 'Unknown'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {post.published_at ? formatDate(post.published_at) : 'Unknown date'}
                </p>
              </div>
            </div>

            {/* 제목 */}
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {post.title}
            </h3>

            {/* 태그 */}
            {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-block text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200"
                  >
                    {tag}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className="inline-block text-xs px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    +{post.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      {!state.loading && state.pages > 1 && (
        <div className="flex-shrink-0 flex flex-col items-center gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-center items-center gap-2 flex-wrap">
            {/* 처음 */}
            <button
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  page: 1,
                }))
              }
              disabled={state.page === 1}
              className="p-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
              title="처음"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>

            {/* 이전 */}
            <button
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  page: Math.max(1, prev.page - 1),
                }))
              }
              disabled={state.page === 1}
              className="p-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
              title="이전"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* 페이지 번호 */}
            <div className="flex gap-1">
              {(() => {
                // 5개씩 표시하는 그룹 계산
                const pageGroupSize = 5;
                const currentGroup = Math.ceil(state.page / pageGroupSize);
                const startPage = (currentGroup - 1) * pageGroupSize + 1;
                const endPage = Math.min(startPage + pageGroupSize - 1, state.pages);

                const pages = [];

                // 현재 그룹의 페이지 번호 표시 ('...' 제거)
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() =>
                        setState((prev) => ({
                          ...prev,
                          page: i,
                        }))
                      }
                      className={`px-2 py-1 rounded text-xs border transition-colors ${
                        state.page === i
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {i}
                    </button>,
                  );
                }

                return pages;
              })()}
            </div>

            {/* 다음 */}
            <button
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  page: Math.min(prev.pages, prev.page + 1),
                }))
              }
              disabled={state.page >= state.pages}
              className="p-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
              title="다음"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* 마지막 */}
            <button
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  page: prev.pages,
                }))
              }
              disabled={state.page >= state.pages}
              className="p-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
              title="마지막"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>

          {/* 페이지 정보 */}
          <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
            페이지 {state.page} / {state.pages} (총 {state.total}개)
          </div>
        </div>
      )}
    </div>
  );
}
