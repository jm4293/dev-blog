# AI Agent 작업 가이드라인

> 이 문서는 **AI Agent가 devBlog.kr 프로젝트를 작업할 때 참고해야 할 핵심 규칙**입니다.

---

## 🎯 프로젝트 이해

### 프로젝트 타입

- **큐레이션 플랫폼**: 개별 게시글을 작성하지 않고 외부 블로그를 수집/필터링
- **자동화**: Vercel Cron으로 매일 00:00 KST에 새 글 수집
- **기술 스택**: Next.js 14 (App Router), TypeScript, Supabase, TanStack Query

### 제약 사항

- ❌ **개별 게시글 상세 페이지 없음** (저작권 + 트래픽 이슈)
- ❌ **게시글 본문 저장 안 함** (제목, URL, 요약만)
- ✅ **태그는 사전정의된 테이블만 사용** (AI로 새 태그 생성 안 함)

---

## 📁 폴더 구조 (FSD 패턴)

### 핵심 규칙

1. **app/**: Next.js 라우팅 파일만 (page.tsx, layout.tsx, route.ts)
2. **features/**: 기능별 로직 (actions, hooks, services, ui)
3. **components/**: 순수 UI (로직 없음, props만 받음)
4. **atoms/**: Jotai 상태 (UI 상태만, 서버 상태는 TanStack Query)
5. **utils/**, **hooks/**, **lib/**: 공유 유틸리티

### 새 기능 추가 시 구조

```
features/{기능명}/
├── actions/         # Server Action (폼 제출 등)
├── services/        # API 호출, 비즈니스 로직
├── hooks/           # React 훅 (services 래핑)
├── ui/              # 클라이언트 컴포넌트 (페이지 레벨)
├── components/      # (선택) 작은 UI 조각들
├── types.ts         # 타입 정의
└── index.ts         # 배럴 export
```

**components/ vs ui/ 구분 (선택 사항)**

- **ui/**: 페이지 단위 컨테이너, 큰 컴포넌트 (PostsContainer, ProfileClient 등)
- **components/**: 작은 UI 조각들 (BookmarkButton, ActiveFilters 등)
- 대부분 features는 `ui/`만 사용 (components는 선택)
- **예시**:
  - `features/posts/` → ui/ + components/ (복잡도 높음)
  - `features/auth/` → ui/만 (간단함)

**예시: 새 기능 "comments" 추가**

```typescript
// features/comments/services/fetch.ts
export async function fetchComments(postId: string) { ... }

// features/comments/hooks/useComments.ts
export function useComments(postId: string) {
  return useQuery({ ... });
}

// features/comments/ui/CommentList.tsx
'use client';
export function CommentList({ postId }) {
  const { data } = useComments(postId);
  return <div>...</div>;
}

// features/comments/index.ts
export * from './hooks';
export * from './ui';
```

---

## 🛠️ 코딩 컨벤션

### 파일명

- **컴포넌트**: PascalCase (PostCard.tsx)
- **유틸리티**: camelCase (formatDate.ts)
- **페이지**: page.tsx, layout.tsx (Next.js 규칙)

### Export 방식

- **app/ 경로**: `export default function`
- **features/, components/**: `export function`, Named export
- **각 폴더에 index.ts**: 배럴 export로 import 경로 단순화

```typescript
// ❌ 나쁜 예: 상대 경로 import
import { PostCard } from '../../../components/posts/PostCard';

// ✅ 좋은 예: @ alias 사용
import { PostCard } from '@/components/posts';
```

### page.tsx 규칙

- **항상 서버 컴포넌트** (`'use client'` 금지)
- 클라이언트 로직은 `features/{기능}/ui/` 컴포넌트로 분리
- page.tsx는 메타데이터 설정, 레이아웃 구성, 클라이언트 컴포넌트 렌더링만

```typescript
// ✅ app/(pages)/posts/page.tsx (서버 컴포넌트)
import { PostsContainer } from '@/features/posts';

export const metadata = { title: '포스트' };

export default function PostsPage() {
  return <PostsContainer />;
}
```

### 상태 관리

- **TanStack Query**: 서버 데이터 (게시글, 북마크, 사용자 정보)
- **Jotai**: UI 상태만 (모바일 메뉴, 토스트, 사이드바 상태)
- **Query Key**: `lib/query-keys.ts`에 중앙 관리

```typescript
// lib/query-keys.ts
export const queryKeys = {
  posts: {
    all: ['posts'] as const,
    list: (filters: PostFilters) => ['posts', 'list', filters] as const,
  },
  bookmarks: {
    all: ['bookmarks'] as const,
    list: (userId: string) => ['bookmarks', 'list', userId] as const,
  },
};
```

### 콜백 함수

- **화살표 함수 사용** (useMutation, useQuery 등)
- 간결하고 명확한 변수명

```typescript
// ✅ 좋은 예
const mutation = useMutation({
  mutationFn: async (data) => { ... },
  onSuccess: (result) => { ... },
  onError: (error) => { ... },
});

// ❌ 나쁜 예: function 키워드
const mutation = useMutation({
  mutationFn: function (data) { ... },
});
```

---

## 🗃️ 데이터베이스 작업

### Supabase 클라이언트

- **서버**: `createSupabaseServerClient()` (@/supabase/server.supabase)
- **클라이언트**: `createSupabaseBrowserClient()` (@/supabase/client.supabase)

### RLS 정책

- **posts**: 모든 사용자 읽기 가능
- **bookmarks**: 사용자별 CRUD (auth.uid() 확인)
- **push_subscriptions, notification_preferences**: 사용자별 관리

### 새 테이블 추가 시

1. **마이그레이션 파일 생성**: `supabase/migrations/{timestamp}_{name}.sql`
2. **RLS 정책 설정**: 보안 필수
3. **타입 자동 생성**: `npx supabase gen types typescript`

---

## 🔒 보안 주의사항

### 환경 변수

- **NEXT*PUBLIC*\***: 클라이언트 노출 가능
- **그 외**: 서버에서만 사용 (API Route, Server Component)
- **.env.local**: Git 제외 (`.gitignore`에 포함)

### API 보안

- **Cron Job**: `CRON_SECRET` 인증 필수
- **인증 필요 API**: `auth.uid()` 확인
- **Rate Limiting**: `utils/rate-limit.ts` 사용

### XSS 방지

- React의 자동 이스케이프 활용
- `dangerouslySetInnerHTML` 사용 금지 (특별한 경우 제외)

---

## 🚀 배포 & 운영

### Git 브랜치

- **main**: 프로덕션 배포 (자동 배포)
- **refactor/fsd-structure**: 현재 작업 브랜치 (FSD 패턴 적용)

### Vercel 배포

- **자동 배포**: main 브랜치 push 시 자동
- **환경 변수**: Vercel 대시보드에서 설정
- **Cron Job**: `vercel.json`에 정의

### Sentry 모니터링

- **에러 트래킹**: 자동 전송
- **성능 모니터링**: Core Web Vitals
- **배포별 추적**: Release 태그

---

## 📝 문서 업데이트 규칙

### 코드 변경 시 함께 업데이트할 문서

- **새 기능 추가**: `docs/features.md` 업데이트
- **DB 스키마 변경**: `docs/database-schema.md` 업데이트
- **API 엔드포인트 변경**: `docs/api-specification.md` 업데이트
- **폴더 구조 변경**: `docs/folder-structure.md` 업데이트

### Commit Message 규칙

```
feat: 새 기능
fix: 버그 수정
refactor: 리팩토링
style: 스타일 변경
docs: 문서 수정
test: 테스트 추가
chore: 기타 변경
```

---

## 🔄 작업 흐름

### 1. 문제 파악

- 사용자 요청 명확히 이해
- 관련 문서 먼저 읽기 (docs/)
- 프로젝트 제약 사항 확인

### 2. 코드 탐색

- `search_subagent`로 관련 코드 찾기
- 기존 패턴 확인 (features/ 폴더 참고)
- 유사한 기능이 있는지 검색

### 3. 구현

- FSD 패턴 준수 (actions/services/hooks/ui 분리)
- TypeScript 타입 정의 (types.ts)
- 에러 처리 및 로딩 상태 추가

### 4. 테스트

- 로컬에서 빌드 확인: `npm run build`
- 타입 체크: `npm run type-check`
- 에러 없는지 확인: `npm run lint`

### 5. 문서화

- 관련 문서 업데이트 (docs/)
- 주석 추가 (복잡한 로직만)
- README.md 업데이트 (필요시)

---

## ⚠️ 자주 하는 실수

### 1. page.tsx에 'use client' 추가

- ❌ **절대 안 됨**: page.tsx는 서버 컴포넌트
- ✅ **해결**: 클라이언트 로직을 `features/{기능}/ui/`로 분리

### 2. 상대 경로 import

- ❌ `import { PostCard } from '../../../components/posts/PostCard';`
- ✅ `import { PostCard } from '@/components/posts';`

### 3. 새 태그를 AI로 생성

- ❌ **금지**: tags 테이블에 사전정의된 태그만 사용
- ✅ **해결**: 키워드 매칭으로 기존 태그 선택

### 4. 게시글 본문 저장

- ❌ **금지**: 저작권 이슈, 용량 이슈
- ✅ **저장 가능**: 제목, URL, 요약 (summary), 태그

### 5. Jotai로 서버 데이터 관리

- ❌ **잘못**: 게시글, 북마크를 Jotai atom에 저장
- ✅ **올바름**: TanStack Query 사용

### 6. 색상 하드코딩

- ❌ **잘못**: `bg-blue-600`, `text-blue-400`, `dark:bg-gray-900` 등 직접 색상 사용
- ✅ **올바름**: `bg-foreground`, `text-muted-foreground`, `bg-card` 등 CSS 변수 클래스 사용
- 이유: Tailwind 기본 `gray`는 blue tint가 있어 다크모드에서 색조가 어긋남 (프로젝트에서 neutral gray로 재정의됨)

### 7. 레이아웃 구조

- **`app/(pages)/layout.tsx`**: `SidebarLayout`으로 감쌈
- **데스크탑(md↑)**: 좌측 고정 사이드바 (`Sidebar.tsx`, hover 시 GSAP으로 확장)
- **모바일(md↓)**: 상단 고정 헤더 (`Header.tsx`) + 햄버거 메뉴
- 새 레이아웃 컴포넌트 추가 시 `SidebarLayout` 구조 유지 필수

---

## 📚 필독 문서

- **[프로젝트 개요](./project-overview.md)** - 프로젝트 목적 및 제약 사항
- **[폴더 구조](./folder-structure.md)** - FSD 패턴 상세 설명
- **[코딩 컨벤션](./coding-conventions.md)** - 네이밍, export 방식
- **[데이터베이스 스키마](./database-schema.md)** - 테이블 구조, RLS 정책
- **[SEO 전략](./seo-strategy.md)** - 큐레이션 플랫폼 SEO 방법

---

## 🆘 도움이 필요할 때

1. **문서 먼저 읽기**: `docs/` 폴더
2. **유사 코드 찾기**: `features/` 폴더에서 패턴 참고
3. **Supabase 문서**: https://supabase.com/docs
4. **Next.js 문서**: https://nextjs.org/docs
5. **TanStack Query 문서**: https://tanstack.com/query/latest/docs

---

**마지막 업데이트**: 2026년 2월 19일
