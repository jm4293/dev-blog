/**
 * 태그 선택 서비스
 *
 * AI를 사용하지 않고 게시글 제목과 내용을 기반으로
 * tags 테이블에서 미리 정의된 태그들 중 적절한 것을 선택합니다.
 */

import { SupabaseClient } from '@supabase/supabase-js';

interface TagMatch {
  name: string;
  score: number;
}

/**
 * 게시글의 제목과 내용을 분석하여 tags 테이블에서 적절한 태그를 선택합니다.
 *
 * @param title - 게시글 제목
 * @param content - 게시글 내용 (처음 500자 정도)
 * @param supabase - Supabase 클라이언트
 * @returns 선택된 태그 배열 (3-5개)
 */
export async function selectTagsFromDatabase(
  title: string,
  content: string,
  supabase: SupabaseClient,
): Promise<string[]> {
  try {
    // 1. 모든 활성 태그 조회
    const { data: allTags, error: tagsError } = await supabase
      .from('tags')
      .select('id, name')
      .order('name', { ascending: true });

    if (tagsError || !allTags || allTags.length === 0) {
      return [];
    }

    // 2. 텍스트 정규화
    const normalizedText = (title + ' ' + content).toLowerCase();

    // 3. 각 태그에 대해 점수 계산
    const tagMatches: TagMatch[] = allTags.map((tag) => {
      const tagName = tag.name.toLowerCase();
      let score = 0;

      // 제목에 정확히 포함되면 높은 점수
      if (title.toLowerCase().includes(tagName)) {
        score += 10;
      }

      // 내용에 포함되면 중간 점수
      if (content.toLowerCase().includes(tagName)) {
        score += 5;
      }

      // 단어 경계 기반 부분 일치 (예: "React" vs "Reaction")
      const wordBoundaryRegex = new RegExp(`\\b${tagName}\\b`, 'gi');
      const matches = normalizedText.match(wordBoundaryRegex);
      if (matches) {
        score += matches.length * 3;
      }

      // 특정 태그의 관련 키워드 매칭
      score += calculateRelatedKeywordScore(tagName, normalizedText);

      return { name: tag.name, score };
    });

    // 4. 점수가 높은 순서대로 정렬
    const sortedTags = tagMatches.filter((tag) => tag.score > 0).sort((a, b) => b.score - a.score);

    // 5. 상위 3-5개 태그 선택
    const selectedCount = Math.min(Math.max(3, sortedTags.length), 5);
    const selectedTags = sortedTags.slice(0, selectedCount).map((tag) => tag.name);

    return selectedTags.length > 0 ? selectedTags : [];
  } catch (error) {
    return [];
  }
}

/**
 * 태그와 관련된 키워드를 매칭하여 추가 점수 부여
 */
function calculateRelatedKeywordScore(tagName: string, text: string): number {
  const keywordMap: Record<string, string[]> = {
    // Frontend
    React: ['react', 'jsx', 'component', 'hooks', 'redux', 'nextjs', 'vercel'],
    Vue: ['vue', 'vuex', 'vite', 'nuxt'],
    'Next.js': ['next.js', 'nextjs', 'ssr', 'ssg', 'iam', 'vercel'],
    TypeScript: ['typescript', 'ts', '.ts', '.tsx', 'type', 'interface'],
    Angular: ['angular', 'typescript', 'rxjs', 'directive'],
    CSS: ['css', 'styling', 'tailwind', 'sass', 'scss', 'styled'],
    HTML: ['html', 'markup', 'dom', 'semantic'],

    // Backend
    'Node.js': ['node.js', 'nodejs', 'express', 'nest', 'npm'],
    Java: ['java', 'spring', 'gradle', 'maven', 'jvm'],
    Spring: ['spring', 'springboot', 'springcloud', 'java'],
    Python: ['python', 'django', 'flask', 'fastapi'],
    Go: ['golang', 'go lang', 'echo', 'gin'],
    PHP: ['php', 'laravel', 'symfony'],
    Kotlin: ['kotlin', 'android', 'jvm'],

    // Database
    PostgreSQL: ['postgresql', 'postgres', 'sql', 'psql'],
    MongoDB: ['mongodb', 'nosql', 'document'],
    MySQL: ['mysql', 'sql', 'relational'],
    Redis: ['redis', 'cache', 'session'],
    Elasticsearch: ['elasticsearch', 'search', 'elk'],
    Firebase: ['firebase', 'firestore', 'realtime'],

    // DevOps
    Docker: ['docker', 'container', 'dockerfile', 'dockercompose'],
    Kubernetes: ['kubernetes', 'k8s', 'container', 'orchestration'],
    AWS: ['aws', 'amazon', 'ec2', 's3', 'lambda'],
    GCP: ['gcp', 'google cloud', 'bigquery'],
    Azure: ['azure', 'microsoft', 'app service'],
    'CI/CD': ['ci/cd', 'jenkins', 'github actions', 'pipeline', 'deploy'],

    // Mobile
    'React Native': ['react native', 'react-native', 'mobile'],
    Flutter: ['flutter', 'dart', 'mobile'],
    iOS: ['ios', 'swift', 'objective-c', 'xcode'],
    Android: ['android', 'kotlin', 'java'],

    // AI/ML
    'AI/ML': ['ai', 'machine learning', 'ml', 'deep learning', 'neural'],
    'Machine Learning': ['machine learning', 'ml', 'sklearn', 'tensorflow'],
    'Deep Learning': ['deep learning', 'neural', 'tensorflow', 'pytorch'],
    NLP: ['nlp', 'natural language', 'text', 'bert'],
    'Computer Vision': ['computer vision', 'cv', 'image', 'opencv'],
    LLM: ['llm', 'large language model', 'gpt', 'chatgpt'],
    PyTorch: ['pytorch', 'torch', 'deep learning'],
    TensorFlow: ['tensorflow', 'keras', 'deep learning'],

    // Architecture & Patterns
    Architecture: ['architecture', 'design pattern', 'microservice', 'monolith'],
    Microservices: ['microservice', 'microservices', 'distributed'],
    'Event-Driven': ['event', 'event-driven', 'message', 'queue'],
    CQRS: ['cqrs', 'command query'],
    'Design Pattern': ['design pattern', 'pattern', 'architecture'],

    // Performance
    Performance: ['performance', 'optimization', 'benchmark', 'profiling', 'speed'],
    Optimization: ['optimization', 'optimize', 'performance', 'efficient'],
    Caching: ['cache', 'caching', 'redis', 'memcached'],

    // Security
    Security: ['security', 'encrypt', 'auth', 'token', 'ssl', 'tls', 'https'],
    Authentication: ['authentication', 'auth', 'login', 'jwt', 'oauth'],
    'Cyber Security': ['cybersecurity', 'security', 'exploit', 'vulnerability'],

    // Testing
    Testing: ['test', 'testing', 'jest', 'mocha', 'unit test', 'e2e'],
    'Unit Testing': ['unit test', 'jest', 'mocha'],
    'Integration Testing': ['integration test', 'e2e', 'integration'],

    // Other
    Agile: ['agile', 'scrum', 'sprint', 'kanban'],
    WebAssembly: ['webassembly', 'wasm', 'wasp'],
    GraphQL: ['graphql', 'query language', 'api'],
    REST: ['rest', 'restful', 'api'],
    API: ['api', 'endpoint', 'http', 'request'],
  };

  const keywords = keywordMap[tagName] || [];
  let score = 0;

  keywords.forEach((keyword) => {
    const regex = new RegExp(keyword, 'gi');
    const matches = text.match(regex);
    if (matches) {
      score += matches.length;
    }
  });

  return score;
}
