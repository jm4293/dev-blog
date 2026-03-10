# 코딩 컨벤션 (Coding Conventions)

devBlog.kr 프로젝트의 코딩 스타일 및 규칙을 설명합니다.

---

## 📝 TypeScript 규칙

### Strict Mode

- **활성화 필수**: `tsconfig.json`의 `strict: true`
- **엄격한 타입 체크**: `any` 사용 최소화

### 네이밍 컨벤션

| 대상              | 규칙             | 예시                            |
| ----------------- | ---------------- | ------------------------------- |
| 컴포넌트          | PascalCase       | `PostCard.tsx`                  |
| 함수/변수         | camelCase        | `fetchPosts`, `userId`          |
| 상수              | UPPER_SNAKE_CASE | `API_BASE_URL`, `MAX_PAGE_SIZE` |
| 타입/인터페이스   | PascalCase       | `Post`, `UserProfile`           |
| 파일명 (컴포넌트) | PascalCase       | `PostCard.tsx`                  |
| 파일명 (유틸)     | camelCase        | `formatDate.ts`                 |

**인터페이스 접두사:**

- ❌ `IPost`, `IUser` (불필요한 'I' 접두사)
- ✅ `Post`, `User`

---

## 📂 파일 구조 및 Export 방식

### 위치별 Export 규칙

#### 1. `app/` 경로 (페이지, 레이아웃, API 라우트)

- **export default function** 사용
- Next.js 규칙을 따름

```typescript
// app/(pages)/posts/page.tsx
export default function PostsPage() {
  return <div>...</div>;
}

// app/api/posts/route.ts
export async function GET(request: Request) {
  // ...
}
```

#### 2. `components/`, `features/`, `utils/` 등 (공유 코드)

- **function 키워드** 사용
- **Named export** 사용

```typescript
// components/posts/PostCard.tsx
interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return <div>...</div>;
}
```

#### 3. 각 폴더의 `index.ts` (배럴 export)

- **`export * from "./파일명"`** 형식
- 필요한 경우만 export (선택적)

```typescript
// components/posts/index.ts
export * from './PostCard';
export * from './PostList';
export * from './Pagination';
```

**효과:**

```typescript
// ❌ 복잡한 경로
import { PostCard } from '@/components/posts/PostCard';
import { Pagination } from '@/components/posts/Pagination';

// ✅ 간결한 경로
import { PostCard, Pagination } from '@/components/posts';
```

---

## ⚛️ React 컴포넌트

### 기본 규칙

- **Functional Components만 사용** (Class Component 금지)
- **Props는 interface로 정의**
- **Default Props는 구조 분해 할당에서 처리**

### 컴포넌트 구조

```typescript
// ✅ 좋은 예
interface PostCardProps {
  post: Post;
  onBookmark?: (postId: string) => void;
}

export function PostCard({ post, onBookmark }: PostCardProps) {
  // 1. Hooks (상단)
  const [isHovered, setIsHovered] = useState(false);

  // 2. 콜백 함수 (중간)
  const handleClick = () => {
    onBookmark?.(post.id);
  };

  // 3. JSX 반환 (하단)
  return (
    <div onMouseEnter={() => setIsHovered(true)}>
      {post.title}
    </div>
  );
}
```

### page.tsx 규칙

**중요:** page.tsx는 **항상 서버 컴포넌트**

- ❌ **`'use client'` 디렉티브 금지**
- ✅ **클라이언트 로직은 `features/{기능}/ui/`로 분리**

```typescript
// ✅ app/(pages)/posts/page.tsx (서버 컴포넌트)
import { PostsContainer } from '@/features/posts';

export const metadata = {
  title: '포스트',
  description: '모든 개발 블로그 포스트',
};

export default function PostsPage() {
  return <PostsContainer />;
}
```

```typescript
// ❌ 잘못된 예 (page.tsx에 'use client')
'use client';  // 금지!
import { useState } from 'react';

export default function RequestPage() {
  const [formData, setFormData] = useState(...);
  return ...;
}
```

---

## 🎣 Hooks 사용 규칙

### 콜백 함수: 화살표 함수 사용

```typescript
// ✅ 좋은 예
const mutation = useMutation({
  mutationFn: async (data) => {
    return await fetch('/api/posts', { method: 'POST', body: JSON.stringify(data) });
  },
  onSuccess: (result) => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  },
  onError: (error) => {
    console.error(error);
  },
});

// ❌ 나쁜 예: function 키워드
const mutation = useMutation({
  mutationFn: function (data) { ... },
});
```

### Custom Hooks

- **use 접두사 필수**
- **하나의 책임만** (단일 책임 원칙)

```typescript
// ✅ hooks/useDebounce.ts
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

---

## 🗂️ 상태 관리

### TanStack Query vs Jotai

| 용도        | 도구           | 예시                               |
| ----------- | -------------- | ---------------------------------- |
| 서버 데이터 | TanStack Query | 게시글, 북마크, 사용자 정보        |
| UI 상태     | Jotai          | 모바일 메뉴 열림/닫힘, 토스트 알림 |

### TanStack Query 패턴

```typescript
// lib/query-keys.ts (중앙 관리)
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

// features/posts/hooks/usePosts.ts
export function usePosts(filters: PostFilters) {
  return useQuery({
    queryKey: queryKeys.posts.list(filters),
    queryFn: () => fetchPosts(filters),
  });
}
```

### Jotai 패턴

```typescript
// atoms/mobileMenu.atom.ts
import { atom } from 'jotai';

export const mobileMenuOpenAtom = atom<boolean>(false);

// 사용
import { useAtom } from 'jotai';
import { mobileMenuOpenAtom } from '@/atoms';

export function MobileHamburger() {
  const [isOpen, setIsOpen] = useAtom(mobileMenuOpenAtom);

  return (
    <button onClick={() => setIsOpen(!isOpen)}>
      {isOpen ? '닫기' : '메뉴'}
    </button>
  );
}
```

---

## 🎨 스타일링

### Tailwind CSS 규칙

#### 기본 원칙

- **유틸리티 클래스 우선**: 인라인 className 사용
- **커스텀 CSS는 최소화**: globals.css만 사용
- **cn 유틸 사용**: 조건부 클래스와 className 병합
- **하드코딩 색상 금지**: `text-blue-600`, `bg-gray-900` 등 대신 CSS 변수 클래스 사용

#### 색상 규칙 (모노크롬 팔레트)

```typescript
// ❌ 하드코딩 색상 (blue tint, 다크모드 불일치)
<div className="bg-blue-600 text-white dark:bg-gray-900" />

// ✅ CSS 변수 기반 (다크/라이트 자동 전환)
<div className="bg-foreground text-background" />
<div className="bg-muted text-muted-foreground" />
<div className="border-border bg-card" />
```

| 의미          | 클래스                                   |
| ------------- | ---------------------------------------- |
| 강조 버튼     | `bg-foreground text-background`          |
| 보조 버튼     | `bg-muted text-foreground`               |
| 카드 배경     | `bg-card` / `glass-card`                 |
| 비활성 텍스트 | `text-muted-foreground`                  |
| 구분선        | `border-border`                          |
| 파괴적 액션   | `text-destructive` / `bg-destructive/10` |

#### 포커스 인디케이터

```typescript
// ❌ focus: (마우스 클릭에도 링 표시)
<button className="focus:outline-none focus:ring-2 focus:ring-blue-500" />

// ✅ focus-visible: (키보드 탐색에만 링 표시)
<button className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30" />
```

#### 애니메이션

```typescript
// ❌ transition-all (성능 저하)
<div className="transition-all duration-200" />

// ✅ 특정 속성만 (GPU composite 속성)
<div className="transition-[transform,opacity] duration-200" />
<div className="transition-colors duration-200" />
```

#### cn 유틸리티 (tailwind-merge + clsx)

`utils/cn.ts`는 **tailwind-merge**와 **clsx**를 결합하여 Tailwind 클래스 충돌을 방지합니다.

```typescript
// utils/cn.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**tailwind-merge의 역할:**

- Tailwind 클래스 충돌 해결 (예: `px-4 px-6` → `px-6`만 적용)
- 중복 클래스 제거

**사용 예시:**

```typescript
// ✅ 좋은 예: cn으로 조건부 클래스 적용
<div className={cn(
  'flex items-center gap-2',           // 기본 클래스
  isActive && 'bg-blue-500 text-white', // 조건부 클래스
  className                             // props로 받은 className 병합
)} />

// ❌ 나쁜 예: 문자열 연결 (충돌 해결 안 됨)
<div className={`flex items-center ${isActive ? 'bg-blue-500' : ''} ${className}`} />
```

**tailwind-merge가 해결하는 문제:**

```typescript
// tailwind-merge 없이
cn('px-4', 'px-6'); // 결과: "px-4 px-6" (둘 다 적용되어 충돌)

// tailwind-merge 사용
cn('px-4', 'px-6'); // 결과: "px-6" (나중 값이 우선)
```

#### Prettier의 Tailwind 클래스 자동 정렬

**prettier-plugin-tailwindcss**가 설치되어 있어 저장 시 자동으로 Tailwind 클래스를 정렬합니다.

**정렬 순서 (Tailwind 공식 권장):**

1. Layout (`container`, `flex`, `block`)
2. Position & Size (`mx-auto`, `h-16`, `w-full`)
3. Flexbox/Grid (`items-center`, `justify-between`)
4. Spacing (`px-4`, `py-2`, `gap-2`)
5. Typography (`text-xl`, `font-bold`)
6. Colors (`bg-white`, `text-gray-900`)
7. Effects (`backdrop-blur`, `shadow-md`)
8. Variants (`hover:*`, `dark:*`)

**예시:**

```typescript
// 자동 정렬 전
<div className="text-xl px-4 flex bg-white items-center dark:bg-gray-900" />

// 자동 정렬 후
<div className="flex items-center bg-white px-4 text-xl dark:bg-gray-900" />
```

**설정 파일:**

```json
// .prettierrc
{
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### 반응형 디자인

```typescript
// 모바일 우선
<div className="flex flex-col md:flex-row md:gap-4">
  {/* 모바일: 세로, 데스크탑: 가로 */}
</div>
```

---

## 🔗 Import 경로

### @ Alias 사용 필수

```typescript
// ❌ 상대 경로 (복잡함)
import { PostCard } from '../../../components/posts/PostCard';
import { formatDate } from '../../../../utils/date';

// ✅ @ Alias (간결함)
import { PostCard } from '@/components/posts';
import { formatDate } from '@/utils/date';
```

### Import 순서

1. React/Next.js
2. 외부 라이브러리
3. 내부 모듈 (@ alias)
4. 타입 import
5. 스타일

```typescript
// ✅ 좋은 예
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Post } from '@/features/posts/types';
import { PostCard } from '@/components/posts';
import { formatDate } from '@/utils/date';
```

---

## 📁 폴더 구조 규칙 (FSD)

### features/ 폴더 구조

```
features/{기능명}/
├── actions/          # Server Action (폼 제출 등)
│   ├── submit.ts
│   └── index.ts
├── services/         # API 호출, 비즈니스 로직
│   ├── fetch.ts
│   └── index.ts
├── hooks/            # React 훅 (services 래핑)
│   ├── useFeature.ts
│   └── index.ts
├── ui/               # 클라이언트 컴포넌트
│   ├── FeatureContainer.tsx
│   └── index.ts
├── types.ts          # 타입 정의
└── index.ts          # 배럴 export
```

### components/ vs features/

| 폴더          | 역할             | 로직 포함                 | 예시                   |
| ------------- | ---------------- | ------------------------- | ---------------------- |
| `components/` | 순수 UI (재사용) | ❌ 없음 (props만)         | Header, Footer, Button |
| `features/`   | 기능별 로직      | ✅ 있음 (hooks, services) | posts, bookmarks, auth |

---

## 🛡️ 타입 안전성

### Props 타입 정의

```typescript
// ✅ 좋은 예: interface 사용
interface PostCardProps {
  post: Post;
  onBookmark?: (postId: string) => void;
  className?: string;
}

// ❌ 나쁜 예: any 사용
function PostCard(props: any) { ... }
```

### API 응답 타입

```typescript
// features/posts/types.ts
export interface Post {
  id: string;
  title: string;
  url: string;
  summary: string;
  tags: string[];
  published_at: string;
  company: {
    name: string;
    logo_url: string;
  };
}

export interface PostsResponse {
  posts: Post[];
  totalCount: number;
  totalPages: number;
}
```

---

## 🧪 주석 및 문서화

### 주석 규칙

- **복잡한 로직에만 주석** (간단한 코드는 불필요)
- **"무엇을"이 아닌 "왜"를 설명**

```typescript
// ❌ 불필요한 주석
// 사용자 ID를 가져옴
const userId = user.id;

// ✅ 필요한 주석
// Cron Job에서 중복 수집 방지를 위해 URL로 중복 체크
const existingPost = await supabase.from('posts').select('id').eq('url', post.url).single();
```

### JSDoc (선택)

```typescript
/**
 * 게시글 목록을 조회합니다.
 * @param filters - 필터 조건 (태그, 회사, 검색어)
 * @returns 게시글 목록, 총 개수, 총 페이지 수
 */
export async function fetchPosts(filters: PostFilters): Promise<PostsResponse> {
  // ...
}
```

---

## 🔄 Commit Message

### 형식

```
<type>: <subject>

<body> (선택)
```

### Type 목록

| Type       | 설명        | 예시                                            |
| ---------- | ----------- | ----------------------------------------------- |
| `feat`     | 새 기능     | `feat: Push 알림 기능 추가`                     |
| `fix`      | 버그 수정   | `fix: 북마크 중복 저장 버그 수정`               |
| `refactor` | 리팩토링    | `refactor: features 폴더를 FSD 패턴으로 재구성` |
| `style`    | 스타일 변경 | `style: Prettier 적용`                          |
| `docs`     | 문서 수정   | `docs: README.md 업데이트`                      |
| `test`     | 테스트 추가 | `test: usePosts 훅 단위 테스트 추가`            |
| `chore`    | 기타 변경   | `chore: 의존성 업데이트`                        |

### 예시

```bash
feat: Push 알림 기능 추가

- push_subscriptions 테이블 마이그레이션
- /api/notifications/subscribe 엔드포인트 구현
- NotificationSettings 컴포넌트 추가
```

---

## 🔒 보안 규칙

### 환경 변수

```typescript
// ✅ 클라이언트 노출 가능
NEXT_PUBLIC_SUPABASE_URL;
NEXT_PUBLIC_SITE_URL;

// ❌ 서버에서만 사용 (절대 클라이언트 노출 금지)
SUPABASE_SERVICE_ROLE_KEY;
CRON_SECRET;
OPENAI_API_KEY;
```

### XSS 방지

```typescript
// ❌ 위험: dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ 안전: React 자동 이스케이프
<div>{userInput}</div>
```

---

## 📊 성능 최적화

### 동적 Import

```typescript
// ✅ 큰 컴포넌트는 동적 import
import dynamic from 'next/dynamic';

const ActivityHeatmap = dynamic(() => import('@/features/profile/components/ActivityHeatmap'), {
  ssr: false,
  loading: () => <div>로딩 중...</div>
});
```

### Memo 사용 (필요시만)

```typescript
import { memo } from 'react';

export const PostCard = memo(function PostCard({ post }: PostCardProps) {
  return <div>...</div>;
});
```

---

## 📚 관련 문서

- [Agent 가이드라인](./agent-guidelines.md) - AI Agent를 위한 규칙
- [폴더 구조](./folder-structure.md) - FSD 패턴 상세 설명
- [프로젝트 개요](./project-overview.md) - 프로젝트 맥락
