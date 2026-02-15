import type { MetadataRoute } from 'next';
import { createSupabaseServerClient } from '@/supabase/server.supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://devblog.kr';

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/posts`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: `${baseUrl}/announcements`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/recent-views`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/request`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/feed.xml`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // 동적 페이지 추가 (태그별, 회사별)
  try {
    const supabase = await createSupabaseServerClient();

    // 활성 회사 목록
    const { data: companies } = await supabase
      .from('companies')
      .select('id, name_en, updated_at')
      .eq('is_active', true);

    const companyPages: MetadataRoute.Sitemap =
      companies?.map((company) => ({
        url: `${baseUrl}/posts?companies=${company.id}`,
        lastModified: company.updated_at ? new Date(company.updated_at) : new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      })) || [];

    // 인기 태그 목록 (is_featured=true)
    const { data: tags } = await supabase.from('tags').select('name').eq('is_featured', true);

    const tagPages: MetadataRoute.Sitemap =
      tags?.map((tag) => ({
        url: `${baseUrl}/posts?tags=${encodeURIComponent(tag.name)}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.7,
      })) || [];

    return [...staticPages, ...companyPages, ...tagPages];
  } catch (error) {
    return staticPages;
  }
}
