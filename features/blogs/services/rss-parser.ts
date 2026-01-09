/**
 * RSS 피드 파싱 서비스
 * - RSS 피드에서 최신 게시글 추출
 * - HTML 본문을 텍스트로 변환
 * - 타임아웃 처리
 */

import Parser from 'rss-parser'
import * as cheerio from 'cheerio'

const parser = new Parser({
  timeout: 15000, // 15초 타임아웃
  headers: {
    'User-Agent': 'devBlog/1.0 (+https://devblog.kr)',
  },
})

export interface ParsedPost {
  title: string
  url: string
  summary: string
  author?: string
  publishedAt: string
  content?: string
}

/**
 * HTML에서 텍스트 추출 (처음 500자)
 */
function extractTextFromHtml(html: string | undefined): string {
  if (!html) return ''

  try {
    const $ = cheerio.load(html)
    const text = $('body').text().replace(/\s+/g, ' ').trim()
    return text.substring(0, 500)
  } catch (error) {
    return ''
  }
}

/**
 * RSS 피드에서 게시글 파싱
 */
export async function parseRssFeed(rssUrl: string): Promise<ParsedPost[]> {
  try {
    const feed = await parser.parseURL(rssUrl)

    if (!feed.items || feed.items.length === 0) {
      console.log(`No items found in RSS feed: ${rssUrl}`)
      return []
    }

    const posts: ParsedPost[] = feed.items
      .slice(0, 50) // 최대 50개만 처리
      .map((item) => ({
        title: item.title || 'No Title',
        url: item.link || '',
        summary: extractTextFromHtml(item.content || item.description),
        author: item.creator || item.author,
        publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        content: item.content || item.description,
      }))
      .filter((post) => post.url) // URL이 있는 것만 필터링

    return posts
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`Failed to parse RSS feed (${rssUrl}):`, errorMessage)
    throw new Error(`RSS 파싱 실패: ${errorMessage}`)
  }
}

/**
 * 여러 RSS 피드 동시 파싱
 */
export async function parseMultipleFeeds(rssUrls: string[]): Promise<Map<string, ParsedPost[]>> {
  const results = new Map<string, ParsedPost[]>()

  const promises = rssUrls.map(async (url) => {
    try {
      const posts = await parseRssFeed(url)
      results.set(url, posts)
    } catch (error) {
      results.set(url, [])
      console.error(`Failed to parse ${url}`, error)
    }
  })

  await Promise.all(promises)
  return results
}
