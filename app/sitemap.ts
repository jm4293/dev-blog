import type { MetadataRoute } from 'next';
import { createSupabaseServerClient } from '@/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://devblog.kr';

  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: `${baseUrl}/posts`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bookmarks`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/announcements`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/request`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];

  // 페이지네이션 페이지 추가 (최대 10페이지)
  let paginationPages: MetadataRoute.Sitemap = [];
  try {
    const supabase = await createSupabaseServerClient();
    const { count } = await supabase.from('posts').select('*', { count: 'exact', head: true });

    if (count) {
      const totalPages = Math.ceil(count / 20);
      const maxPages = Math.min(totalPages, 10);

      for (let page = 2; page <= maxPages; page++) {
        paginationPages.push({
          url: `${baseUrl}/posts?page=${page}`,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 0.7,
        });
      }
    }
  } catch {}

  return [...staticPages, ...paginationPages];
}
