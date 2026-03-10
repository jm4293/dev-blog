# 폴더 구조

> **📁 FSD (Feature-Sliced Design) 패턴 기반 프로젝트 구조**
> 이 문서는 devBlog.kr 프로젝트의 폴더 구조와 각 디렉토리의 역할을 설명합니다.

---

## 🎯 FSD 패턴 개요

**Feature-Sliced Design**은 프론트엔드 아키텍처 패턴으로, 기능(Feature) 단위로 코드를 구조화합니다.

### 핵심 원칙

1. **기능별 격리**: 각 기능은 독립적인 폴더로 분리
2. **계층 구조**: features/{기능}/actions|services|hooks|ui
3. **단방향 의존성**: 상위 계층은 하위 계층만 참조
4. **공유 코드**: components/, hooks/, utils/는 모든 곳에서 사용 가능

---

## 📂 프로젝트 루트 구조

```
dev-blog/
├── app/                   # Next.js App Router (페이지, API)
├── features/              # 기능별 로직 (FSD 패턴)
├── components/            # 순수 UI 컴포넌트
├── atoms/                 # Jotai 전역 상태
├── hooks/                 # 공유 React 훅
├── utils/                 # 공유 유틸리티
├── lib/                   # 라이브러리 설정
├── supabase/              # Supabase 클라이언트 & 타입
├── public/                # 정적 자산
├── scripts/               # 빌드/배포 스크립트
├── docs/                  # 프로젝트 문서
├── .claude/               # Claude Code 설정
├── .github/               # GitHub Actions
├── middleware.ts          # Next.js 미들웨어
├── CLAUDE.md              # AI Agent 가이드
└── README.md              # 프로젝트 소개
```

---

## 📁 주요 폴더 상세

### 1. `app/` - Next.js App Router

Next.js 14의 App Router 방식을 따릅니다. 서버 컴포넌트 기본, 클라이언트 컴포넌트는 `'use client'` 명시.

```
app/
├── layout.tsx              # Root 레이아웃
├── loading.tsx             # 전역 로딩 UI
├── not-found.tsx           # 404 페이지
├── global-error.tsx        # 에러 페이지
├── robots.ts               # robots.txt 동적 생성
├── sitemap.ts              # sitemap.xml 동적 생성
├── schema.ts               # JSON-LD 스키마
├── GoogleAnalytics.tsx     # GA4 통합
│
├── (auth)/                 # 인증 관련 라우트
│   └── auth/
│       ├── callback/       # OAuth 콜백
│       └── login/          # 로그인 페이지
│
├── (pages)/                # 메인 페이지 그룹
│   ├── layout.tsx          # 공통 레이아웃
│   ├── posts/              # 게시글 목록 (메인)
│   ├── announcements/      # 공지사항
│   ├── bookmarks/          # 즐겨찾기
│   ├── recent-views/       # 최근 본 글
│   ├── profile/            # 프로필
│   ├── request/            # 블로그 추가 요청
│   ├── terms/              # 이용약관
│   └── privacy-policy/     # 개인정보처리방침
│
├── api/                    # API Routes
│   ├── posts/              # 게시글 API
│   ├── bookmarks/          # 즐겨찾기 API
│   ├── companies/          # 기업 API
│   ├── tags/               # 태그 API
│   ├── notifications/      # Push 알림 API
│   ├── recent-views/       # 최근 본 글 API
│   └── revalidate/         # ISR 캐시 갱신 API
│
└── feed.xml/               # RSS 피드 생성
```

**규칙:**

- ✅ page.tsx는 항상 서버 컴포넌트 (export default function)
- ✅ 클라이언트 로직은 features/{기능}/ui로 분리
- ❌ page.tsx에 'use client' 디렉티브 금지

---

### 2. `features/` - 기능별 로직 (FSD 패턴)

각 기능은 독립적인 폴더로 구성되며, 다음 하위 폴더를 가집니다:

```
features/{기능명}/
├── actions/          # Server Actions (폼 제출 등)
├── services/         # API 호출, 비즈니스 로직
├── hooks/            # React 훅 (TanStack Query)
├── ui/               # 클라이언트 컴포넌트
├── components/       # 기능 전용 컴포넌트 (선택)
└── types.ts          # 타입 정의 (선택)
```

#### 현재 구현된 기능

```
features/
├── posts/              # 게시글 기능
│   ├── components/     # PostCard, SearchBar, PopularTags 등
│   ├── hooks/          # usePosts, useSearchFilters, useTags
│   ├── services/       # fetch.ts, rss-parser.ts
│   ├── types/          # posts.types.ts
│   └── ui/             # PostsContainer, PostList
│
├── auth/               # 인증 기능
│   ├── actions/        # getUser, logout, withdraw
│   ├── hooks/          # useGitHubLogin, useLogout
│   └── ui/             # LoginCard, AnimatedBackground
│
├── bookmarks/          # 즐겨찾기 기능
│   ├── actions/        # createBookmark, deleteBookmark
│   ├── hooks/          # useBookmarkToggle, useBookmarksList
│   ├── services/       # fetch.ts
│   └── ui/             # BookmarkContainer, DateGridView
│
├── notifications/      # Push 알림 기능
│   ├── hooks/          # usePushSubscription, useNotificationPreferences
│   ├── services/       # fetch.ts, device-detect.ts
│   └── ui/             # NotificationSettings
│
├── announcements/      # 공지사항 기능
│   ├── hooks/          # useAnnouncements
│   ├── services/       # fetch.ts
│   └── ui/             # AnnouncementList, TypeBadge
│
├── recent-views/       # 최근 본 글 기능
│   ├── actions/        # createRecentView, deleteRecentView
│   ├── hooks/          # useRecentViews, useAddRecentView
│   ├── services/       # local-storage.types.ts
│   └── ui/             # RecentViewsList, RecentViewPostCard
│
├── profile/            # 프로필 기능
│   ├── components/     # ActivityHeatmap
│   ├── services/       # fetch.ts
│   └── ui/             # ProfileClient, ProfileInfoCard
│
├── request/            # 블로그 추가 요청 기능
│   ├── actions/        # requestSubmit.action.ts
│   ├── hooks/          # useSubmitRequest
│   └── ui/             # RequestForm
│
└── ai/                 # AI 기능
    └── services/       # openai.ts, tag-selector.ts
```

**규칙:**

- ✅ function 키워드 + named export
- ✅ 각 기능은 index.ts로 배럴 export
- ✅ TanStack Query를 hooks/에서 사용
- ❌ 다른 feature에 직접 의존하지 않음

---

### 3. `components/` - 순수 UI 컴포넌트

기능에 종속되지 않는 재사용 가능한 UI 컴포넌트.

```
components/
├── layout/             # 레이아웃 컴포넌트
│   ├── Header.tsx      # 모바일 헤더
│   ├── Sidebar.tsx     # 데스크탑 사이드바 (GSAP)
│   ├── Footer.tsx      # 푸터
│   └── MobileMenu.tsx  # 모바일 메뉴
│
├── image/              # 이미지 컴포넌트
│   └── BlogLogoImage.tsx
│
├── search/             # 검색/필터 UI
│   ├── BlogFilterModal.tsx
│   ├── TagFilterModal.tsx
│   └── SortButton.tsx
│
├── pagination/         # 페이지네이션
│   ├── Pagination.tsx
│   ├── PaginationButton.tsx
│   └── PaginationPageNumber.tsx
│
├── skeleton/           # 로딩 스켈레톤
│   ├── CardSkeleton.tsx
│   ├── GridSkeleton.tsx
│   └── PageLoadingSpinner.tsx
│
├── modal/              # 모달 컴포넌트
│   └── DeleteAccountConfirmModal.tsx
│
├── toast/              # 토스트 알림
│   └── ToastContainer.tsx
│
├── theme/              # 테마 토글
│   └── ThemeToggle.tsx
│
└── ui/                 # 공통 UI
    ├── EmptyState.tsx
    └── FilterModal.tsx
```

**규칙:**

- ✅ Props를 통한 데이터 수신만
- ✅ function 키워드 + named export
- ❌ 비즈니스 로직 포함 금지
- ❌ API 호출 금지

---

### 4. `atoms/` - Jotai 전역 상태

최소한의 UI 상태만 관리. 서버 데이터는 TanStack Query 사용.

```
atoms/
├── mobileMenu.atom.ts  # 모바일 메뉴 열림/닫힘
├── toast.atom.ts       # 토스트 알림 상태
└── index.ts            # 배럴 export
```

**규칙:**

- ✅ UI 상태만 (모달, 메뉴, 토스트)
- ❌ 서버 데이터는 TanStack Query 사용
- ❌ 과도한 전역 상태 금지

---

### 5. `hooks/` - 공유 React 훅

모든 기능에서 사용 가능한 공통 훅.

```
hooks/
├── useDebounce.ts      # 디바운스 훅
├── useIsMobile.ts      # 모바일 감지 훅
├── useToast.ts         # 토스트 훅
├── useTheme.ts         # 테마 토글 훅
└── index.ts            # 배럴 export
```

**규칙:**

- ✅ 기능에 종속되지 않은 훅만
- ✅ named export
- ❌ 특정 기능 전용 훅은 features/{기능}/hooks/

---

### 6. `utils/` - 공유 유틸리티

순수 함수로 구성된 유틸리티 모듈.

```
utils/
├── cn.ts               # className 유틸
├── constants.ts        # 상수 정의
├── date.ts             # 날짜 포맷팅
├── format-date.ts      # 날짜 형식 변환
├── local-storage.ts    # 로컬 스토리지 헬퍼
├── rate-limit.ts       # Rate Limiting
├── url.ts              # URL 처리
└── index.ts            # 배럴 export
```

**규칙:**

- ✅ 순수 함수만
- ✅ named export
- ❌ React 훅이나 컴포넌트 포함 금지

---

### 7. `supabase/` - Supabase 클라이언트 & 타입

데이터베이스 접근 및 인증 관련 코드.

```
supabase/
├── client.supabase.ts      # 클라이언트용 Supabase
├── server.supabase.ts      # 서버용 Supabase
├── types.supabase.ts       # DB 타입 (자동 생성)
├── index.ts                # 배럴 export
└── migrations/             # DB 마이그레이션
    ├── 001_initial.sql
    ├── 002_add_companies.sql
    └── ... (15개 파일)
```

**규칙:**

- ✅ 클라이언트/서버 구분
- ✅ types.supabase.ts는 자동 생성 (수동 수정 금지)
- ❌ 비즈니스 로직 포함 금지

---

### 8. `lib/` - 라이브러리 설정

외부 라이브러리 초기화 및 설정.

```
lib/
├── query-keys.ts       # TanStack Query 키 정의
└── gtag.ts             # Google Analytics
```

**규칙:**

- ✅ 라이브러리 래퍼 또는 설정만
- ✅ named export
- ❌ 비즈니스 로직 금지

---

### 9. `public/` - 정적 자산

빌드 시 그대로 배포되는 정적 파일.

```
public/
├── company_logos/          # 32개 기업 로고 (WebP)
├── sw.js                   # Service Worker (Push 알림)
├── favicon.ico
├── apple-touch-icon.png
├── manifest.json
└── ... (기타 아이콘)
```

**규칙:**

- ✅ 이미지는 WebP 포맷 우선
- ✅ /public 경로는 빌드 시 루트로 매핑
- ❌ 코드 파일 포함 금지

---

### 10. `scripts/` - 빌드/배포 스크립트

Node.js 스크립트 파일.

```
scripts/
├── convert-to-webp.js      # 이미지 WebP 변환
└── fetch-posts.ts          # GitHub Actions용 (예정)
```

---

### 11. `docs/` - 프로젝트 문서

프로젝트 관련 모든 문서.

```
docs/
├── README.md                   # 문서 인덱스
├── project-overview.md         # 프로젝트 개요
├── agent-guidelines.md         # AI Agent 가이드라인
├── techstack.md                # 기술 스택
├── folder-structure.md         # 이 문서
├── features.md                 # 핵심 기능
├── coding-conventions.md       # 코딩 컨벤션
├── database-schema.md          # DB 스키마
├── api-specification.md        # API 명세
├── environment-setup.md        # 환경 변수
├── isr-setup-guide.md          # ISR 설정
├── push-notifications.md       # Push 알림
├── seo-strategy.md             # SEO 전략
├── community-intro.md          # 커뮤니티 소개
├── promotion-templates.md      # 홍보 템플릿
└── google-search-console-redirect-error.md
```

---

### 12. `.claude/` - Claude Code 설정

AI Agent를 위한 설정 및 규칙.

```
.claude/
├── CLAUDE.md                   # 프로젝트 가이드 (메인)
└── skills/                     # Vercel 베스트 프랙티스
    ├── web-design-guidelines/
    ├── vercel-react-best-practices/
    └── vercel-composition-patterns/
```

---

## 🔄 파일 간 의존성 흐름

```
page.tsx (서버 컴포넌트)
  ↓
features/{기능}/ui/{Container}.tsx (클라이언트 컴포넌트)
  ↓
features/{기능}/hooks/use{Feature}.ts (TanStack Query)
  ↓
features/{기능}/services/fetch.ts (API 호출)
  ↓
app/api/{feature}/route.ts (API Route)
  ↓
supabase/server.supabase.ts (DB 접근)
```

---

## 📝 새 기능 추가 시 폴더 생성 가이드

### 예: "댓글" 기능 추가

1. **features/comments/ 폴더 생성**

```
features/comments/
├── actions/
│   ├── createComment.action.ts
│   └── deleteComment.action.ts
├── hooks/
│   ├── useComments.ts
│   ├── useAddComment.ts
│   └── index.ts
├── services/
│   ├── fetch.ts
│   └── index.ts
├── ui/
│   ├── CommentList.tsx
│   ├── CommentForm.tsx
│   └── index.ts
└── index.ts
```

2. **app/api/comments/ API 생성**

```
app/api/comments/
├── route.ts              # GET, POST
└── [id]/
    └── route.ts          # PUT, DELETE
```

3. **components/ 재사용 컴포넌트 (필요시)**

```
components/comment/
├── CommentCard.tsx
└── index.ts
```

---

## 🚀 빠른 참조

### Import 경로 규칙

```typescript
// ✅ 올바른 예
import { PostCard } from '@/features/posts';
import { useToast } from '@/hooks';
import { cn } from '@/utils';
import { createSupabaseClient } from '@/supabase';

// ❌ 잘못된 예
import { PostCard } from '../../features/posts/ui/PostCard';
import { useToast } from '../../../hooks/useToast';
```

### Export 방식

```typescript
// ✅ features/, components/, hooks/, utils/
export function PostCard() { ... }
export function useToast() { ... }

// ✅ app/ 경로 (page.tsx, layout.tsx, route.ts)
export default function PostsPage() { ... }
export async function GET(request: Request) { ... }
```

---

## 📚 관련 문서

- [코딩 컨벤션](./coding-conventions.md) - 네이밍, 타입, export 규칙
- [핵심 기능](./features.md) - 각 기능의 상세 명세
- [Agent 가이드라인](./agent-guidelines.md) - AI Agent 작업 규칙
- [데이터베이스 스키마](./database-schema.md) - DB 구조

---

**마지막 업데이트**: 2026년 3월 10일
