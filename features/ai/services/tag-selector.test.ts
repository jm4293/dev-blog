import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAllTagsFromDatabase, type Tag } from './tag-selector';
import type { SupabaseClient } from '@supabase/supabase-js';

// Mock Supabase
const mockSupabase: any = {
  from: vi.fn(),
};

describe('tag-selector 서비스', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ✅ 테스트 1: 모든 태그 조회 성공
  it('should fetch all tags from database', async () => {
    const mockTags: Tag[] = [
      { id: '1', name: 'React' },
      { id: '2', name: 'Vue' },
      { id: '3', name: 'Backend' },
    ];

    const mockQueryBuilder = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: mockTags,
        error: null,
      }),
    };

    mockSupabase.from.mockReturnValue(mockQueryBuilder);

    const result = await getAllTagsFromDatabase(mockSupabase as SupabaseClient);

    expect(result).toHaveLength(3);
    expect(result[0].name).toBe('React');
    expect(result[1].name).toBe('Vue');
    expect(result[2].name).toBe('Backend');
  });

  // ✅ 테스트 2: 태그가 없을 때 빈 배열 반환
  it('should return empty array when no tags exist', async () => {
    const mockQueryBuilder = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
    };

    mockSupabase.from.mockReturnValue(mockQueryBuilder);

    const result = await getAllTagsFromDatabase(mockSupabase as SupabaseClient);

    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
  });

  // ✅ 테스트 3: 에러 발생 시 빈 배열 반환
  it('should return empty array on database error', async () => {
    const mockQueryBuilder = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: null,
        error: new Error('Database error'),
      }),
    };

    mockSupabase.from.mockReturnValue(mockQueryBuilder);

    const result = await getAllTagsFromDatabase(mockSupabase as SupabaseClient);

    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
  });

  // ✅ 테스트 4: 올바른 쿼리 빌드 확인
  it('should build correct query', async () => {
    const mockQueryBuilder = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
    };

    mockSupabase.from.mockReturnValue(mockQueryBuilder);

    await getAllTagsFromDatabase(mockSupabase as SupabaseClient);

    // 'tags' 테이블 조회 확인
    expect(mockSupabase.from).toHaveBeenCalledWith('tags');

    // 'id, name' 선택 확인
    expect(mockQueryBuilder.select).toHaveBeenCalledWith('id, name');

    // 이름순 정렬 확인
    expect(mockQueryBuilder.order).toHaveBeenCalledWith('name', {
      ascending: true,
    });
  });

  // ✅ 테스트 5: 많은 태그 조회
  it('should handle large number of tags', async () => {
    const mockTags: Tag[] = Array.from({ length: 100 }, (_, i) => ({
      id: `${i + 1}`,
      name: `Tag${i + 1}`,
    }));

    const mockQueryBuilder = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: mockTags,
        error: null,
      }),
    };

    mockSupabase.from.mockReturnValue(mockQueryBuilder);

    const result = await getAllTagsFromDatabase(mockSupabase as SupabaseClient);

    expect(result).toHaveLength(100);
    expect(result[0].name).toBe('Tag1');
    expect(result[99].name).toBe('Tag100');
  });
});
