# devBlog.kr - AI Agent 프로젝트 가이드

> **🤖 AI Agent 자동 참조 문서**  
> 이 파일은 모든 AI Agent가 작업 시작 시 자동으로 읽습니다. 핵심 규칙과 제약사항을 최상단에 명시합니다.

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

1. **[프로젝트 개요](./docs/project-overview.md)** - 프로젝트 목적과 제약 사항 이해
2. **[Agent 가이드라인](./docs/agent-guidelines.md)** - Agent를 위한 필수 규칙
3. **[폴더 구조](./docs/folder-structure.md)** - FSD 패턴 및 디렉토리 구조
4. **[코딩 컨벤션](./docs/coding-conventions.md)** - 코딩 스타일 및 규칙

### 기능 추가/수정 시

1. **[핵심 기능](./docs/features.md)** - 기존 기능 명세 확인
2. **[데이터베이스 스키마](./docs/database-schema.md)** - 테이블 구조 및 RLS 정책
3. **[API 명세](./docs/api-specification.md)** - REST API 엔드포인트
4. **[코딩 컨벤션](./docs/coding-conventions.md)** - 규칙 준수

---

## 📚 문서 목록

### 핵심 문서

| 문서                                               | 설명                           | 대상              |
| -------------------------------------------------- | ------------------------------ | ----------------- |
| **[프로젝트 개요](./docs/project-overview.md)**    | 프로젝트 목적, 목표, 제약 사항 | 모든 Agent        |
| **[Agent 가이드라인](./docs/agent-guidelines.md)** | AI Agent를 위한 작업 규칙      | 모든 Agent        |
| **[기술 스택](./docs/techstack.md)**               | 사용된 기술 상세 설명          | 기술 이해 필요 시 |
| **[핵심 기능](./docs/features.md)**                | 주요 기능 명세 및 구현 상세    | 기능 추가/수정 시 |
| **[폴더 구조](./docs/folder-structure.md)**        | FSD 패턴 및 디렉토리 설명      | 파일 배치 시      |
| **[코딩 컨벤션](./docs/coding-conventions.md)**    | 네이밍, export 방식, 타입 규칙 | 코드 작성 시      |

### 기술 문서

| 문서                                                 | 설명                             | 대상             |
| ---------------------------------------------------- | -------------------------------- | ---------------- |
| **[데이터베이스 스키마](./docs/database-schema.md)** | 테이블 구조, RLS 정책, 쿼리 예시 | DB 작업 시       |
| **[API 명세](./docs/api-specification.md)**          | REST API 엔드포인트, 요청/응답   | API 추가/수정 시 |
| **[환경 변수 가이드](./docs/environment-setup.md)**  | .env 설정 및 Vercel 환경 변수    | 환경 설정 시     |
| **[ISR 설정 가이드](./docs/isr-setup-guide.md)**     | ISR 캐시 갱신 및 성능 최적화     | 성능 개선 시     |

### 마케팅 & SEO

| 문서                                             | 설명                       | 대상        |
| ------------------------------------------------ | -------------------------- | ----------- |
| **[SEO 전략](./docs/seo-strategy.md)**           | 큐레이션 플랫폼 SEO 방법   | SEO 개선 시 |
| **[커뮤니티 소개](./docs/community-intro.md)**   | 커뮤니티 홍보용 문서       | 홍보 시     |
| **[홍보 템플릿](./docs/promotion-templates.md)** | SNS/커뮤니티 게시글 템플릿 | 홍보 시     |

### 기술 이슈

| 문서                                                                                        | 설명               | 대상              |
| ------------------------------------------------------------------------------------------- | ------------------ | ----------------- |
| **[Push 알림 가이드](./docs/push-notifications.md)**                                        | Web Push 구현 상세 | Push 알림 작업 시 |
| **[Google Search Console 리다이렉트 오류](./docs/google-search-console-redirect-error.md)** | GSC 오류 해결      | SEO 이슈 시       |

---

## 🗂️ 프로젝트 구조 개요

```
dev-blog/
├── docs/                   # 📚 모든 문서 (이 인덱스에서 연결)
│   ├── README.md          # 문서 가이드
│   ├── project-overview.md
│   ├── agent-guidelines.md
│   ├── techstack.md
│   ├── features.md
│   ├── database-schema.md
│   ├── folder-structure.md
│   ├── coding-conventions.md
│   ├── api-specification.md
│   └── ... (기타 문서)
│
├── app/                   # Next.js App Router
│   ├── (pages)/           # 페이지 그룹
│   │   ├── posts/
│   │   ├── bookmarks/
│   │   └── ... (기타 페이지)
│   └── api/               # API Routes
│       ├── posts/
│       ├── bookmarks/
│       └── ... (기타 API)
│
├── features/              # 기능별 로직 (FSD 패턴)
│   ├── posts/
│   ├── bookmarks/
│   ├── auth/
│   └── ... (총 9개)
│
├── components/            # 순수 UI 컴포넌트
├── atoms/                 # Jotai 전역 상태 (최소 사용)
├── hooks/                 # 공유 React 훅
├── utils/                 # 공유 유틸리티
├── lib/                   # 라이브러리 설정
├── supabase/              # Supabase 클라이언트 & 타입
│   ├── client.supabase.ts
│   ├── server.supabase.ts
│   ├── types.supabase.ts
│   └── migrations/        # DB 마이그레이션 (15개 파일)
│
├── .env.local             # 환경 변수 (Git 제외)
├── .env.example           # 환경 변수 예시
├── proxy.ts               # Next.js Proxy (/ → /posts, 인증 라우트 보호)
├── vercel.json            # Cron 설정
└── README.md              # 사용자용 README



## 🛠 기술 스택

### Frontend

- **Framework**: Next.js 14.2.0 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4.0 + shadcn/ui (button, badge, separator, tooltip)
- **Animation**: GSAP (데스크탑 사이드바 hover expand/collapse)
- **State Management**: Jotai 2.16.1 (최소 사용 - 모바일 메뉴, 토스트, 사이드바)
- **Data Fetching**: TanStack Query 5.90.16 (React Query) - 주요 상태 관리

### Backend & Infrastructure

- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (GitHub OAuth) - @supabase/ssr 0.8.0
- **Cron Jobs**: Vercel Cron Jobs
- **AI API**: OpenAI 6.15.0 (GPT-4o-mini) - 키워드 기반 태그 선택
- **Hosting**: Vercel
- **Monitoring**: Sentry 10.35.0

### Libraries

- **State Management**: Jotai (최소 사용), TanStack Query (주요)
- **Data Fetching**: TanStack Query (React Query)
- **RSS Parsing**: rss-parser 3.13.0
- **Date Handling**: date-fns
- **HTTP Client**: fetch (native)
- **Form**: react-hook-form
- **Icons**: lucide-react
- **Push Notification**: web-push (백엔드 Push 발송)
- **Analytics**: Google Analytics, Vercel Analytics

---

## 🎯 핵심 기능

### 1. 블로그 자동 수집 스케줄러

- **실행 주기**: 하루 2번 (매일 15:00, 21:00 KST)
- **스케줄**: 15:00, 21:00 (KST) / UTC 06:00, 12:00
- **방법**: GitHub Actions
- **블로그 관리**:
  - 데이터베이스 기반 관리 (관리자 페이지에서 추가/수정/삭제)
  - 각 기업별 RSS URL, 블로그 URL, 로고 등 메타데이터 저장
  - 활성화/비활성화 기능으로 수집 대상 제어
- **프로세스**:
  1. DB에서 활성화된 기업 블로그 목록 조회
  2. 각 기업 블로그의 RSS 피드 확인
  3. 신규 게시글 감지 (URL 중복 체크)
  4. tags 테이블에서 키워드 매칭으로 적절한 태그 선택 (3-5개)
  5. Supabase에 게시글 저장
  6. **ISR 캐시 갱신**: 새 글이 저장되면 `/api/revalidate` 호출하여 `/posts` 페이지 즉시 갱신
  7. **Push 알림 발송**: 로그인 사용자에게 새 글 알림

### 2. 태그 자동 선택 (키워드 기반)

- **방식**: `tags` 테이블의 사전정의 태그만 사용 (AI 생성 없음)
- **입력**: 게시글 제목 + 본문 내용
- **알고리즘**: 제목/내용의 키워드 매칭 기반 점수 계산
- **출력**: 3-5개의 기술 태그 (예: React, Backend, DevOps, Database, AI/ML)
- **주의사항**:
  - OpenAI API를 사용하지 않음 (비용 절감)
  - 모든 태그는 `tags` 테이블에 사전정의됨
  - 새 태그 추가 시 관리자가 수동으로 등록
  - 인기 태그는 `is_featured=true`로 표시
- **태그 카테고리**:
  - Frontend: React, Vue, Next.js, TypeScript, CSS, HTML, Angular
  - Backend: Node.js, Java, Spring, Python, Django, Go, PHP, Kotlin
  - Database: PostgreSQL, MongoDB, MySQL, Redis, Elasticsearch, Firebase
  - DevOps: Docker, Kubernetes, AWS, GCP, Azure, CI/CD, GitHub Actions
  - Mobile: React Native, Flutter, iOS, Android, Swift
  - AI/ML: Machine Learning, Deep Learning, NLP, Computer Vision, LLM, PyTorch, TensorFlow
  - 기타: Architecture, Performance, Security, Testing, API, GraphQL

### 3. 인증 및 즐겨찾기

- **인증 방식**: GitHub OAuth (Supabase Auth) - `@supabase/ssr` 사용
- **쿠키 기반**: Supabase SSR 클라이언트를 통한 안전한 토큰 관리
- **상태 관리**: TanStack Query를 통한 서버 상태 관리 (주요), Jotai는 최소 사용 (모바일 메뉴, 토스트)
- **서버 확인**: 초기 로드 시 서버에서 로그인 상태 확인 후 클라이언트에 전달
- **즐겨찾기 기능**:
  - 로그인한 사용자만 이용 가능
  - 사용자별 즐겨찾기 목록 관리 (TanStack Query로 캐싱)
  - 즐겨찾기 필터링 기능
  - 날짜별 그리드뷰로 시각화
- **최근 본 글**:
  - 로컬 스토리지 기반 (로그인 불필요)
  - 최대 50개 저장
  - 날짜별 그룹화
- **프로필**:
  - 활동 히트맵 (GitHub 스타일)
  - 즐겨찾기 통계
  - 계정 삭제 기능

### 4. 검색 및 필터링

- **텍스트 검색**: 게시글 제목 기반 검색 (Full-text search)
- **태그 필터링**: 다중 태그 선택 가능 (OR 조건)
- **회사 필터링**: 다중 회사 선택 가능 (OR 조건)
- **정렬 옵션**:
  - 최신순 (기본값)
  - 오래된 순
  - 드롭다운 버튼으로 선택 가능

#### URL 쿼리 파라미터

검색, 태그 필터, 회사 필터, 페이지 정보는 URL 쿼리 파라미터로 저장되어 사용자가 필터링된 결과를 공유할 수 있습니다.

**파라미터 구조**:

```

/?page=2&search=react&tags=Frontend,Backend&companies=toss,kakao&sort=oldest

```

- `page`: 현재 페이지 번호 (기본값: 1)
- `search`: 검색 쿼리 (URL 인코딩됨)
- `tags`: 선택된 태그 (쉼표로 구분)
- `companies`: 선택된 회사 ID (쉼표로 구분)
- `sort`: 정렬 방식 (newest, oldest, 기본값: newest)

**예시**:

- 기본: `/` 또는 `/?page=1`
- 검색: `/?search=react&page=1`
- 태그: `/?tags=Frontend,Backend&page=1`
- 회사: `/?companies=toss,kakao&page=1`
- 정렬: `/?sort=oldest`
- 모두: `/?search=react&tags=Frontend,Backend&companies=toss,kakao&page=2&sort=oldest`

**구현 방식**:

- `app/(pages)/posts/page.tsx`: 메인 페이지 (서버 컴포넌트)
- `features/posts/ui/PostsContainer.tsx`: URL 파라미터 관리, 상태 동기화
- `features/posts/ui/SearchBar.tsx`: 검색어 변경 시 콜백 호출
- `components/search/BlogFilterModal.tsx`: 블로그 필터 모달
- `components/pagination/Pagination.tsx`: 페이지네이션 UI

### API 엔드포인트

#### 게시글 API

- **GET `/api/posts`**: 게시글 목록 조회
  - 쿼리 파라미터: page, search, tags, companies, sort
  - 응답: { posts, totalCount, totalPages }
- **GET `/api/posts/[id]`**: 게시글 상세 조회
  - 응답: 단일 게시글 정보

#### 북마크 API

- **GET `/api/bookmarks`**: 사용자 북마크 목록
  - 인증 필요
  - 응답: 북마크된 게시글 배열
- **POST `/api/bookmarks`**: 북마크 추가
  - Body: { postId }
  - 인증 필요
- **DELETE `/api/bookmarks`**: 북마크 삭제
  - Query: postId
  - 인증 필요

#### 기업/블로그 API

- **GET `/api/companies`**: 기업 목록 조회
  - Query: featured=true (인기 블로그만)
  - 응답: 기업 배열

#### 태그 API

- **GET `/api/tags`**: 태그 목록 조회
  - 응답: 태그 배열

#### 공지사항 API

- **GET `/api/announcements`**: 공지사항 목록
  - 응답: 공지사항 배열

#### 최근 본 글 API

- **POST `/api/recent-views`**: 최근 본 글 추가
  - Body: { postId }
  - 로컬 스토리지 기반 (인증 불필요)

### 5. 페이지네이션

- **방식**: 페이지 번호 기반 (무한 스크롤 X)
- **페이지당 게시글 수**: 20개
- **네비게이션 구성**:
```

[처음] [이전] [1] [2] [3] [4] [5] [다음] [마지막]

```
- **동적 페이지 번호**: 현재 페이지 기준 ±2 페이지 표시

### 6. 공지사항 시스템

- **공지사항 타입**:
- notice: 일반 공지
- update: 업데이트 소식
- maintenance: 점검 안내
- event: 이벤트 안내
- **관리**:
- 관리자가 작성/수정/삭제
- 우선순위 설정 가능
- 타입별 배지 색상 구분

### 7. 최근 본 글

- **저장 방식**: 로컬 스토리지 (로그인 불필요)
- **저장 개수**: 최대 50개
- **데이터 구조**:
- 게시글 ID, 제목, URL
- 블로그 정보 (이름, 로고)
- 조회 시간 (timestamp)
- **기능**:
- 날짜별 그룹화 표시
- 개별 삭제
- 전체 삭제
- **성능**: 디바운스 적용 (중복 저장 방지)

### 8. 프로필 페이지

- **사용자 정보**:
- GitHub 프로필 정보
- 가입일, 이메일
- **활동 통계**:
- 전체 북마크 수
- 최근 활동 날짜
- **활동 히트맵**:
- GitHub 스타일 히트맵
- 최근 1년간 북마크 활동 시각화
- 일별 북마크 수 표시
- **계정 관리**:
- 계정 삭제 (확인 모달)
- 로그아웃

### 9. 블로그 추가 요청

- **요청 폼**:
- 블로그 이름 (필수)
- 블로그 URL (필수)
- RSS URL (필수)
- 설명 (선택)
- 요청자 정보
- **검증**:
- URL 형식 검증
- 중복 체크
- **처리**:
- 관리자 검토 후 승인
- 승인 시 자동으로 수집 시작

### 10. Push 알림 기능

- **대상**: 로그인 회원만
- **트리거**: GitHub Actions가 새 글을 저장한 후 `/api/notifications/send` 호출
- **알림 내용**: "오늘 N개의 새 글이 등록되었습니다" (요약형)
- **기술**: Web Push API + `web-push` 패키지 (Firebase FCM 불필요)
- **구독 단위**: 장치(기기) 단위 (같은 유저가 여러 기기에서 로그인하면 각각 독립 구독)
- **설정 단위**: OS 단위로 그룹화 (레벨 2)

#### 알림 설정 구조

```

전체 알림 on/off (유저 단위) → notification_preferences
↓ ON일 때만
기기별 알림 on/off (OS 단위 그룹화) → push_subscriptions.enabled

```

- 전체 토글 OFF → 모든 기기 발송 안 됨
- 전체 토글 ON → enabled = true인 기기만 발송
- 기기별 토글은 같은 OS의 기기를 bulk update (예: Windows 토글 OFF → Windows Chrome, Windows Firefox 모두 OFF)

#### 기기 OS 분류 (device_os)

| device_os | 표시명 | 아이콘 |
|---|---|---|
| `windows` | Windows | 🖥️ |
| `mac` | Mac | 🍎 |
| `linux` | Linux | 🖥️ |
| `android` | Android | 📱 |
| `ios` | iPhone | 🍎 |

#### DB 테이블

- `push_subscriptions`: 장치별 구독 정보 (endpoint, p256dh, auth, device_os, browser, enabled)
- `notification_preferences`: 유저별 전체 알림 설정 (new_post_enabled)

#### API 엔드포인트

| 메서드 | 경로 | 역할 | 호출자 |
|---|---|---|---|
| POST | `/api/notifications/subscribe` | 구독 저장 | 유저 브라우저 |
| DELETE | `/api/notifications/subscribe` | 구독 해제 | 유저 브라우저 |
| GET | `/api/notifications/preferences` | 알림 설정 + 기기 목록 조회 | 유저 브라우저 |
| PUT | `/api/notifications/preferences` | 전체 알림 on/off 변경 | 유저 브라우저 |
| PUT | `/api/notifications/subscribe` | 기기별 enabled 변경 (OS 단위 bulk) | 유저 브라우저 |
| POST | `/api/notifications/send` | Push 실제 발송 (CRON_SECRET 인증) | GitHub Actions |

#### 프론트엔드 구조

```

features/notifications/
├── hooks/
│ ├── usePushSubscription.ts # 브라우저 권한 요청, 구독/해제 로직
│ ├── useNotificationPreferences.ts # 알림 설정 조회/변경 (TanStack Query)
│ └── index.ts
├── services/
│ ├── fetch.ts # API 호출
│ ├── device-detect.ts # device_os, browser 감지
│ └── index.ts
├── ui/
│ ├── NotificationSettings.tsx # 알림 설정 UI (프로필 페이지 내 섹션)
│ └── index.ts
└── index.ts

```

#### Service Worker (`public/sw.js`)

- Push 메시지 수신 후 Notification 표시
- 알림 클릭 시 포스트 목록 페이지로 이동

#### GitHub Actions 연동

- `scripts/fetch-posts.ts`: 글 저장 완료 후 `postsCreated > 0`이면 `POST /api/notifications/send` 호출
- `.github/workflows/fetch-posts.yml`: `CRON_SECRET`, `NEXT_PUBLIC_SITE_URL` 환경 변수 추가

#### 발송 흐름

```

GitHub Actions (fetch-posts.ts)
→ 새 글 N개 저장 완료
→ POST /api/notifications/send { postsCreated: N }
→ notification_preferences에서 new_post_enabled = true인 유저 조회
→ 해당 유저의 push_subscriptions에서 enabled = true인 기기 조회
→ web-push로 각 기기 endpoint에 "오늘 N개의 새 글이 등록되었습니다" 발송
→ 실패한 endpoint는 자동 삭제 (만료된 구독 정리)

```

#### 프로필 페이지 UI 배치

```

┌─────────────────────────────────────┐
│ 프로필 정보 카드 │
├─────────────────────────────────────┤
│ 즐겨찾기 활동 히트맵 │
├─────────────────────────────────────┤
│ 알림 설정 │ ← 추가
│ 새 글 알림 ● ON │
│ ───────────────────────── │
│ 장치별 설정 │
│ 🖥️ Windows ● ON (2기기) │
│ 📱 Android ● ON (1기기) │
│ 🍎 iPhone ○ OFF (1기기) │
├─────────────────────────────────────┤
│ 로그아웃 │
├─────────────────────────────────────┤
│ 회원탈퇴 │
└─────────────────────────────────────┘

````

- 전체 토글 OFF → 기기별 토글 grayed out (조작 불가)
- 등록되지 않은 기기는 목록에 표시되지 않음 (구독된 기기만 표시)

---

### 11. ISR (Incremental Static Regeneration)

Next.js의 ISR을 활용하여 성능과 최신성을 모두 확보합니다.

#### 작동 방식

```
사용자 요청 → 정적 페이지 제공 (빠름)
     ↓
30분 경과 or GitHub Actions 트리거
     ↓
백그라운드 재생성
     ↓
다음 요청부터 새 페이지 제공
```

#### 설정

**1. 페이지 레벨 ISR 설정**

```typescript
// app/(pages)/posts/page.tsx
export const revalidate = 1800; // 30분 = 1800초
```

**2. On-Demand Revalidation API**

```typescript
// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const path = request.nextUrl.searchParams.get('path');

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  revalidatePath(path);
  return NextResponse.json({ revalidated: true, path });
}
```

**3. GitHub Actions 트리거**

```typescript
// scripts/fetch-posts.ts (새 글 저장 후)
if (stats.postsCreated > 0) {
  await fetch(
    `${siteUrl}/api/revalidate?secret=${revalidateSecret}&path=/posts`,
    { method: 'POST' }
  );
}
```

#### 장점

- ✅ **빠른 로딩**: 정적 페이지 수준의 성능 (CDN 캐싱)
- ✅ **자동 갱신**: 30분마다 자동 재생성
- ✅ **즉시 반영**: GitHub Actions에서 새 글 수집 시 즉시 갱신
- ✅ **서버 부하 감소**: 매 요청마다 DB 조회 불필요
- ✅ **SEO 최적화**: 서버 렌더링된 HTML 제공

#### 환경 변수

```bash
REVALIDATE_SECRET=your-random-secret-32-chars
```

자세한 설정: [ISR 설정 가이드](./docs/isr-setup-guide.md)

---

### 12. UI/UX

- **테마**: 라이트 모드 / 다크 모드 (사용자 선택 & 시스템 설정 감지)
- **반응형 브레이크포인트**:
  - 모바일: < 768px (md 미만)
  - 데스크탑: ≥ 768px (md 이상)
- **로딩 상태**:
  - 스켈레톤 UI (북마크, 카드, 그리드)
  - 페이지 로딩 스피너
- **토스트 알림**:
  - 성공/에러/정보/경고 메시지
  - 자동 닫힘 (5초)
- **빈 상태 UI**:
  - 검색 결과 없음
  - 북마크 없음
  - 최근 본 글 없음

#### 레이아웃 구조

**모바일 (< 768px)**

- **헤더**:
  - 좌측: 로고
  - 우측: 햄버거 메뉴 버튼
  - 햄버거 메뉴 클릭 시:
    - 왼쪽에서 오른쪽으로 슬라이드 애니메이션 (전체 화면)
    - 반투명 검정 배경 오버레이 (배경 클릭으로 닫힘)
    - 사이드 메뉴 헤더:
      - 좌측: 로고 아이콘 + devBlog 텍스트
      - 우측: 테마 토글 / 로그인 버튼 / 닫기(X) 버튼 (가로 배치)
    - 사이드 메뉴 콘텐츠:
      - 포스트 (Link)
      - 블로그 (Link)
      - 즐겨찾기 (Link)
      - 세로 배치
    - 메뉴 닫기 방법:
      - X 버튼 클릭
      - 배경 영역 클릭
      - 메뉴 항목 클릭
      - 로고 클릭
      - 브라우저/안드로이드/iOS 뒤로가기 (히스토리 기반)
- **메인**:
  - 검색 바 (텍스트 검색)
  - 필터 버튼 영역 (회사 필터 + 태그 필터)
  - 인기 회사 / 인기 태그 (축약된 형태)
  - 게시글 카드 리스트 (1열)
  - 페이지네이션
- **푸터**: 정보 및 링크

**데스크탑 (≥ 768px)**

- **사이드바** (`components/layout/Sidebar.tsx`):
  - 좌측 고정 (`position: fixed`), 평상시 아이콘만 표시 (64px)
  - hover 시 GSAP 애니메이션으로 240px로 확장 (아이콘 + 텍스트)
  - 모바일에서는 완전 숨김 (`hidden md:flex`)
  - 상단: 로고(`</>` 아이콘) / 중단: 네비 링크 / 하단: 테마 토글
- **헤더**: 데스크탑에서는 숨김 (사이드바가 대신함)
- **메인**:
  - 상단: 검색 바 및 필터 영역
    - 검색 입력: 게시글 제목 및 요약 검색 (실시간)
    - 회사 필터 버튼: 모달 창으로 전체 회사 표시
    - 태그 필터 버튼: 모달 창으로 전체 태그 표시
    - 인기 회사: 피처된 회사들의 로고 가로 버튼 (실시간 동적 로드)
    - 인기 태그: 8개의 인기 태그 가로 버튼 (Frontend, Backend, Database, DevOps, AI/ML, Mobile, Architecture, Performance)
    - 회사 다중 선택: 여러 회사 동시 선택 가능 (OR 조건)
    - 태그 다중 선택: 여러 태그 동시 선택 가능 (OR 조건)
    - 선택된 회사 표시: 로고 배지 형태로 표시, 개수 표시, X 클릭으로 개별 제거
    - 선택된 태그 표시: 배지 형태로 표시, 개수 표시, X 클릭으로 개별 제거
    - 회사 필터 모달:
      - 모든 활성 회사를 2-3열 그리드로 표시 (로고 + 회사명)
      - 선택된 회사는 파란색 배경 하이라이트
      - "초기화" 버튼: 모든 회사 선택 해제
      - "완료" 버튼: 모달 닫기
    - 태그 필터 모달:
      - 20개 태그를 2-3열 그리드로 표시
      - 선택된 태그는 파란색 배경 하이라이트
      - "초기화" 버튼: 모든 태그 선택 해제
      - "완료" 버튼: 모달 닫기
  - 중앙: 게시글 카드 리스트 (그리드, 3열)
    - 기업 로고 + 이름 + 작성일
    - 게시글 제목 (2줄 제한)
    - 게시글 요약 (2줄 제한)
    - 태그 배지 (최대 3개, 초과 시 "+n")
    - "전체 읽기" 링크
    - 호버 효과 (그림자 + 위로 올라오는 애니메이션)
  - 하단: 페이지네이션
    - 처음 / 이전 / [1] [2] ... [N] / 다음 / 마지막
    - 현재 페이지 강조 (파란색 배경)
    - 비활성 버튼 자동 처리
- **푸터**: 정보 및 링크

---

## 📊 데이터베이스 스키마

### Tables

#### `companies` (기업 정보)

```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  logo_url TEXT,
  blog_url TEXT NOT NULL,
  rss_url TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_companies_is_active ON companies(is_active);
CREATE INDEX idx_companies_is_featured ON companies(is_featured);
````

**기존 테이블 마이그레이션 (ALTER TABLE)**

```sql
-- 1. is_featured 컬럼 추가
ALTER TABLE companies ADD COLUMN is_featured BOOLEAN DEFAULT false;

-- 2. 인덱스 생성
CREATE INDEX idx_companies_is_featured ON companies(is_featured);

-- 3. is_active 인덱스 추가 (기존 테이블에 없는 경우)
CREATE INDEX idx_companies_is_active ON companies(is_active);
```

#### `posts` (게시글)

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  content TEXT,
  summary TEXT,
  author VARCHAR(255),
  tags TEXT[] DEFAULT '{}',
  published_at TIMESTAMPTZ NOT NULL,
  scraped_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_posts_company_id ON posts(company_id);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);
CREATE INDEX idx_posts_title_search ON posts USING GIN(to_tsvector('korean', title));
```

#### `bookmarks` (즐겨찾기)

```sql
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- 인덱스
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_post_id ON bookmarks(post_id);
```

#### `tags` (태그 관리)

```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(50),
  usage_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_tags_category ON tags(category);
```

#### `push_subscriptions` (Push 구독 정보)

```sql
CREATE TABLE push_subscriptions (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint   TEXT        NOT NULL UNIQUE,       -- 브라우저 Push endpoint URL
  p256dh     TEXT        NOT NULL,              -- 암호화 공개키
  auth       TEXT        NOT NULL,              -- 암호화 인증키
  device_os  VARCHAR(20) NOT NULL,              -- windows, mac, linux, android, ios
  browser    VARCHAR(20) NOT NULL,              -- chrome, firefox, safari, edge
  enabled    BOOLEAN     DEFAULT true,          -- 기기별 알림 on/off
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX idx_push_subscriptions_enabled ON push_subscriptions(enabled);
```

#### `notification_preferences` (유저 알림 설정)

```sql
CREATE TABLE notification_preferences (
  id               UUID     PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID     REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  new_post_enabled BOOLEAN  DEFAULT true,   -- 새 글 알림 전체 on/off
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_notification_preferences_user_id ON notification_preferences(user_id);
```

### Row Level Security (RLS) 정책

```sql
-- posts: 모든 사용자 읽기 가능
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Posts are viewable by everyone" ON posts
  FOR SELECT USING (true);

-- bookmarks: 사용자별 CRUD
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bookmarks" ON bookmarks
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own bookmarks" ON bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- push_subscriptions: 사용자별 CRUD
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own subscriptions" ON push_subscriptions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- notification_preferences: 사용자별 CRUD
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own preferences" ON notification_preferences
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```

---

## 📁 프로젝트 구조

```
dev-blog/
├── .env.local                  # 환경 변수
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── vercel.json                 # Cron 설정
├── middleware.ts               # Next.js 미들웨어 (/ → /posts 리다이렉트)
├── CLAUDE.md                   # 이 문서
├── README.md                   # 프로젝트 소개
│
├── scripts/
│   └── convert-to-webp.js      # 이미지 최적화 스크립트
│
├── public/                     # 정적 자산
│   ├── company_logos/          # 32개 기업 로고 (WebP 포맷)
│   ├── sw.js                   # Service Worker (Push 알림 수신)
│   └── [favicon files]
│
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root 레이아웃
│   ├── loading.tsx             # 로딩 UI
│   ├── not-found.tsx           # 404 페이지
│   ├── global-error.tsx        # 에러 페이지
│   ├── robots.ts               # robots.txt 동적 생성
│   ├── sitemap.ts              # sitemap.xml 동적 생성
│   ├── schema.ts               # JSON-LD 스키마
│   ├── GoogleAnalytics.tsx     # GA4 통합
│   │
│   ├── providers/              # React 프로바이더
│   │
│   ├── api/                    # API 라우트 (서버)
│   │   ├── cron/
│   │   │   └── fetch-posts/
│   │   │       └── route.ts    # 블로그 자동 수집 Cron
│   │   ├── posts/
│   │   │   ├── route.ts        # 게시글 목록 조회 API
│   │   │   └── [id]/
│   │   │       └── route.ts    # 게시글 상세 조회 API
│   │   ├── bookmarks/
│   │   │   └── route.ts        # 즐겨찾기 CRUD API
│   │   ├── companies/
│   │   │   └── route.ts        # 기업 목록/관리 API
│   │   ├── tags/
│   │   │   └── route.ts        # 태그 목록 조회 API
│   │   ├── announcements/
│   │   │   └── route.ts        # 공지사항 API
│   │   ├── recent-views/
│   │   │   └── route.ts        # 최근 본 글 API
│   │   └── notifications/
│   │       ├── subscribe/
│   │       │   └── route.ts    # Push 구독 저장/해제/기기별 변경 API
│   │       ├── preferences/
│   │       │   └── route.ts    # 알림 설정 조회/변경 API
│   │       └── send/
│   │           └── route.ts    # Push 발송 API (내부용, CRON_SECRET 인증)
│   │
│   ├── auth/
│   │   ├── callback/
│   │   │   └── route.ts        # GitHub OAuth 콜백
│   │   └── login/
│   │       └── page.tsx        # 로그인 페이지
│   │
│   ├── feed.xml/
│   │   └── route.ts            # RSS 피드 생성
│   │
│   ├── (pages)/                # 페이지 그룹
│   │   ├── layout.tsx          # 페이지 공통 레이아웃
│   │   ├── loading.tsx         # 페이지 로딩 UI
│   │   ├── posts/
│   │   │   └── page.tsx        # 게시글 목록 (메인)
│   │   ├── announcements/
│   │   │   └── page.tsx        # 공지사항 목록
│   │   ├── bookmarks/
│   │   │   └── page.tsx        # 즐겨찾기 목록
│   │   ├── recent-views/
│   │   │   └── page.tsx        # 최근 본 글
│   │   ├── profile/
│   │   │   └── page.tsx        # 사용자 프로필
│   │   ├── request/
│   │   │   └── page.tsx        # 블로그 추가 요청
│   │   ├── terms/
│   │   │   └── page.tsx        # 이용약관
│   │   └── privacy-policy/
│   │       └── page.tsx        # 개인정보처리방침
│
├── components/                 # React 컴포넌트
│   ├── layout/
│   │   ├── Header.tsx          # 모바일 헤더 (fixed, md:hidden)
│   │   ├── HeaderClient.tsx    # 헤더 클라이언트 로직
│   │   ├── MobileHamburger.tsx # 햄버거 메뉴 버튼
│   │   ├── MobileMenu.tsx      # 모바일 드롭다운 메뉴
│   │   ├── Sidebar.tsx         # 데스크탑 사이드바 (GSAP hover expand)
│   │   ├── SidebarLayout.tsx   # 페이지 공통 레이아웃 래퍼
│   │   ├── Footer.tsx          # 푸터
│   │   └── index.ts            # 배럴 export
│   │
│   ├── image/
│   │   ├── BlogLogoImage.tsx   # 블로그 로고 이미지
│   │   └── index.ts
│   │
│   ├── search/
│   │   ├── BlogFilterModal.tsx # 블로그 필터 모달
│   │   ├── TagFilterModal.tsx  # 태그 필터 모달
│   │   ├── SortButton.tsx      # 정렬 버튼
│   │   └── index.ts
│   │
│   ├── pagination/
│   │   ├── Pagination.tsx      # 페이지네이션 컨테이너
│   │   ├── PaginationButton.tsx # 페이지 버튼
│   │   ├── PaginationPageNumber.tsx # 페이지 번호
│   │   └── index.ts
│   │
│   ├── skeleton/               # 로딩 스켈레톤 컴포넌트
│   │   ├── BookmarkSkeleton.tsx
│   │   ├── CardSkeleton.tsx
│   │   ├── GridSkeleton.tsx
│   │   ├── PageLoadingSpinner.tsx
│   │   ├── SimpleSkeleton.tsx
│   │   └── index.ts
│   │
│   ├── modal/
│   │   ├── DeleteAccountConfirmModal.tsx # 계정 삭제 확인
│   │   └── index.ts
│   │
│   ├── toast/
│   │   ├── ToastContainer.tsx  # 토스트 알림
│   │   └── index.ts
│   │
│   ├── theme/
│   │   ├── ThemeToggle.tsx     # 다크/라이트 모드 토글
│   │   └── index.ts
│   │
│   ├── ui/                     # 공통 UI 컴포넌트
│   │   ├── EmptyState.tsx      # 빈 상태 UI
│   │   ├── FilterModal.tsx     # 공통 필터 모달
│   │   └── index.ts
│   │
│   └── [various index.ts files]
│
├── features/                   # 기능별 로직
│   ├── posts/
│   │   ├── components/
│   │   │   ├── ActiveFilters.tsx    # 활성 필터 표시
│   │   │   ├── BookmarkButton.tsx   # 즐겨찾기 버튼
│   │   │   ├── ErrorMessage.tsx     # 에러 메시지
│   │   │   ├── NoPostsMessage.tsx   # 빈 상태
│   │   │   ├── PopularBlogs.tsx     # 인기 블로그
│   │   │   ├── PopularTags.tsx      # 인기 태그
│   │   │   ├── PostCardHeader.tsx   # 카드 헤더
│   │   │   ├── PostCardTags.tsx     # 카드 태그
│   │   │   ├── SearchInput.tsx      # 검색 입력
│   │   │   ├── SelectedBadges.tsx   # 선택된 배지
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── _usePosts.ts         # 게시글 조회 훅
│   │   │   ├── useCompanies.ts      # 기업 조회 훅
│   │   │   ├── useSearchFilters.ts  # 검색/필터 훅
│   │   │   ├── useTags.ts           # 태그 조회 훅
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   ├── fetch.ts             # API 호출
│   │   │   ├── rss-parser.ts        # RSS 파싱
│   │   │   └── index.ts
│   │   ├── types/
│   │   │   ├── posts.types.ts       # Post 타입
│   │   │   └── index.ts
│   │   ├── ui/
│   │   │   ├── PostCard.tsx         # 게시글 카드
│   │   │   ├── PostList.tsx         # 게시글 리스트
│   │   │   ├── PostsContainer.tsx   # 메인 컨테이너
│   │   │   ├── SearchBar.tsx        # 검색 바
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── auth/
│   │   ├── actions/
│   │   │   ├── getUser.ts           # 사용자 정보 조회
│   │   │   ├── logout.action.ts     # 로그아웃 액션
│   │   │   ├── withdraw.action.ts   # 회원 탈퇴 액션
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useDeleteAccount.ts  # 계정 삭제 훅
│   │   │   ├── useGitHubLogin.ts    # GitHub 로그인 훅
│   │   │   ├── useLogout.ts         # 로그아웃 훅
│   │   │   └── index.ts
│   │   ├── ui/
│   │   │   ├── AnimatedBackground.tsx # 로그인 배경
│   │   │   ├── LoginCard.tsx        # 로그인 카드
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── bookmarks/
│   │   ├── actions/
│   │   │   ├── createBookmark.action.ts  # 북마크 생성
│   │   │   ├── deleteBookmark.action.ts  # 북마크 삭제
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useAddBookmark.ts         # 북마크 추가 훅
│   │   │   ├── useBookmarkToggle.ts      # 북마크 토글 훅
│   │   │   ├── useBookmarksList.ts       # 북마크 목록 훅
│   │   │   ├── useIsBookmarked.ts        # 북마크 확인 훅
│   │   │   ├── useRemoveBookmark.ts      # 북마크 제거 훅
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   ├── fetch.ts                  # API 호출
│   │   │   └── index.ts
│   │   ├── ui/
│   │   │   ├── BookmarkContainer.tsx     # 북마크 컨테이너
│   │   │   ├── BookmarkList.tsx          # 북마크 리스트
│   │   │   ├── DateGridView.tsx          # 날짜 그리드뷰
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── announcements/
│   │   ├── hooks/
│   │   │   ├── useAnnouncements.ts  # 공지사항 조회 훅
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   ├── fetch.ts             # API 호출
│   │   │   └── index.ts
│   │   ├── ui/
│   │   │   ├── AnnouncementCard.tsx      # 공지사항 카드
│   │   │   ├── AnnouncementList.tsx      # 공지사항 리스트
│   │   │   ├── AnnouncementsContainer.tsx # 공지사항 컨테이너
│   │   │   ├── TypeBadge.tsx             # 타입 배지
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── recent-views/
│   │   ├── actions/
│   │   │   ├── createRecentView.action.ts # 최근 본 글 생성
│   │   │   ├── deleteRecentView.action.ts # 최근 본 글 삭제
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useAddRecentView.ts        # 추가 훅
│   │   │   ├── useDeleteRecentView.ts     # 삭제 훅
│   │   │   ├── useRecentViews.ts          # 조회 훅
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   ├── local-storage.types.ts     # 로컬 스토리지 타입
│   │   │   └── index.ts
│   │   ├── ui/
│   │   │   ├── RecentViewPostCard.tsx     # 최근 본 글 카드
│   │   │   ├── RecentViewsActions.tsx     # 액션 버튼
│   │   │   ├── RecentViewsEmpty.tsx       # 빈 상태
│   │   │   ├── RecentViewsError.tsx       # 에러 상태
│   │   │   ├── RecentViewsList.tsx        # 리스트
│   │   │   ├── RecentViewsListSkeleton.tsx # 스켈레톤
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── request/
│   │   ├── actions/
│   │   │   ├── requestSubmit.action.ts # 요청 제출
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useSubmitRequest.ts     # 요청 제출 훅
│   │   │   └── index.ts
│   │   ├── ui/
│   │   │   ├── RequestForm.tsx         # 요청 폼
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── profile/
│   │   ├── components/
│   │   │   ├── ActivityHeatmap.tsx        # 활동 히트맵
│   │   │   ├── ActivityHeatmapClient.tsx  # 히트맵 클라이언트
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   ├── fetch.ts                   # API 호출
│   │   │   └── index.ts
│   │   ├── ui/
│   │   │   ├── ProfileClient.tsx          # 프로필 클라이언트
│   │   │   ├── ProfileInfoCard.tsx        # 프로필 정보 카드
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── notifications/
│   │   ├── hooks/
│   │   │   ├── usePushSubscription.ts        # 브라우저 권한 요청, 구독/해제 로직
│   │   │   ├── useNotificationPreferences.ts # 알림 설정 조회/변경 (TanStack Query)
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   ├── fetch.ts                      # API 호출
│   │   │   ├── device-detect.ts              # device_os, browser 감지
│   │   │   └── index.ts
│   │   ├── ui/
│   │   │   ├── NotificationSettings.tsx      # 알림 설정 UI (프로필 페이지 내 섹션)
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   └── ai/
│       └── services/
│           ├── openai.ts           # OpenAI API 래퍼
│           └── tag-selector.ts     # 키워드 기반 태그 선택
│
├── atoms/                      # Jotai 전역 상태 (최소 사용)
│   ├── mobileMenu.atom.ts      # 모바일 메뉴 상태
│   ├── toast.atom.ts           # 토스트 알림 상태
│   └── index.ts                # 배럴 export
│
├── lib/                        # 유틸리티 라이브러리
│   ├── query-keys.ts           # TanStack Query 키 정의
│   └── gtag.ts                 # Google Analytics
│
├── supabase/                   # Supabase 클라이언트 & 타입
│   ├── client.supabase.ts      # 클라이언트용 Supabase
│   ├── server.supabase.ts      # 서버용 Supabase (API 라우트)
│   ├── types.supabase.ts       # DB 타입 (Supabase 자동 생성)
│   ├── index.ts                # 배럴 export
│   └── migrations/             # DB 마이그레이션 (15개 파일)
│       ├── 20240101000000_initial_schema.sql
│       ├── 20240102000000_add_companies.sql
│       ├── 20240103000000_add_posts.sql
│       ├── 20240104000000_add_bookmarks.sql
│       ├── 20240105000000_add_tags.sql
│       ├── 20240106000000_add_rls_policies.sql
│       ├── 20240107000000_add_announcements.sql
│       ├── 20240108000000_add_recent_views.sql
│       ├── 20240109000000_add_profiles.sql
│       └── ... (총 15개)
│
├── utils/                      # 공유 유틸리티
│   ├── cn.ts                   # className 유틸
│   ├── constants.ts            # 상수 정의
│   ├── date.ts                 # 날짜 포맷팅
│   ├── format-date.ts          # 날짜 형식 변환
│   ├── local-storage.ts        # 로컬 스토리지 헬퍼
│   ├── rate-limit.ts           # Rate Limiting
│   ├── url.ts                  # URL 처리
│   └── index.ts                # 배럴 export
│
├── hooks/                      # 공유 React 훅
│   ├── useDebounce.ts          # 디바운스 훅
│   ├── useIsMobile.ts          # 모바일 감지 훅
│   ├── useToast.ts             # 토스트 훅
│   ├── useTheme.ts             # 테마 토글 훅 (CustomEvent로 사이드바/헤더 동기화)
│   └── index.ts                # 배럴 export
```

### 폴더 구조 설명

#### **app/** - Next.js 라우팅

- 페이지와 API 라우트 정의
- SSR/CSR 처리
- 레이아웃 및 템플릿

#### **components/** - UI 컴포넌트

- 순수 프레젠테이션 컴포넌트
- Props를 통한 데이터 수신
- 스타일링 및 상호작용 처리
- 비즈니스 로직 없음

#### **features/** - 기능별 로직 (중요!)

```
기능별로 자체 폴더를 가지며, 각 기능은:
- actions/: Server Action (폼 제출 등 서버 작업)
- services/: API 호출, 비즈니스 로직, 데이터 처리
- hooks/: React 훅으로 상태 관리, 데이터 조회
- ui/: 클라이언트 컴포넌트 (use client)
- types.ts: 해당 기능의 타입 정의
```

**예1: 게시글 기능 (features/posts/)**

```
features/posts/
├── services/
│   ├── fetch.ts      # API에서 게시글 조회
│   ├── filter.ts     # 검색/필터링 로직
│   └── types.ts      # Post, PostFilters 등
└── hooks/
    ├── usePosts.ts   # 게시글 조회 훅 (API 호출)
    └── usePostFilter.ts # 필터링 훅
```

**예2: 요청 기능 (features/request/)**

```
features/request/
├── actions/
│   ├── submit.ts           # 요청 제출 Server Action
│   └── index.ts            # 배럴 export
├── hooks/
│   ├── useSubmitRequest.ts # 요청 제출 mutation 훅
│   └── index.ts            # 배럴 export
├── ui/
│   ├── RequestForm.tsx     # 요청 폼 컴포넌트 (클라이언트)
│   └── index.ts            # 배럴 export
└── index.ts                # 배럴 export
```

**사용 방식:**

```typescript
// RequestForm.tsx에서 (클라이언트 컴포넌트)
import { useForm } from 'react-hook-form';
import { useSubmitRequest } from '@/features/request/hooks';
import { type RequestFormData } from '@/features/request/actions';

export function RequestForm() {
  const { register, handleSubmit, reset } = useForm<RequestFormData>({ ... });

  // 훅 사용 (필요한 것만 생성 - 메모리 효율적)
  const mutation = useSubmitRequest(reset);

  // 콜백: 화살표 함수
  const onSubmit = async (data: RequestFormData) => {
    await mutation.mutateAsync(data);
  };

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
}

// RequestPage.tsx에서 (서버 컴포넌트)
import { RequestForm } from '@/features/request';

export default function RequestPage() {
  return <RequestForm />;
}
```

**특징:**

- ✅ Server Action (submitRequest)과 Client Hook (useSubmitRequest) 분리
- ✅ react-hook-form + TanStack Query 조합
- ✅ 메모리 효율적 (필요한 훅만 호출)
- ✅ 비즈니스 로직과 UI 완전 분리
- ✅ 재사용 가능한 구조

**예3: 로그인 기능 (features/login/)**

```
features/login/
├── ui/
│   ├── LoginContainer.tsx # 로그인 UI 컴포넌트 (클라이언트)
│   └── index.ts           # 배럴 export
└── index.ts               # 배럴 export
```

**사용 방식:**

```typescript
// LoginContainer.tsx에서 (클라이언트 컴포넌트)
'use client';

import { useRouter } from 'next/navigation';

export function LoginContainer() {
  const router = useRouter();

  // 콜백: 화살표 함수
  const handleBack = () => router.back();

  return (
    <div>
      {/* GitHub 로그인 버튼 */}
      <button>GitHub로 로그인</button>

      {/* 뒤로가기 버튼 */}
      <button onClick={handleBack}>뒤로가기</button>
    </div>
  );
}

// page.tsx에서 (서버 컴포넌트)
import { LoginContainer } from '@/features/login';

export const metadata = {
  title: '로그인 | devBlog.kr',
  description: 'GitHub OAuth를 통해 devBlog.kr에 로그인하세요.',
};

export default function LoginPage() {
  return <LoginContainer />;
}
```

**특징:**

- ✅ page.tsx는 서버 컴포넌트 (메타데이터 설정 가능)
- ✅ UI 로직은 features/login/ui에 클라이언트 컴포넌트로 분리
- ✅ 클라이언트 훅(useRouter) 필요한 것만 사용
- ✅ 간단한 UI만 있는 경우에도 구조 일관성 유지

#### **atoms/** - Jotai 전역 상태 관리

Jotai를 사용하여 전역 상태를 간단하고 효율적으로 관리합니다.

**구조:**

```
atoms/
├── mobileMenu.atom.ts   # 모바일 메뉴 상태
├── toast.atom.ts        # 토스트 알림 상태
├── sidebar.atom.ts      # 사이드바 상태 (collapsed/expanded)
└── index.ts             # 배럴 export
```

**중요:** Jotai는 **최소한으로만 사용**합니다. 대부분의 상태 관리는 TanStack Query를 통해 서버 상태로 관리합니다.

**예: 모바일 메뉴 상태 (atoms/mobileMenu.atom.ts)**

```typescript
import { atom } from 'jotai';

// 모바일 메뉴 열림/닫힘 상태
export const mobileMenuOpenAtom = atom<boolean>(false);
```

**예: 토스트 알림 상태 (atoms/toast.atom.ts)**

```typescript
import { atom } from 'jotai';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export const toastsAtom = atom<Toast[]>([]);
```

**사용 방식:**

```typescript
// 클라이언트 컴포넌트에서
'use client';

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

**Jotai vs TanStack Query 사용 구분:**

- **Jotai 사용**: UI 상태 (모달 열림/닫힘, 메뉴 상태, 토스트 등)
- **TanStack Query 사용**: 서버 데이터 (게시글, 북마크, 사용자 정보 등)

**특징:**

- ✅ 최소한의 Jotai 사용 (UI 상태만)
- ✅ TanStack Query가 주요 상태 관리
- ✅ 서버 상태와 클라이언트 상태 명확히 분리
- ✅ TypeScript 완벽 지원

#### **supabase/** - Supabase 클라이언트 & 타입

- Supabase 클라이언트 (클라이언트/서버)
- DB 타입 정의
- 중앙 진입점 (index.ts)

#### **utils/** - 공유 유틸리티

- 날짜 포맷팅 유틸
- 문자열 처리 유틸
- className 유틸 (cn)
- 상수 정의

#### **hooks/** - 공유 React 훅

- useDebounce: 디바운스 훅 (검색 입력 최적화)
- useIsMobile: 모바일 기기 감지 훅
- useToast: 토스트 알림 표시 훅

#### **lib/** - 유틸리티 라이브러리

- query-keys.ts: TanStack Query 키 중앙 관리
- gtag.ts: Google Analytics 이벤트 트래킹

#### **supabase/** - DB 클라이언트 & 마이그레이션

- 클라이언트/서버 Supabase 클라이언트
- DB 타입 정의 (자동 생성)
- 마이그레이션 파일 (15개)

---

### 개발 시 폴더 규칙

**새 기능 추가 시:**

1. `features/{기능명}/` 폴더 생성
2. `services/` - 비즈니스 로직 구현
3. `hooks/` - React 훅으로 래핑
4. `types.ts` - 타입 정의
5. `components/` - UI 만들기 (hooks 사용)

**컴포넌트는:**

- 데이터 조회 X (훅으로 받기)
- API 호출 X (훅으로 받기)
- 스타일링과 렌더링만 담당

---

## ⚙️ 환경 변수

```bash
# .env.local

# Supabase (https://supabase.com)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # 서버에서만 사용 (민감함)

# OpenAI (https://platform.openai.com)
OPENAI_API_KEY=sk-...  # GPT-4o-mini 모델 사용

# Vercel Cron Secret (보안)
CRON_SECRET=your-random-secret-string  # 최소 32자 추천

# ISR Revalidation Secret (보안)
# 생성 방법: openssl rand -hex 32
REVALIDATE_SECRET=your-random-secret-32-chars-minimum

# Web Push (VAPID Keys)
VAPID_PUBLIC_KEY=your-vapid-public-key   # web-push generateVAPIDKeys()로 생성
VAPID_PRIVATE_KEY=your-vapid-private-key
VAPID_SUBJECT=mailto:your-email@example.com

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # 개발: localhost, 배포: devBlog.kr
```

### 환경 변수 설정 가이드

**1. Supabase 설정**

- 프로젝트 생성 후 Settings > API에서 URL, Anon Key, Service Role Key 복사
- `SUPABASE_SERVICE_ROLE_KEY`는 .gitignore에 포함되어야 함 (민감한 정보)

**2. OpenAI API**

- https://platform.openai.com/api-keys에서 API 키 생성
- 사용 모델: `gpt-4o-mini` (비용 효율적)
- 예상 월 비용: ~$5-10 (테스트 기준)

**3. Cron Secret**

```bash
# 터미널에서 생성 (Linux/macOS)
openssl rand -hex 32
```

**4. ISR Revalidation Secret**

```bash
# 터미널에서 생성 (Linux/macOS)
openssl rand -hex 32
```

- GitHub Actions에서 새 글 수집 후 ISR 캐시 갱신에 사용
- Vercel, GitHub Actions Secrets에 모두 추가 필요
- 자세한 설정: [ISR 설정 가이드](./docs/isr-setup-guide.md)

**5. VAPID Keys (Web Push)**

```bash
# 한번만 생성 후 환경 변수에 저장 (변경하면 기존 구독 무효화됨)
npx tsx -e "const webpush = require('web-push'); console.log(JSON.stringify(webpush.generateVAPIDKeys()))"
```

- 생성된 `publicKey` → `VAPID_PUBLIC_KEY`
- 생성된 `privateKey` → `VAPID_PRIVATE_KEY`
- `VAPID_SUBJECT`는 본인 이메일 주소

**6. GitHub Actions Secrets 추가**

- `CRON_SECRET`: 기존 환경 변수와 동일한 값
- `REVALIDATE_SECRET`: ISR 캐시 갱신용 (신규)
- `NEXT_PUBLIC_SITE_URL`: 프로덕션 URL (예: `https://devblog.kr`)

**7. 배포 환경 변수**

- Vercel 대시보드 > Settings > Environment Variables
- 동일한 환경 변수 설정
- `NEXT_PUBLIC_*` 변수만 클라이언트에 노출됨

---

## 🔄 Cron Job 설정

### `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/fetch-posts",
      "schedule": "0 0 * * *"
    }
  ]
}
```

### Cron API 보안

```typescript
// app/api/cron/fetch-posts/route.ts
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  // 블로그 수집 로직
}
```

---

## 🚦 Proxy 설정 (Next.js Middleware)

### `proxy.ts` (프로젝트 루트)

메인 페이지 리다이렉트 및 인증 라우트 보호를 담당하는 프록시입니다.

```typescript
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Supabase 클라이언트 생성 (세션 검증용)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // 세션 확인
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 1. 메인 페이지(/) 리다이렉트
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/posts', request.url), { status: 301 });
  }

  // 2. 인증 필요 라우트 보호
  const protectedRoutes = ['/bookmarks', '/profile'];
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 3. 로그인 페이지 접근 시 이미 로그인된 경우 리다이렉트
  if (request.nextUrl.pathname === '/auth/login' && session) {
    const redirectPath = request.nextUrl.searchParams.get('redirect') || '/posts';
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
```

**기능:**

1. **메인 페이지 리다이렉트**: `/` → `/posts` (301 영구 리다이렉트)
2. **보호된 라우트**: `/bookmarks`, `/profile` - 로그인 필요
3. **로그인 페이지 최적화**: 이미 로그인 시 자동 리다이렉트
4. **Supabase 세션 검증**: 쿠키 기반 인증 상태 확인
5. **리다이렉트 경로 저장**: 로그인 후 원래 페이지로 복귀

---

## 🤖 AI 태그 생성 프롬프트

```typescript
const TAGGING_PROMPT = `
당신은 기술 블로그 게시글을 분석하는 전문가입니다.
다음 게시글의 제목과 내용을 분석하여 적절한 기술 태그를 3-5개 생성해주세요.

**태그 선택 가이드:**
- Frontend: React, Vue, Next.js, Angular, TypeScript, JavaScript, CSS, HTML
- Backend: Node.js, Java, Spring, Python, Django, Go, Kotlin, PHP
- Database: PostgreSQL, MongoDB, MySQL, Redis, Elasticsearch
- DevOps: Docker, Kubernetes, AWS, GCP, Azure, CI/CD, Terraform
- Mobile: React Native, Flutter, iOS, Android, Swift, Kotlin
- AI/ML: Machine Learning, Deep Learning, NLP, Computer Vision, LLM
- 기타: Architecture, Performance, Security, Testing, Agile

**규칙:**
1. 가장 관련성 높은 태그만 선택
2. 너무 일반적이거나 구체적이지 않게
3. 영어로 작성
4. 쉼표로 구분

제목: {title}
내용: {summary}

태그 (쉼표로 구분):
`;
```

---

## 🎨 UI/UX 디자인 가이드

### 색상 팔레트 (CSS 변수 기반 모노크롬)

> ⚠️ **하드코딩 금지**: `bg-blue-600`, `dark:bg-gray-900` 등 직접 색상 사용 금지

| 용도          | 클래스                          | 라이트    | 다크      |
| ------------- | ------------------------------- | --------- | --------- |
| 페이지 배경   | `bg-background`                 | `#FAFAFA` | `#141414` |
| 기본 텍스트   | `text-foreground`               | `#212121` | `#EBEBEB` |
| 카드 배경     | `bg-card` / `glass-card`        | `#FFFFFF` | `#1C1C1C` |
| 보조 배경     | `bg-muted` / `bg-secondary`     | `#F2F2F2` | `#292929` |
| 비활성 텍스트 | `text-muted-foreground`         | `#707070` | `#949494` |
| 구분선        | `border-border`                 | `#E0E0E0` | `#333333` |
| 강조 버튼     | `bg-foreground text-background` | 검정 버튼 | 흰 버튼   |
| 파괴적 액션   | `text-destructive`              | 빨강      | 빨강      |

**글래스모피즘 유틸리티** (`app/globals.css`):

- `.glass-sidebar` — 데스크탑 사이드바
- `.glass-card` — 게시글 카드, 공지사항 카드
- `.glass-modal` — 필터 모달

### 컴포넌트 스타일

- **헤더**:
  - 높이: h-16 (64px)
  - 고정: sticky top-0 z-50
  - 배경: backdrop-blur-md (반투명 효과)
  - 경계선: border-b

- **모바일 사이드 메뉴**:
  - 너비: w-64 (256px)
  - 애니메이션: transform transition-transform duration-300
  - 초기 상태: -translate-x-full (화면 밖)
  - 열린 상태: translate-x-0
  - 배경 오버레이: bg-black/50 (반투명 검정)
  - z-index: z-40

- **게시글 카드**:
  - 그림자: shadow-sm hover:shadow-md
  - 둥근 모서리: rounded-lg
  - 패딩: p-6
  - 호버 효과: 살짝 올라오는 애니메이션 (transform transition-transform hover:-translate-y-1)

- **페이지네이션**:
  - 현재 페이지: 강조 (bg-blue-600 text-white, 다크모드: bg-blue-500)
  - 호버 상태: bg-gray-200 (라이트), bg-gray-800 (다크)
  - 비활성 버튼: opacity-50 cursor-not-allowed
  - 간격: gap-2

### 반응형 브레이크포인트

- Mobile: < 768px (md 미만)
- Desktop: ≥ 768px (md 이상)

### 네비게이션 링크

- **포스트 (Posts)**: `/posts` - 모든 게시글 목록 (메인 페이지는 `/`에서 `/posts`로 리다이렉트)
- **공지사항 (Announcements)**: `/announcements` - 플랫폼 공지사항
- **즐겨찾기 (Bookmarks)**: `/bookmarks` - 내 즐겨찾기 (로그인 필요)
- **최근 본 글 (Recent Views)**: `/recent-views` - 최근 본 게시글 (로컬 스토리지)
- **프로필 (Profile)**: `/profile` - 사용자 프로필 (로그인 필요)
- **요청하기 (Request)**: `/request` - 새 기업 블로그 추가 요청
- **이용약관 (Terms)**: `/terms` - 서비스 이용약관
- **개인정보처리방침 (Privacy Policy)**: `/privacy-policy` - 개인정보 처리방침

### 레이아웃 상세 다이어그램

**데스크탑 레이아웃**

```
┌────────────────────────────────────────────────────────────────┐
│ 로고  포스트  블로그  즐겨찾기      [테마토글] [로그인]         │
├────────────────┬──────────────────────────────────────────────┤
│                │ 검색 바 (전체 너비)                           │
│  필터 버튼들   ├──────────────────────────────────────────────┤
│  (회사/태그)   │ [인기회사1] [인기회사2] ... [회사필터모달]    │
│                │ [인기태그1] [인기태그2] ... [태그필터모달]    │
│                ├──────────────────────────────────────────────┤
│                │ 선택된 회사 배지들 | 선택된 태그 배지들       │
│  선택 배지     ├──────────────────────────────────────────────┤
│                │ [게시글 카드 1] [게시글 카드 2] [게시글 카드 3]│
│                │ [게시글 카드 4] [게시글 카드 5] [게시글 카드 6]│
│                │ [게시글 카드 7] [게시글 카드 8] [게시글 카드 9]│
│                │                                              │
│                │ [이전] [1] [2] [3] [다음]                    │
│                │                                              │
├────────────────┴──────────────────────────────────────────────┤
│                           푸터                                 │
└────────────────────────────────────────────────────────────────┘
```

**모바일 레이아웃**

```
기본 상태:                    메뉴 열림:
┌──────────────────┐        ┌──────────────────┐
│로고      [메뉴]  │        │로고 [테마] [로그인]│
├──────────────────┤        ├──┬───────────────┤
│ 검색 바          │        │  │ 포스트        │
├──────────────────┤        │  │ 블로그        │
│ [게시글 카드 1]  │        │  │ 즐겨찾기      │
│ [게시글 카드 2]  │        │  │               │
│ [게시글 카드 3]  │        │  │               │
│ [게시글 카드 4]  │        │  │               │
│                  │        │  │               │
│ [이전] [1] [다음]│        │  │               │
├──────────────────┤        │  │               │
│     푸터         │        │  │               │
└──────────────────┘        └──┴───────────────┘
```

---

## 🚀 개발 로드맵

### Phase 1: UI/UX 완성 ✅

- [x] Next.js 프로젝트 초기화
- [x] 기본 레이아웃 (Header, Footer, Navigation)
- [x] 모바일 메뉴 (슬라이드 애니메이션, 뒤로가기 지원)
- [x] 다크/라이트 모드 테마 시스템
- [x] 게시글 카드 & 리스트 (그리드 레이아웃)
- [x] 페이지네이션 (URL 파라미터 지원)
- [x] 검색 & 태그 필터 UI (모달 + 인기 태그)
- [x] 회사 필터 UI (모달 + 인기 회사 배지)
- [x] URL 쿼리 파라미터 상태 관리 (`?page=2&search=react&tags=Frontend,Backend&companies=toss,kakao`)

### Phase 2: 백엔드 인프라 구축 ✅

**2-1. Supabase 설정**

- [x] Supabase 프로젝트 생성
- [x] DB 테이블 생성 (companies, posts, bookmarks, tags)
- [x] RLS 정책 설정
- [x] 초기 데이터 입력 (토스, 카카오)

**2-2. Cron Job & 블로그 수집**

- [x] `vercel.json` 설정 (0 _/3 _ \* \*)
- [x] CRON_SECRET 인증
- [x] `app/api/cron/fetch-blogs/route.ts` 구현
- [x] RSS 피드 파싱 (rss-parser)
- [x] 중복 감지 (URL 기반)
- [x] 키워드 기반 태그 선택
- [x] DB에 게시글 저장

### Phase 3: API 엔드포인트 구현 ✅

**3-1. 게시글 조회 API**

- [x] `app/api/posts/route.ts` 구현
  - 검색 필터링 (제목)
  - 태그 필터링 (OR 조건)
  - 회사 필터링 (OR 조건)
  - 페이지네이션
  - 정렬 옵션

**3-2. 기업 관리 API**

- [x] `app/api/companies/route.ts` 구현 (GET)
- [x] 인기 회사 조회 엔드포인트 (`is_featured=true`)
- [x] 전체 활성 회사 조회 엔드포인트

**3-3. 즐겨찾기 API**

- [x] `app/api/bookmarks/route.ts` 구현
- [x] 사용자 인증 필요

### Phase 4: 프론트엔드 연결 ✅

**4-1. features/ 구조 구현**

- [x] `features/posts/services/fetch.ts` - API 호출
- [x] `features/posts/services/filter.ts` - 필터링 로직
- [x] `features/posts/hooks/usePosts.ts` - 데이터 조회 훅
- [x] `features/blogs/services/fetch.ts` - 기업 정보 조회
- [x] `features/blogs/hooks/useCompanies.ts` - 기업 훅

**4-2. 컴포넌트 업데이트**

- [x] `components/PostsContainer.tsx` - Mock 데이터 → API
- [x] `components/posts/PostList.tsx` - 로딩/에러 상태
- [x] 실시간 검색/필터링 구현

### Phase 5: 사용자 기능 ✅

**5-1. 인증 및 즐겨찾기**

- [x] GitHub OAuth 로그인
- [x] 즐겨찾기 추가/삭제
- [x] 내 즐겨찾기 페이지
- [x] 로그아웃

**5-2. 관리자 페이지**

- [x] `app/(pages)/admin/companies/page.tsx`
- [x] 기업 블로그 목록 페이지 (`/blogs`)

### Phase 6: 추가 기능 구현 ✅

**6-1. 공지사항 기능**

- [x] 공지사항 테이블 생성
- [x] 공지사항 API 구현
- [x] 공지사항 목록 페이지
- [x] 타입별 배지 표시

**6-2. 최근 본 글 기능**

- [x] 로컬 스토리지 기반 구현
- [x] 최대 50개 저장
- [x] 날짜별 그룹화 UI
- [x] 전체 삭제 기능

**6-3. 프로필 페이지**

- [x] 사용자 프로필 UI
- [x] 활동 히트맵 (GitHub 스타일)
- [x] 즐겨찾기 통계
- [x] 계정 삭제 기능

**6-4. 법적 페이지**

- [x] 이용약관 페이지
- [x] 개인정보처리방침 페이지

### Phase 7: SEO 및 최적화 ✅

- [x] **SEO 설정**: robots.ts, sitemap.ts 동적 생성, JSON-LD 스키마
- [x] **RSS 피드**: /feed.xml 동적 생성
- [x] **이미지 최적화**: WebP 포맷으로 변환 (32개 로고)
- [x] **분석 도구**: Google Analytics 연결
- [x] **모니터링**: Sentry 10.35.0 설정
- [x] **Middleware**: 메인 페이지 리다이렉트 (/ → /posts)

### Phase 8: 배포 및 운영 (현재) 🔄

- [x] **Vercel 배포**: 프로덕션 환경 배포 완료
- [x] **Cron Job**: 블로그 자동 수집 (매일 실행)
- [x] **32개 기업 블로그**: 토스, 카카오, 네이버, 라인, 우아한형제들 등
- [x] **디자인 전면 개편**: 모노크롬 + 글래스모피즘 + YouTube식 사이드바
- [x] **shadcn/ui + GSAP**: 사이드바 애니메이션, UI 컴포넌트
- [x] **로고/PWA 이미지 개편**: `</>` 아이콘, 블랙 배경 og-image/splash
- [x] **문서화**: CLAUDE.md 최신화
- [ ] **성능 모니터링**: Lighthouse 점수 개선
- [ ] **사용자 피드백**: 기능 개선

### Phase 9: 향후 계획

- [ ] 게시글 상세 페이지
- [ ] 댓글 기능
- [ ] 북마크 공유 기능
- [ ] 태그 추천 알고리즘 개선
- [ ] 모바일 앱 (React Native)

### Phase 10: Push 알림 기능 🔄

**10-1. DB 준비**

- [ ] `push_subscriptions` 테이블 생성 (마이그레이션 `016`)
- [ ] `notification_preferences` 테이블 생성 (마이그레이션 `017`)
- [ ] RLS 정책 설정

**10-2. 백엔드 API**

- [ ] `POST /api/notifications/subscribe` — 구독 저장
- [ ] `DELETE /api/notifications/subscribe` — 구독 해제
- [ ] `PUT /api/notifications/subscribe` — 기기별 enabled 변경 (OS 단위 bulk)
- [ ] `GET /api/notifications/preferences` — 알림 설정 + 기기 목록 조회
- [ ] `PUT /api/notifications/preferences` — 전체 알림 on/off 변경
- [ ] `POST /api/notifications/send` — Push 발송 (CRON_SECRET 인증, GitHub Actions 호출용)

**10-3. 프론트엔드**

- [ ] `public/sw.js` — Service Worker (Push 수신, 알림 클릭 이동)
- [ ] `features/notifications/services/device-detect.ts` — device_os, browser 감지
- [ ] `features/notifications/hooks/usePushSubscription.ts` — 구독 로직
- [ ] `features/notifications/hooks/useNotificationPreferences.ts` — 설정 조회/변경
- [ ] `features/notifications/ui/NotificationSettings.tsx` — 알림 설정 UI
- [ ] 프로필 페이지에 NotificationSettings 섹션 추가
- [ ] `lib/query-keys.ts`에 notifications 키 추가

**10-4. GitHub Actions 연동**

- [ ] `scripts/fetch-posts.ts` — 저장 후 `/api/notifications/send` 호출
- [ ] `.github/workflows/fetch-posts.yml` — `CRON_SECRET`, `NEXT_PUBLIC_SITE_URL` 환경 변수 추가

**10-5. 환경 변수**

- [ ] `.env.local`에 VAPID Keys 추가
- [ ] Vercel 환경 변수에 VAPID Keys 추가
- [ ] GitHub Actions Secrets에 `CRON_SECRET`, `NEXT_PUBLIC_SITE_URL` 추가

**10-6. 테스트**

- [ ] 구독 저장/해제 확인
- [ ] 전체 토글 on/off 확인
- [ ] 기기별 토글 on/off 확인
- [ ] Push 실제 수신 확인
- [ ] 만료된 구독 자동 삭제 확인

---

## 📦 기업 블로그 관리 시스템

### 초기 개발 대상

**2개 기업으로 시작하여 시스템 안정화 후 확장**

1. **토스 (Toss)**
   - 블로그 URL: https://toss.tech/
   - RSS URL: https://toss.tech/rss.xml
   - 카테고리: 핀테크, 대기업

2. **카카오 (Kakao)**
   - 블로그 URL: https://tech.kakao.com/
   - RSS URL: https://tech.kakao.com/feed/
   - 카테고리: IT, 대기업

### 향후 추가 예정 블로그 목록

**데이터베이스 관리 시스템을 통해 지속적으로 추가**

#### 대기업

- 네이버 (Naver): https://d2.naver.com/home
- 라인 (LINE): https://engineering.linecorp.com/ko/blog/
- 쿠팡 (Coupang): https://medium.com/coupang-engineering/kr/home
- 우아한형제들 (배달의민족): https://techblog.woowahan.com/
- 당근마켓 (Daangn): https://medium.com/daangn
- 삼성전자: https://techblog.samsung.com/
- 네이버 클라우드: https://medium.com/naver-cloud-platform
- 카카오뱅크: https://tech.kakaobank.com/
- 카카오페이: https://tech.kakaopay.com/

#### 중견/스타트업

- 컬리 (Kurly): https://helloworld.kurly.com/
- 직방 (Zigbang): https://medium.com/zigbang
- 야놀자 (Yanolja): https://medium.com/yanolja/tech/home
- 무신사 (Musinsa): https://medium.com/musinsa-tech
- 29CM: https://medium.com/29cm
- 버킷플레이스 (오늘의집): https://www.bucketplace.com/post/
- 마이리얼트립: https://medium.com/myrealtrip-product
- 뱅크샐러드: https://blog.banksalad.com/
- 하이퍼커넥트: https://hyperconnect.github.io/
- 11번가: https://11st-tech.github.io/

### 기업 블로그 추가 프로세스

1. **관리자 페이지에서 신규 기업 등록**
   - 기업명 (한글/영문)
   - 블로그 URL
   - RSS Feed URL
   - 로고 이미지 URL (선택)
   - 카테고리 선택
   - 설명 (선택)

2. **RSS URL 자동 검증**
   - RSS Feed 파싱 테스트
   - 최신 게시글 확인
   - 에러 발생 시 알림

3. **활성화 및 수집 시작**
   - 상태를 'active'로 변경
   - 다음 Cron 실행 시 자동 수집 시작

### 기업 블로그 관리 기능

- ✅ 기업 추가/수정/삭제
- ✅ 활성화/비활성화 토글
- ✅ RSS URL 변경 시 자동 업데이트
- ✅ 수집 실패 로그 및 알림
- ✅ 기업별 게시글 통계 (수집된 글 수, 최근 업데이트)
- ✅ 카테고리별 분류 (대기업, 스타트업, 핀테크, 커머스 등)

---

## 🧪 테스트 전략

- **단위 테스트**: Vitest
- **E2E 테스트**: Playwright
- **주요 테스트 케이스**:
  - RSS 파싱 정확도
  - 중복 게시글 필터링
  - 페이지네이션 로직
  - 즐겨찾기 CRUD
  - 태그 검색

---

## 📝 코딩 컨벤션

### TypeScript

- **Strict Mode**: 활성화
- **Naming**:
  - 컴포넌트: PascalCase (PostCard.tsx)
  - 함수/변수: camelCase
  - 상수: UPPER_SNAKE_CASE
  - 타입/인터페이스: PascalCase (prefix 'I' 사용 안 함)

### 파일 구조 및 Export 방식

**원칙: 위치별로 다른 export 방식 사용**

#### 1. `app/` 경로 (페이지, 레이아웃, API 라우트)

- **export default function** 사용
- Next.js 규칙을 따름 (page.tsx, layout.tsx, route.ts)

```typescript
// app/page.tsx
export default function Home() {
  // ...
}

// app/api/posts/route.ts
export async function GET(request: Request) {
  // ...
}
```

#### 2. `components/`, `features/services/`, `shared/` 등 (공유 코드)

- **function 키워드** 사용
- Named export 사용

```typescript
// components/PostCard.tsx
interface PostCardProps {
  post: Post;
  onBookmark?: (postId: string) => void;
}

export function PostCard({ post, onBookmark }: PostCardProps) {
  // ...
}
```

```typescript
// features/posts/services/fetch.ts
export async function fetchPosts(page: number) {
  // ...
}

export function filterPosts(posts: Post[], tags: string[]) {
  // ...
}
```

#### 3. 각 폴더의 `index.ts` (배럴 export)

- **원칙**: `export * from "./파일명"`으로 서브폴더/파일 export
- 필요한 경우만 export (모든 파일을 export할 필요 없음)
- 중앙 진입점 제공으로 import 경로 단순화

```typescript
// components/posts/index.ts
export * from './PostCard';
export * from './PostList';
export * from './Pagination';

// features/posts/index.ts
export * from './services';
export * from './hooks';
```

**사용:**

```typescript
// 이전 (복잡한 경로)
import { PostCard } from '@/components/posts/PostCard';
import { Pagination } from '@/components/posts/Pagination';

// 이후 (단순화된 경로)
import { PostCard, Pagination } from '@/components/posts';
```

### React 컴포넌트

- Functional Components만 사용
- Props는 interface로 정의
- `components/` 폴더의 컴포넌트는 function 키워드 + named export
- `app/` 경로의 컴포넌트는 export default function

```typescript
// ✅ components 폴더
interface PostCardProps {
  post: Post;
  onBookmark?: (postId: string) => void;
}

export function PostCard({ post, onBookmark }: PostCardProps) {
  return <div>...</div>;
}

// ✅ app 경로
export default function Home() {
  return <div>...</div>;
}
```

### page.tsx 규칙

**원칙: page.tsx는 항상 서버 컴포넌트**

- **`'use client'` 디렉티브 금지** (기본적으로 서버 컴포넌트)
- 클라이언트 전용 로직은 `features/{기능}/ui/` 컴포넌트로 분리
- page.tsx는 다음만 담당:
  - 메타데이터 설정 (title, description 등)
  - 데이터 페칭 (필요시)
  - 레이아웃 구성
  - 클라이언트 컴포넌트 렌더링

**구조:**

```typescript
// ✅ app/(pages)/posts/page.tsx (서버 컴포넌트)
import { PostsContainer } from '@/features/posts/ui/PostsContainer';

export const metadata = {
  title: '포스트',
  description: '모든 개발 블로그 포스트',
};

export default function PostsPage() {
  // 데이터 페칭이 필요시 여기서
  // const posts = await fetchPosts();

  return (
    <div>
      <h1>포스트</h1>
      <PostsContainer /> {/* 클라이언트 컴포넌트 */}
    </div>
  );
}
```

```typescript
// ❌ 잘못된 예
'use client'; // 금지!
import { useState } from 'react';

export default function RequestPage() {
  const [formData, setFormData] = useState(...); // 클라이언트 로직
  return ...;
}

// ⚠️ app/ 폴더에는 app 관련 파일만 있어야 함
// - page.tsx, layout.tsx, error.tsx, loading.tsx, route.ts 등만 가능
// - 컴포넌트를 따로 만들지 말 것 (components/ 폴더 사용)
```

```typescript
// ✅ 올바른 예
// app/(pages)/request/page.tsx (서버 컴포넌트)
import { RequestForm } from '@/features/request/ui/RequestForm';

export const metadata = { title: '요청하기' };

export default function RequestPage() {
  return (
    <div>
      <h1>요청하기</h1>
      <RequestForm /> {/* 'use client' 컴포넌트 */}
    </div>
  );
}
```

---

## 🔐 인증 시스템 (Supabase + Jotai)

### 작동 방식

**1. 초기 로드 (서버)**

```
사용자 접속 → Header (서버 컴포넌트)
  → getCurrentUser() (Supabase 서버 클라이언트)
  → 쿠키에서 토큰 읽기 → HeaderClient에 user props 전달
```

**2. 상태 관리 (클라이언트)**

```
HeaderClient (클라이언트 컴포넌트)
  → userAtom 업데이트 (Jotai)
  → 다른 컴포넌트에서 useAtom(userAtom) 구독
  → 로그인 상태 변경 시 자동 리렌더링
```

**3. 로그아웃 (서버)**

```
로그아웃 버튼 클릭
  → useLogout() Hook 호출 (TanStack Query mutation)
  → POST /api/auth/logout
  → 서버에서 supabase.auth.signOut()
  → 쿠키 자동 삭제
  → router.refresh() → 페이지 새로고침
```

### 파일 구조

```typescript
// atoms/auth.ts - 전역 상태
export const userAtom = atom<User | null>(null);
export const isAuthLoadingAtom = atom<boolean>(true);

// components/layout/Header.tsx - 서버 컴포넌트
export async function Header() {
  const user = await getCurrentUser(); // 서버에서 확인
  return <HeaderClient user={user} />;
}

// components/layout/HeaderClient.tsx - 클라이언트 컴포넌트
export function HeaderClient({ user }: HeaderClientProps) {
  const [, setUser] = useAtom(userAtom);

  useEffect(() => {
    setUser(user); // props로 받은 user를 atom에 저장
  }, [user, setUser]);

  return <div>...</div>;
}

// features/auth/hooks/useLogout.ts - 로그아웃 훅
export function useLogout() {
  const router = useRouter();
  const [, setUser] = useAtom(userAtom); // atom에서 user 제거

  return useMutation({
    // 콜백: 화살표 함수
    mutationFn: async () => {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (!response.ok) throw new Error('Logout failed');
    },
    // 콜백: 화살표 함수
    onSuccess: () => {
      setUser(null); // 로그아웃 후 상태 초기화
      router.refresh();
      router.push('/');
    },
  });
}

// app/api/auth/logout/route.ts - 로그아웃 API
export async function POST() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut(); // 쿠키에서 토큰 제거
  return NextResponse.json({ message: 'Logged out' });
}
```

### Jotai 사용 패턴

**패턴 1: 값 읽기만**

```typescript
const [user] = useAtom(userAtom);
```

**패턴 2: 값 수정**

```typescript
const [user, setUser] = useAtom(userAtom);
setUser(newUser);
```

**패턴 3: 파생 상태 (derived atom)**

```typescript
// 콜백으로 전달: 화살표 함수
export const isLoggedInAtom = atom((get) => {
  const user = get(userAtom);
  return user !== null;
});

// 사용
const [isLoggedIn] = useAtom(isLoggedInAtom);
```

### Commit Message

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

## 🔒 보안 고려사항

1. **API 보안**:
   - Cron Job: CRON_SECRET 인증
   - Supabase RLS: 사용자별 권한 관리

2. **환경 변수**:
   - 민감 정보는 .env.local에만
   - Git에 커밋하지 않음

3. **XSS 방지**:
   - 사용자 입력 sanitize
   - React의 자동 이스케이프 활용

4. **Rate Limiting**:
   - Vercel Edge Config로 API 호출 제한

---

## 📈 모니터링 및 로깅

### 분석 도구

- **Google Analytics (GA4)**:
  - 페이지 뷰 추적
  - 사용자 행동 분석
  - 이벤트 트래킹 (검색, 필터, 북마크 등)
  - `lib/gtag.ts`를 통한 커스텀 이벤트
- **Vercel Analytics**:
  - 트래픽 분석
  - 성능 모니터링
  - Core Web Vitals 추적

### 에러 모니터링

- **Sentry 10.35.0**:
  - 실시간 에러 트래킹
  - 사용자 영향 분석
  - 스택 트레이스 수집
  - 배포별 에러 추적

### 데이터베이스 모니터링

- **Supabase Dashboard**:
  - DB 쿼리 성능
  - 테이블 통계
  - API 사용량
  - 실시간 로그

### 로깅

- **Console Logging**:
  - Cron Job 실행 로그
  - RSS 파싱 성공/실패
  - 키워드 기반 태그 선택 결과
  - API 요청/응답 로그
- **Rate Limiting**:
  - API 호출 제한 (`utils/rate-limit.ts`)
  - IP 기반 제한
  - 사용자별 제한

### SEO 최적화

- **동적 생성**:
  - `app/robots.ts`: robots.txt 동적 생성
  - `app/sitemap.ts`: sitemap.xml 동적 생성
  - `app/schema.ts`: JSON-LD 스키마
- **RSS 피드**:
  - `app/feed.xml/route.ts`: RSS 2.0 피드 생성
  - 최신 게시글 자동 업데이트
- **메타 태그**:
  - Open Graph (OG) 태그
  - Twitter Card
  - 페이지별 메타데이터

---

## 🤝 기여 가이드

### 새 기업 블로그 추가

1. `supabase/seed.sql`에 기업 정보 추가
2. RSS URL 동작 확인
3. 테스트 후 PR 생성

### 버그 리포트

- GitHub Issues 사용
- 재현 가능한 상황 설명
- 스크린샷 첨부

---

## 📚 참고 자료

- [Next.js 14 문서](https://nextjs.org/docs)
- [Supabase 문서](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [OpenAI API](https://platform.openai.com/docs)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [RSS 2.0 Specification](https://www.rssboard.org/rss-specification)

---

## 📞 연락처

- **개발자**: jm4293
- **도메인**: devBlog.kr
- **GitHub**: [https://github.com/jm4293/dev-blog]

---

**마지막 업데이트**: 2026년 2월 19일

## 📊 현재 프로젝트 현황

### 주요 통계

- **등록된 블로그**: 32개 기업
- **수집된 게시글**: 지속적 업데이트
- **주요 기능**: 게시글 검색/필터링, 북마크, 최근 본 글, 프로필, 공지사항, Push 알림 (기획 중)
- **기술 스택**: Next.js 14.2.0, TypeScript 5, Supabase, TanStack Query 5.90.16, shadcn/ui, GSAP
- **배포 환경**: Vercel (프로덕션)
- **모니터링**: Sentry, Google Analytics

### 개발 단계

- ✅ Phase 1-5: 완료 (UI/UX, 백엔드, API, 사용자 기능)
- ✅ Phase 6-7: 완료 (추가 기능, SEO, 최적화)
- 🔄 Phase 8: 진행 중 (운영 및 개선)
- 📋 Phase 9: 계획 중 (향후 기능)
- 🔄 Phase 10: 진행 중 (Push 알림 — 기획/문서화 완료, 구현 대기)
