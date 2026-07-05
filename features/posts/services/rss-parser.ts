/**
 * RSS 피드 파싱 서비스
 * - RSS 피드에서 최신 게시글 추출
 * - HTML 본문을 텍스트로 변환
 * - 타임아웃 처리
 */
import * as cheerio from 'cheerio';
import Parser from 'rss-parser';

const FETCH_TIMEOUT_MS = 15000;

const DEFAULT_HEADERS = {
  'User-Agent': 'devBlog/1.0 (+https://devblog.kr)',
  // 일부 피드(네이버 D2, 지마켓 등)는 XML 전용 Accept 헤더에 406을 반환하므로 */* 허용
  Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
};

// WAF(봇 차단)에 403/406으로 거부당했을 때 폴백용 브라우저 헤더 (우아한형제들 등)
const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
};

const parser = new Parser();

/**
 * HTTP 레벨 실패 (상태 코드 기반 재시도 판단용)
 * - retryAfterSeconds: 429 응답의 Retry-After 헤더 값
 */
export class FeedFetchError extends Error {
  readonly status: number;
  readonly retryAfterSeconds?: number;

  constructor(status: number, retryAfterSeconds?: number) {
    super(`RSS 파싱 실패: Status code ${status}`);
    this.name = 'FeedFetchError';
    this.status = status;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

interface ParsedPost {
  title: string;
  url: string;
  summary: string;
  author?: string;
  publishedAt: string;
  content?: string;
}

function parseRetryAfter(response: Response): number | undefined {
  const header = response.headers.get('retry-after');
  if (!header) {
    return undefined;
  }

  const seconds = Number(header);
  if (Number.isFinite(seconds) && seconds >= 0) {
    return seconds;
  }

  // HTTP-date 형식 (예: Wed, 21 Oct 2026 07:28:00 GMT)
  const date = Date.parse(header);
  if (!Number.isNaN(date)) {
    return Math.max(0, Math.round((date - Date.now()) / 1000));
  }

  return undefined;
}

async function fetchWithTimeout(rssUrl: string, headers: Record<string, string>): Promise<Response> {
  try {
    return await fetch(rssUrl, {
      headers,
      redirect: 'follow',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
      throw new Error(`RSS 파싱 실패: Request timed out after ${FETCH_TIMEOUT_MS}ms`);
    }
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`RSS 파싱 실패: ${errorMessage}`);
  }
}

async function fetchFeedXml(rssUrl: string): Promise<string> {
  let response = await fetchWithTimeout(rssUrl, DEFAULT_HEADERS);

  // 봇 차단(403/406)은 브라우저 헤더로 1회 재요청
  if (response.status === 403 || response.status === 406) {
    response = await fetchWithTimeout(rssUrl, BROWSER_HEADERS);
  }

  if (!response.ok) {
    throw new FeedFetchError(response.status, parseRetryAfter(response));
  }

  return response.text();
}

/**
 * HTML에서 텍스트 추출 (처음 250자)
 */
function extractTextFromHtml(html: string | undefined): string {
  if (!html) {
    return '';
  }

  try {
    const $ = cheerio.load(html);
    const text = $('body').text().replace(/\s+/g, ' ').trim();
    return text.substring(0, 250);
  } catch (error) {
    return '';
  }
}

/**
 * RSS 피드에서 게시글 파싱
 */
export async function parseRssFeed(rssUrl: string): Promise<ParsedPost[]> {
  const xml = await fetchFeedXml(rssUrl);

  try {
    const feed = await parser.parseString(xml);

    if (!feed.items || feed.items.length === 0) {
      return [];
    }

    const posts: ParsedPost[] = feed.items
      .slice(0, 50) // 최대 50개만 처리
      .map((item) => ({
        // 일부 피드는 제목에 개행/연속 공백이 섞여 있어 정규화
        title: (item.title || 'No Title').replace(/\s+/g, ' ').trim(),
        url: item.link || '',
        summary: extractTextFromHtml(item.content || item.description),
        author: item.creator || item.author,
        publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        content: item.content || item.description,
      }))
      .filter((post) => post.url); // URL이 있는 것만 필터링

    return posts;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`RSS 파싱 실패: ${errorMessage}`);
  }
}

/**
 * 여러 RSS 피드 동시 파싱
 */
export async function parseMultipleFeeds(rssUrls: string[]): Promise<Map<string, ParsedPost[]>> {
  const results = new Map<string, ParsedPost[]>();

  const promises = rssUrls.map(async (url) => {
    try {
      const posts = await parseRssFeed(url);
      results.set(url, posts);
    } catch (error) {
      results.set(url, []);
    }
  });

  await Promise.all(promises);
  return results;
}
