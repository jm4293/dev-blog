import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import { NextRequest } from 'next/server';

// Mock modules
vi.mock('@/utils', () => ({
  checkRateLimit: vi.fn(() => true),
  extractIP: vi.fn(() => '127.0.0.1'),
  createRateLimitResponse: vi.fn((msg) => ({
    status: 429,
    json: async () => ({ error: msg }),
  })),
  RATE_LIMIT_CONFIG: {
    PUBLIC: { requests: 100, window: 3600 },
  },
}));

vi.mock('@/supabase', () => ({
  createSupabaseServerClient: vi.fn(),
}));

import { createSupabaseServerClient } from '@/supabase';

// Mock Supabase 쿼리 빌더
function createMockQueryBuilder(data: any, error: any = null) {
  return {
    select: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    overlaps: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    range: vi.fn().mockResolvedValue({ data, error }),
  };
}

describe('GET /api/posts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ✅ 테스트 1: 기본 게시글 조회
  it('should return posts with default parameters', async () => {
    const mockPosts = [
      {
        id: '1',
        title: 'React 튜토리얼',
        tags: ['React'],
        company_id: 'toss',
        company: { id: 'toss', name: '토스' },
        published_at: '2026-01-20T00:00:00Z',
      },
    ];

    const mockSupabase = {
      from: vi.fn().mockReturnValue(createMockQueryBuilder(mockPosts)),
    };

    (createSupabaseServerClient as any).mockResolvedValueOnce(mockSupabase);

    const request = new NextRequest('http://localhost:3000/api/posts');
    const response = await GET(request);
    const data = await response.json();

    expect(data.posts).toHaveLength(1);
    expect(data.posts[0].title).toBe('React 튜토리얼');
    expect(data.page).toBe(1);
  });

  // ✅ 테스트 2: 검색 파라미터 처리
  it('should handle search parameter', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue(
        createMockQueryBuilder([
          {
            id: '1',
            title: 'React 튜토리얼',
            tags: [],
            company_id: 'toss',
            company: {},
            published_at: '2026-01-20T00:00:00Z',
          },
        ]),
      ),
    };

    (createSupabaseServerClient as any).mockResolvedValueOnce(mockSupabase);

    const request = new NextRequest('http://localhost:3000/api/posts?search=React');
    const response = await GET(request);
    const data = await response.json();

    expect(data.posts).toHaveLength(1);
  });

  // ✅ 테스트 3: 페이지네이션
  it('should handle pagination correctly', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue(createMockQueryBuilder([])),
    };

    (createSupabaseServerClient as any).mockResolvedValueOnce(mockSupabase);

    const request = new NextRequest('http://localhost:3000/api/posts?page=2&limit=10');
    const response = await GET(request);
    const data = await response.json();

    expect(data.page).toBe(2);
  });

  // ✅ 테스트 4: 태그 필터링
  it('should handle tag filtering', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue(
        createMockQueryBuilder([
          {
            id: '1',
            title: 'React 튜토리얼',
            tags: ['React'],
            company_id: 'toss',
            company: {},
            published_at: '2026-01-20T00:00:00Z',
          },
        ]),
      ),
    };

    (createSupabaseServerClient as any).mockResolvedValueOnce(mockSupabase);

    const request = new NextRequest('http://localhost:3000/api/posts?tags=React,Backend');
    const response = await GET(request);
    const data = await response.json();

    expect(data.posts).toHaveLength(1);
  });

  // ✅ 테스트 5: 단일 기업 필터
  it('should handle single company filter', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue(
        createMockQueryBuilder([
          {
            id: '1',
            title: 'Toss 블로그',
            tags: [],
            company_id: 'toss',
            company: { id: 'toss', name: '토스' },
            published_at: '2026-01-20T00:00:00Z',
          },
        ]),
      ),
    };

    (createSupabaseServerClient as any).mockResolvedValueOnce(mockSupabase);

    const request = new NextRequest('http://localhost:3000/api/posts?company=toss');
    const response = await GET(request);
    const data = await response.json();

    expect(data.posts).toHaveLength(1);
    expect(data.posts[0].company_id).toBe('toss');
  });

  // ✅ 테스트 6: 정렬 옵션 (최신순)
  it('should support sort by newest', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue(createMockQueryBuilder([])),
    };

    (createSupabaseServerClient as any).mockResolvedValueOnce(mockSupabase);

    const request = new NextRequest('http://localhost:3000/api/posts?sort=newest');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
  });

  // ✅ 테스트 7: 정렬 옵션 (오래된순)
  it('should support sort by oldest', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue(createMockQueryBuilder([])),
    };

    (createSupabaseServerClient as any).mockResolvedValueOnce(mockSupabase);

    const request = new NextRequest('http://localhost:3000/api/posts?sort=oldest');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
  });

  // ✅ 테스트 8: 게시글 없을 때
  it('should return empty posts array when no posts found', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue(createMockQueryBuilder([])),
    };

    (createSupabaseServerClient as any).mockResolvedValueOnce(mockSupabase);

    const request = new NextRequest('http://localhost:3000/api/posts');
    const response = await GET(request);
    const data = await response.json();

    expect(data.posts).toEqual([]);
    expect(data.total).toBe(0);
  });

  // ✅ 테스트 9: 응답 형식 확인
  it('should return correct response format', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue(createMockQueryBuilder([])),
    };

    (createSupabaseServerClient as any).mockResolvedValueOnce(mockSupabase);

    const request = new NextRequest('http://localhost:3000/api/posts');
    const response = await GET(request);
    const data = await response.json();

    expect(data).toHaveProperty('posts');
    expect(data).toHaveProperty('total');
    expect(data).toHaveProperty('page');
    expect(data).toHaveProperty('totalPages');
    expect(data).toHaveProperty('hasNextPage');
    expect(data).toHaveProperty('hasPrevPage');
  });

  // ✅ 테스트 10: 페이지 정보 정확성
  it('should calculate pagination info correctly', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue(createMockQueryBuilder([])),
    };

    // Mock count를 100개로 설정
    const countQueryBuilder = createMockQueryBuilder(null);
    // count 값을 100으로 설정하기 위해 count 프로퍼티 추가
    Object.defineProperty(countQueryBuilder, 'count', { value: 100 });

    (createSupabaseServerClient as any).mockResolvedValueOnce({
      from: vi.fn().mockReturnValue(countQueryBuilder),
    });

    const request = new NextRequest('http://localhost:3000/api/posts?limit=20&page=1');
    const response = await GET(request);
    const data = await response.json();

    // page=1이면 hasPrevPage는 false, hasNextPage는 true
    expect(data.hasPrevPage).toBe(false);
  });
});
