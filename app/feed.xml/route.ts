import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/supabase/server.supabase';

/**
 * GET /feed.xml
 * RSS 2.0 피드 생성
 * Google Search Console에 등록할 RSS 피드
 */
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://devblog.kr';

    // 최근 100개 게시글 조회
    const { data: postsData, error } = await supabase
      .from('posts')
      .select(
        `
        id,
        title,
        summary,
        url,
        author,
        published_at,
        company:companies(name, logo_url, blog_url)
      `,
      )
      .order('published_at', { ascending: false })
      .limit(100);

    if (error) {
      throw error;
    }

    // 데이터 변환 (company가 배열일 수 있으므로 첫 번째 항목만 사용)
    const posts = (postsData || []).map((post: any) => ({
      ...post,
      company: Array.isArray(post.company) ? post.company[0] : post.company,
    }));

    // RSS 피드 생성
    const rss = generateRSS(posts, baseUrl);

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('RSS feed generation error:', errorMsg);

    return NextResponse.json(
      { error: 'Failed to generate RSS feed', details: errorMsg },
      { status: 500 },
    );
  }
}

interface RSSPost {
  id: string;
  title: string;
  summary?: string;
  url: string;
  author?: string;
  published_at: string;
  company?: {
    name: string;
    logo_url?: string;
    blog_url: string;
  };
}

function generateRSS(posts: RSSPost[], baseUrl: string): string {
  const lastBuildDate = new Date().toUTCString();
  const lastPostDate =
    posts.length > 0 ? new Date(posts[0].published_at).toUTCString() : lastBuildDate;

  const itemsXml = posts
    .map((post) => {
      const pubDate = new Date(post.published_at).toUTCString();
      const companyName = post.company?.name || 'Unknown';
      const content = post.summary || '';

      return `    <item>
      <title><![CDATA[${escapeXml(post.title)}]]></title>
      <link>${escapeXml(post.url)}</link>
      <description><![CDATA[${escapeXml(content)}]]></description>
      <author>${escapeXml(post.author || companyName)}</author>
      <category><![CDATA[${escapeXml(companyName)}]]></category>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${escapeXml(post.url)}</guid>
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>devBlog.kr - 한국 개발 기업 블로그</title>
    <link>${baseUrl}</link>
    <description>한국 IT 기업들의 기술 블로그 게시글을 한 곳에서 모아볼 수 있는 플랫폼</description>
    <language>ko-kr</language>
    <copyright>© 2024-${new Date().getFullYear()} devBlog.kr</copyright>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <pubDate>${lastPostDate}</pubDate>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>devBlog.kr</title>
      <link>${baseUrl}</link>
    </image>
${itemsXml}
  </channel>
</rss>`;
}

function escapeXml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
