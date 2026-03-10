# 절대 금지 사항

> ⚠️ **이 규칙들은 프로젝트의 핵심 제약사항입니다. 반드시 준수해야 합니다.**

---

## 🚫 저작권 관련 금지사항

### 1. 개별 게시글 상세 페이지 생성 금지

**이유**: 저작권 이슈

- ❌ `/posts/[id]` 같은 상세 페이지 생성 금지
- ❌ 게시글 본문(content) 저장 금지
- ✅ 제목, URL, 요약만 저장
- ✅ "전체 읽기" 버튼으로 원본 블로그로 이동

### 2. 게시글 본문(content) 저장 금지

**이유**: 저작권 이슈

- ❌ RSS 피드의 본문 내용 DB 저장 금지
- ✅ 제목, URL, 요약(summary)만 저장
- ✅ 원본 블로그 링크로 이동

---

## 🚫 기술 제약사항

### 3. page.tsx에 'use client' 디렉티브 금지

**이유**: Next.js App Router 패턴, 메타데이터 설정 불가

- ❌ `'use client'`를 page.tsx에 작성 금지
- ✅ page.tsx는 항상 서버 컴포넌트
- ✅ 클라이언트 로직은 `features/{기능}/ui/`로 분리
- ✅ `export const metadata` 설정 가능

**잘못된 예**:

```typescript
// ❌ app/(pages)/posts/page.tsx
'use client'; // 금지!

export default function PostsPage() {
  const [state, setState] = useState(); // 클라이언트 훅
  return <div>...</div>;
}
```

**올바른 예**:

```typescript
// ✅ app/(pages)/posts/page.tsx (서버 컴포넌트)
import { PostsContainer } from '@/features/posts';

export const metadata = {
  title: '포스트 | devBlog.kr',
};

export default function PostsPage() {
  return <PostsContainer />;
}

// ✅ features/posts/ui/PostsContainer.tsx (클라이언트 컴포넌트)
'use client';

export function PostsContainer() {
  const [state, setState] = useState(); // 여기서 사용
  return <div>...</div>;
}
```

### 4. 새 태그를 AI로 생성 금지

**이유**: 일관성 유지, 비용 절감

- ❌ OpenAI API로 새 태그 생성 금지
- ❌ GPT에게 태그 추천 요청 금지
- ✅ `tags` 테이블의 사전정의 태그만 사용
- ✅ 키워드 매칭 기반 점수 계산
- ✅ 새 태그 추가는 관리자가 수동 등록

---

## 🎨 UI/UX 제약사항

### 5. 하드코딩 색상 사용 금지

**이유**: 다크모드 지원, 일관성

- ❌ `bg-blue-600`, `text-gray-900` 등 직접 색상 금지
- ❌ `dark:bg-gray-900` 같은 다크모드 직접 지정 금지
- ✅ CSS 변수 클래스 사용 (`bg-background`, `text-foreground`)
- ✅ `app/globals.css`의 CSS 변수 활용

**잘못된 예**:

```typescript
// ❌ 하드코딩
<div className="bg-blue-600 text-white dark:bg-gray-900">

</div>
```

**올바른 예**:

```typescript
// ✅ CSS 변수 클래스
<div className="bg-background text-foreground border-border">

</div>
```

**사용 가능한 CSS 변수 클래스**:

- 배경: `bg-background`, `bg-card`, `bg-muted`, `bg-secondary`
- 텍스트: `text-foreground`, `text-muted-foreground`
- 테두리: `border-border`
- 강조: `bg-foreground text-background` (검정↔흰 반전)
- 파괴: `text-destructive`

---

## 📝 코딩 규칙

### 6. Import 경로는 @/ alias 사용

**이유**: 가독성, 유지보수성

- ❌ `../../features/posts` 같은 상대 경로 금지
- ✅ `@/features/posts` 같은 절대 경로 사용

**잘못된 예**:

```typescript
// ❌
import { useToast } from '../../../hooks/useToast';
import { PostCard } from '../../features/posts/ui/PostCard';
```

**올바른 예**:

```typescript
// ✅
import { useToast } from '@/hooks';
import { PostCard } from '@/features/posts';
```

---

## 🏗️ 아키텍처 규칙

### 7. FSD 패턴 준수

**이유**: 코드 구조화, 유지보수성

- ✅ `features/{기능}/actions|services|hooks|ui` 구조
- ✅ 기능별로 독립적인 폴더 생성
- ❌ features/ 폴더에 page.tsx 생성 금지
- ❌ components/ 폴더에 비즈니스 로직 포함 금지

### 8. 상태 관리 구분

**이유**: 성능, 명확한 책임 분리

- ✅ **TanStack Query**: 서버 데이터 (게시글, 북마크 등)
- ✅ **Jotai**: UI 상태만 (모달, 메뉴, 토스트)
- ❌ Jotai에 서버 데이터 저장 금지
- ❌ TanStack Query 없이 fetch 직접 호출 금지

### 9. Export 방식

**이유**: Next.js 규칙, 일관성

- ✅ `app/` 경로: `export default function`
- ✅ `features/`, `components/`, `hooks/`, `utils/`: named export
- ❌ app/ 외부에서 default export 사용 금지

---

## 🔒 보안 규칙

### 10. 환경 변수 보호

- ❌ `.env.local` 파일을 Git에 커밋 금지
- ❌ CRON_SECRET, REVALIDATE_SECRET 노출 금지
- ❌ SUPABASE_SERVICE_ROLE_KEY 클라이언트에서 사용 금지
- ✅ 민감한 정보는 서버 컴포넌트/API Route에서만 사용

---

## 📚 관련 문서

- [코딩 컨벤션](../../docs/coding-conventions.md)
- [폴더 구조](../../docs/folder-structure.md)
- [Agent 가이드라인](../../docs/agent-guidelines.md)
