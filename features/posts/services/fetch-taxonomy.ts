import { createSupabaseStaticClient } from '@/supabase/static.supabase';
import type { Company, Tag } from '@/supabase/types.supabase';

/**
 * 태그/회사 전체 목록 조회 (랜딩 페이지, sitemap, generateStaticParams용)
 * 쿠키가 필요 없는 공개 데이터이므로 정적 클라이언트를 사용한다.
 */

export async function fetchAllTags(): Promise<Tag[]> {
  const supabase = createSupabaseStaticClient();

  const { data, error } = await supabase
    .from('tags')
    .select('id, name, category, usage_count, is_featured, created_at, updated_at')
    .order('usage_count', { ascending: false });

  if (error) {
    throw error;
  }

  return (data as Tag[]) || [];
}

export type CompanySummary = Pick<Company, 'id' | 'name' | 'name_en' | 'logo_url' | 'blog_url' | 'description'>;

export async function fetchActiveCompanies(): Promise<CompanySummary[]> {
  const supabase = createSupabaseStaticClient();

  const { data, error } = await supabase
    .from('companies')
    .select('id, name, name_en, logo_url, blog_url, description')
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (error) {
    throw error;
  }

  return (data as CompanySummary[]) || [];
}
