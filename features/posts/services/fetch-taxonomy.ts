import { cache } from 'react';
import { findBySlug, slugify } from '@/utils';
import { createSupabaseStaticClient } from '@/supabase/static.supabase';
import type { Company, Tag } from '@/supabase/types.supabase';

/**
 * 태그/회사 전체 목록 조회 (랜딩 페이지, sitemap, generateStaticParams용)
 * 쿠키가 필요 없는 공개 데이터이므로 정적 클라이언트를 사용한다.
 * generateMetadata와 페이지 본문이 같은 요청 안에서 중복 호출하므로 React.cache로 요청 단위 dedupe.
 */

export const fetchAllTags = cache(async (): Promise<Tag[]> => {
  const supabase = createSupabaseStaticClient();

  const { data, error } = await supabase
    .from('tags')
    .select('id, name, category, usage_count, is_featured, created_at, updated_at')
    .order('usage_count', { ascending: false });

  if (error) {
    throw error;
  }

  return (data as Tag[]) || [];
});

export type CompanySummary = Pick<Company, 'id' | 'name' | 'name_en' | 'logo_url' | 'blog_url' | 'description'>;

export const fetchActiveCompanies = cache(async (): Promise<CompanySummary[]> => {
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
});

/** 회사 슬러그 (영문명 우선) */
export function companySlug(company: { name: string; name_en?: string }): string {
  return slugify(company.name_en || company.name);
}

/** 슬러그로 태그 조회 (없으면 undefined) */
export async function findTagBySlug(slug: string): Promise<Tag | undefined> {
  const tags = await fetchAllTags();
  return findBySlug(tags, slug, (tag) => tag.name);
}

/** 슬러그로 활성 회사 조회 (없으면 undefined) */
export async function findCompanyBySlug(slug: string): Promise<CompanySummary | undefined> {
  const companies = await fetchActiveCompanies();
  return findBySlug(companies, slug, companySlug);
}
