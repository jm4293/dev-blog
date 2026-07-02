import type { MetadataRoute } from 'next';
import { getRecentWeeks, slugify } from '@/utils';
import { fetchActiveCompanies, fetchAllTags } from '@/features/posts';

export const revalidate = 86400; // 1일

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://devblog.kr';
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/posts`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: `${baseUrl}/tags`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/companies`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/digest`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/announcements`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/recent-views`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/request`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/feed.xml`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // 태그/회사 목록 조회 실패가 sitemap 전체를 막지 않도록 방어
  const [tags, companies] = await Promise.all([fetchAllTags().catch(() => []), fetchActiveCompanies().catch(() => [])]);

  const tagEntries: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `${baseUrl}/tags/${slugify(tag.name)}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const companyEntries: MetadataRoute.Sitemap = companies.map((company) => ({
    url: `${baseUrl}/companies/${slugify(company.name_en || company.name)}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // 최근 8주 인기글 페이지 (현재 주 포함)
  const digestEntries: MetadataRoute.Sitemap = getRecentWeeks(8).map((week) => ({
    url: `${baseUrl}/digest/${week.week}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticEntries, ...tagEntries, ...companyEntries, ...digestEntries];
}
