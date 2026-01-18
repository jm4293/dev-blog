/**
 * OpenAI API 래퍼
 * - GPT-4o-mini 모델 사용
 * - 토큰 사용량 로깅
 */

import OpenAI from 'openai';
import { Tag } from './tag-selector';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface CompletionResult {
  content: string;
  tokensUsed: number;
  model: string;
}

/**
 * OpenAI API 호출 (재시도 로직 포함)
 */
async function callOpenAI(
  messages: Array<{ role: 'user' | 'system'; content: string }>,
  maxRetries = 3,
): Promise<CompletionResult> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await openai.chat.completions.create(
        {
          model: 'gpt-4o-mini',
          messages,
          temperature: 0.7,
          max_tokens: 200,
        },
        { timeout: 30000 }, // 30초 타임아웃
      );

      const content = response.choices[0]?.message?.content || '';

      return {
        content,
        tokensUsed: response.usage?.total_tokens || 0,
        model: response.model,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // 마지막 시도가 아니면 2초 대기 후 재시도
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  }

  throw new Error(`OpenAI API 호출 실패 (${maxRetries}회 재시도): ${lastError?.message}`);
}

/**
 * 게시글 요약 생성 (1-2줄)
 */
export async function generateSummary(title: string, content: string): Promise<string> {
  const messages: Array<{ role: 'user' | 'system'; content: string }> = [
    {
      role: 'system',
      content: `당신은 기술 블로그 게시글 요약 전문가입니다. 주어진 제목과 내용을 바탕으로 1-2줄의 핵심 요약을 한국어로 작성해주세요.`,
    },
    {
      role: 'user',
      content: `제목: ${title}\n내용: ${content}\n\n요약:`,
    },
  ];

  const result = await callOpenAI(messages);
  return result.content.trim();
}

/**
 * 게시글 태그 생성 (3-5개)
 * tags 테이블에 있는 태그 중에서만 선택합니다.
 *
 * @param title - 게시글 제목
 * @param summary - 게시글 요약
 * @param availableTags - tags 테이블에서 조회한 사용 가능한 태그 목록
 */
export async function generateTags(title: string, summary: string, availableTags: Tag[]): Promise<string[]> {
  if (!availableTags || availableTags.length === 0) {
    return [];
  }

  // 사용 가능한 태그 목록을 문자열로 변환
  const tagList = availableTags.map((tag) => tag.name).join(', ');

  const messages: Array<{ role: 'user' | 'system'; content: string }> = [
    {
      role: 'system',
      content: `당신은 기술 블로그 게시글 태깅 전문가입니다. 주어진 제목과 요약을 분석하여 아래 태그 목록에서 가장 관련성 높은 태그를 3-5개 선택해주세요.

사용 가능한 태그 목록:
${tagList}

중요: 반드시 위 목록에 있는 태그만 사용하세요.
응답 형식: 태그1,태그2,태그3 (쉼표로 구분, 공백 없음)`,
    },
    {
      role: 'user',
      content: `제목: ${title}\n요약: ${summary}\n\n태그:`,
    },
  ];

  const result = await callOpenAI(messages);
  const tagsString = result.content.trim();

  // 쉼표로 구분된 태그 파싱
  const selectedTags = tagsString
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  // tags 테이블에 있는 태그만 필터링 (대소문자 무시)
  const availableTagNames = availableTags.map((tag) => tag.name.toLowerCase());
  const validTags = selectedTags.filter((tag) => availableTagNames.includes(tag.toLowerCase()));

  // availableTags에서 원본 이름 찾기 (대소문자 보존)
  const finalTags = validTags
    .map((tag) => {
      const found = availableTags.find((t) => t.name.toLowerCase() === tag.toLowerCase());
      return found ? found.name : null;
    })
    .filter((tag): tag is string => tag !== null)
    .slice(0, 5); // 최대 5개만 반환

  return finalTags;
}
