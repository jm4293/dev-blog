# devBlog.kr - AI Agent 가이드

> **🤖 AI Agent 자동 참조 문서**
> 이 파일은 모든 AI Agent가 작업 시작 시 자동으로 읽습니다.

---

## ⚠️ 필수 읽기 - 핵심 제약사항

### 프로젝트 타입

- **큐레이션 플랫폼**: 외부 블로그를 수집/필터링 (콘텐츠 생성 X)
- **자동 수집**: 매일 15:00, 21:00 KST, GitHub Actions
- **32개 기업 블로그**: Toss, Kakao, Naver, 우아한형제들 등

### 절대 금지 사항 ❌

1. **개별 게시글 상세 페이지 생성 금지** (저작권 이슈)
2. **게시글 본문(content) 저장 금지** (제목, URL, 요약만)
3. **page.tsx에 'use client' 디렉티브 금지** (항상 서버 컴포넌트)
4. **새 태그를 AI로 생성 금지** (tags 테이블 사전정의만)
5. **하드코딩 색상 사용 금지** (`bg-blue-600`, `dark:bg-gray-900` 등 → CSS 변수 클래스 사용)

### 필수 준수 패턴 ✅

1. **Import 경로**: `@/` alias 사용 (상대 경로 `../../` 금지)
2. **FSD 패턴**: features/{기능}/actions|services|hooks|ui 구조
3. **상태 관리**: TanStack Query (서버), Jotai (UI만)
4. **Export 방식**: app은 default, 나머지는 named export

**상세 규칙**: `.claude/rules/00-critical.md` 참조

---

## 🔧 즉시 참고할 Skills

프로젝트에 설치된 Vercel 베스트 프랙티스 Skills:

- `.claude/skills/vercel-react-best-practices/` - React 성능 최적화
- `.claude/skills/vercel-composition-patterns/` - 컴포넌트 패턴
- `.claude/skills/web-design-guidelines/` - UI/UX 가이드라인

**작업 전 확인**: 해당 skills 폴더의 SKILL.md 읽고 적용

---

## 🚀 빠른 시작

### 새로운 Agent가 프로젝트를 시작할 때

1. **[프로젝트 개요](./docs/core/project-overview.md)** - 프로젝트 목적과 제약 사항
2. **[Agent 가이드라인](./docs/core/agent-guidelines.md)** - Agent를 위한 필수 규칙
3. **[폴더 구조](./docs/core/folder-structure.md)** - FSD 패턴 및 디렉토리
4. **[코딩 컨벤션](./docs/core/coding-conventions.md)** - 코딩 스타일 및 규칙

### 기능 추가/수정 시

1. **[핵심 기능](./docs/core/features.md)** - 기존 기능 명세 확인
2. **[데이터베이스 스키마](./docs/technical/database-schema.md)** - 테이블 구조 및 RLS 정책
3. **[API 명세](./docs/technical/api-specification.md)** - REST API 엔드포인트
4. **[코딩 컨벤션](./docs/core/coding-conventions.md)** - 규칙 준수

---

## 📚 문서 목록

### 핵심 문서

| 문서                                                    | 설명                           | 대상              |
| ------------------------------------------------------- | ------------------------------ | ----------------- |
| **[프로젝트 개요](./docs/core/project-overview.md)**    | 프로젝트 목적, 목표, 제약 사항 | 모든 Agent        |
| **[Agent 가이드라인](./docs/core/agent-guidelines.md)** | AI Agent를 위한 작업 규칙      | 모든 Agent        |
| **[핵심 기능](./docs/core/features.md)**                | 주요 기능 명세 및 구현 상세    | 기능 추가/수정 시 |
| **[폴더 구조](./docs/core/folder-structure.md)**        | FSD 패턴 및 디렉토리 설명      | 파일 배치 시      |
| **[코딩 컨벤션](./docs/core/coding-conventions.md)**    | 네이밍, export 방식, 타입 규칙 | 코드 작성 시      |

### 기술 문서

| 문서                                                           | 설명                             | 대상              |
| -------------------------------------------------------------- | -------------------------------- | ----------------- |
| **[기술 스택](./docs/technical/techstack.md)**                 | 사용된 기술 상세 설명            | 기술 이해 필요 시 |
| **[데이터베이스 스키마](./docs/technical/database-schema.md)** | 테이블 구조, RLS 정책, 쿼리 예시 | DB 작업 시        |
| **[API 명세](./docs/technical/api-specification.md)**          | REST API 엔드포인트, 요청/응답   | API 추가/수정 시  |
| **[환경 변수 가이드](./docs/technical/environment-setup.md)**  | .env 설정 및 Vercel 환경 변수    | 환경 설정 시      |
| **[ISR 설정 가이드](./docs/technical/isr-setup-guide.md)**     | ISR 캐시 갱신 및 성능 최적화     | 성능 개선 시      |
| **[Push 알림 가이드](./docs/technical/push-notifications.md)** | Web Push 구현 상세               | Push 알림 작업 시 |

---

## 🗂️ 프로젝트 구조 개요

```
dev-blog/
├── docs/                   # 📚 모든 문서
├── app/                    # Next.js App Router
│   ├── (pages)/            # 페이지 그룹
│   └── api/                # API Routes
├── features/               # 기능별 로직 (FSD 패턴) ⭐
│   ├── posts/
│   ├── bookmarks/
│   ├── auth/
│   └── ... (총 9개)
├── components/             # 순수 UI 컴포넌트
├── atoms/                  # Jotai 전역 상태 (최소 사용)
├── hooks/                  # 공유 React 훅
├── utils/                  # 공유 유틸리티
├── lib/                    # 라이브러리 설정
├── supabase/               # Supabase 클라이언트 & 타입
├── .claude/                # Claude Code 설정
│   └── rules/              # 규칙 파일들 ⭐
└── README.md
```

**상세 구조**: [폴더 구조 문서](./docs/core/folder-structure.md)

---

## 🛠 기술 스택 (간략)

### Frontend

- Next.js 14.2.0 (App Router), TypeScript 5
- Tailwind CSS 3.4.0 + shadcn/ui
- TanStack Query 5.90.16 (주요 상태 관리)
- Jotai 2.16.1 (UI 상태만)

### Backend

- Supabase (PostgreSQL + Auth)
- Vercel (Hosting + Cron)
- OpenAI 6.15.0 (태그 선택)

**상세 내용**: [기술 스택 문서](./docs/technical/techstack.md)

---

## 🎯 핵심 기능 (요약)

1. **블로그 자동 수집** - GitHub Actions (매일 15:00, 21:00 KST)
2. **태그 자동 선택** - 키워드 기반 (AI 생성 X)
3. **인증 및 즐겨찾기** - GitHub OAuth + Supabase
4. **검색 및 필터링** - 텍스트 검색 + 태그/회사 필터
5. **페이지네이션** - 페이지 번호 기반 (20개/페이지)
6. **ISR 캐시 갱신** - 새 글 수집 시 즉시 반영
7. **Push 알림** - Web Push API (계획)

**상세 내용**: [핵심 기능 문서](./docs/core/features.md)

---

## 📝 코딩 컨벤션 (핵심만)

### Import 경로

```typescript
// ✅ 올바른 예
import { PostCard } from '@/features/posts';
import { useToast } from '@/hooks';

// ❌ 잘못된 예
import { PostCard } from '../../features/posts/ui/PostCard';
```

### Export 방식

```typescript
// ✅ app/ 경로
export default function PostsPage() { ... }

// ✅ features/, components/, hooks/, utils/
export function PostCard() { ... }
export function useToast() { ... }
```

### page.tsx 규칙

```typescript
// ✅ app/(pages)/posts/page.tsx (서버 컴포넌트)
import { PostsContainer } from '@/features/posts';

export const metadata = { title: '포스트' };

export default function PostsPage() {
  return <PostsContainer />;
}
```

**상세 내용**: [코딩 컨벤션 문서](./docs/core/coding-conventions.md)

---

## 🔐 환경 변수 (필수만)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# OpenAI
OPENAI_API_KEY=...

# 보안
CRON_SECRET=...
REVALIDATE_SECRET=...
```

**상세 내용**: [환경 변수 가이드](./docs/technical/environment-setup.md)

---

## 📞 연락처

- **개발자**: jm4293
- **도메인**: devBlog.kr
- **GitHub**: [https://github.com/jm4293/dev-blog]

---

**마지막 업데이트**: 2026년 3월 10일
