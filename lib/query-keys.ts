/**
 * TanStack Query Key 중앙 관리
 * 모든 query key는 이 파일에서 관리하여 일관성과 타입 안전성을 보장합니다.
 */

export const queryKeys = {
  /**
   * 게시글 관련 query keys
   */
  posts: {
    all: ['posts'] as const,
    list: (params: {
      page: number;
      search?: string;
      tags?: string[];
      companies?: string[];
      companyId?: string;
      sort?: string;
    }) => {
      const tagsString = params.tags?.join(',') || '';
      const companiesString = params.companies?.join(',') || '';
      return [
        'posts',
        params.page,
        params.search || '',
        tagsString,
        companiesString,
        params.companyId || '',
        params.sort || '',
      ] as const;
    },
  },

  /**
   * 회사 관련 query keys
   */
  companies: {
    all: ['companies'] as const,
    list: (params: { featured?: boolean; all?: boolean }) => ['companies', params.featured, params.all] as const,
  },

  /**
   * 태그 관련 query keys
   */
  tags: {
    all: ['tags'] as const,
    list: (params: { featured?: boolean; category?: string; sort?: string }) =>
      ['tags', params.featured, params.category, params.sort] as const,
  },

  /**
   * 북마크 관련 query keys
   */
  bookmarks: {
    all: ['bookmarks'] as const,
    list: () => ['bookmarks'] as const,
  },

  /**
   * 최근 본 글 관련 query keys
   */
  recentViews: {
    all: ['recent-views'] as const,
    list: (isLoggedIn: boolean) => ['recent-views', isLoggedIn] as const,
  },

  /**
   * 공지사항 관련 query keys
   */
  announcements: {
    all: ['announcements'] as const,
    list: (params: { page: number; limit: number }) => ['announcements', params.page, params.limit] as const,
  },
} as const;
