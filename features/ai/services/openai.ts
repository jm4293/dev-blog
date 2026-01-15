/**
 * OpenAI API 래퍼
 * - GPT-4o-mini 모델 사용
 * - 토큰 사용량 로깅
 */

import OpenAI from 'openai';

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
 */
export async function generateTags(title: string, summary: string): Promise<string[]> {
  const messages: Array<{ role: 'user' | 'system'; content: string }> = [
    {
      role: 'system',
      content: `당신은 기술 블로그 게시글 태깅 전문가입니다. 주어진 제목과 요약을 분석하여 가장 관련성 높은 기술 태그를 3-5개 제시해주세요.

가능한 태그 카테고리:
- Frontend: React, Vue, Next.js, TypeScript, CSS, HTML, Angular
- Backend: Node.js, Java, Spring, Python, Django, Go, Kotlin, PHP, Express
- Database: PostgreSQL, MongoDB, MySQL, Redis, Elasticsearch, Firebase
- DevOps: Docker, Kubernetes, AWS, GCP, Azure, CI/CD, GitHub Actions, Jenkins
- Mobile: React Native, Flutter, iOS, Android, Swift, Kotlin
- AI/ML: Machine Learning, Deep Learning, NLP, Computer Vision, LLM, PyTorch, TensorFlow
- 기타: Architecture, Performance, Security, Testing, Agile, WebAssembly

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
  const tags = tagsString
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
    .slice(0, 5); // 최대 5개만 반환

  return tags;
}
