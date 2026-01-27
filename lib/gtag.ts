// Google Tag Manager (GTM) 설정

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Page view 추적
 * @param url 페이지 URL
 */
export const pageview = (url: string) => {
  if (!GA_ID || typeof window === 'undefined') return;

  window.gtag('config', GA_ID, {
    page_path: url,
  });
};

/**
 * 이벤트 추적
 * @param action 이벤트 이름
 * @param category 이벤트 카테고리
 * @param label 이벤트 레이블
 * @param value 이벤트 값
 */
export const event = (action: string, category: string, label: string, value?: number) => {
  if (!GA_ID || typeof window === 'undefined') return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
};

// 추적할 주요 이벤트들
export const events = {
  // 검색
  search: (query: string) => event('search', 'engagement', 'search_query', undefined),

  // 필터링
  filterByTag: (tag: string) => event('filter', 'engagement', `tag_${tag}`, undefined),

  filterByCompany: (company: string) => event('filter', 'engagement', `company_${company}`, undefined),

  // 페이지네이션
  paginate: (page: number) => event('paginate', 'engagement', `page_${page}`, page),

  // 게시글 클릭
  clickPost: (postId: string, company: string) => event('click_post', 'engagement', `${company}_${postId}`, undefined),

  // 즐겨찾기
  addBookmark: (postId: string) => event('add_bookmark', 'engagement', `bookmark_${postId}`, undefined),

  removeBookmark: (postId: string) => event('remove_bookmark', 'engagement', `bookmark_${postId}`, undefined),

  // 로그인/로그아웃
  login: () => event('login', 'engagement', 'github_oauth', undefined),

  logout: () => event('logout', 'engagement', 'logout', undefined),

  // 테마 변경
  toggleTheme: (theme: string) => event('toggle_theme', 'engagement', theme, undefined),

  // 외부 링크 클릭
  externalClick: (url: string) => event('external_link', 'engagement', url, undefined),
};
