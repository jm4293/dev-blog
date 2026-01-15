/**
 * devBlog.kr API 클라이언트
 * 확장플러그인에서 백엔드 API와 통신하는 모듈
 */

import type { Post, Company, Tag, FetchPostsParams, FetchPostsResponse } from '../types';

// API URL - www.devblog.kr API 사용
const API_BASE_URL = 'https://www.devblog.kr/api';

/**
 * 게시글 목록 조회
 */
export async function fetchPosts(params: FetchPostsParams = {}): Promise<FetchPostsResponse> {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.tags?.length) queryParams.append('tags', params.tags.join(','));
  if (params.companies?.length) queryParams.append('companies', params.companies.join(','));
  if (params.sort) queryParams.append('sort', params.sort);

  const url = `${API_BASE_URL}/posts?${queryParams.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const json = await response.json();

    // API 응답 구조 정규화
    const posts = json.data || json.posts || [];
    const pagination = json.pagination || {};

    // pagination 필드 안전하게 추출
    const total = pagination.total || json.total || posts.length;
    const limit = params.limit || pagination.limit || 10;
    const page = params.page || pagination.page || 1;
    const pages = pagination.pages || Math.ceil(total / limit);

    return {
      data: posts,
      pagination: {
        total,
        page,
        limit,
        pages,
      },
    };
  } catch (error) {
    return {
      data: [],
      pagination: {
        total: 0,
        page: params.page || 1,
        limit: params.limit || 10,
        pages: 0,
      },
    };
  }
}

/**
 * 기업 목록 조회
 */
export async function fetchCompanies(): Promise<Company[]> {
  const url = `${API_BASE_URL}/companies`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    throw error;
  }
}

/**
 * 인기 회사 조회 (featured)
 */
export async function fetchFeaturedCompanies(): Promise<Company[]> {
  try {
    const companies = await fetchCompanies();
    return companies.filter((c) => c.is_featured);
  } catch (error) {
    return [];
  }
}

/**
 * 태그 목록 조회
 */
export async function fetchTags(): Promise<Tag[]> {
  const url = `${API_BASE_URL}/tags`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    return [];
  }
}

/**
 * 날짜 포맷팅 유틸 (한국어)
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return `${diffMinutes}분 전`;
    }
    return `${diffHours}시간 전`;
  }

  if (diffDays < 7) {
    return `${diffDays}일 전`;
  }

  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks}주 전`;
  }

  return date.toLocaleDateString('ko-KR');
}

/**
 * 텍스트 길이 제한
 */
export function truncate(text: string, length: number = 100): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}
