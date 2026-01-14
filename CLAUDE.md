# devBlog.kr - 한국 개발 기업 블로그 모음 플랫폼

> 생성일: 2026년 1월 9일
>
> 한국 개발 기업들의 기술 블로그를 한 곳에서 모아볼 수 있는 플랫폼

## 📋 프로젝트 개요

devBlog.kr은 다양한 한국 IT 기업들의 기술 블로그 게시글을 자동으로 수집하고, AI 기반 태그 분류를 통해 개발자들이 원하는 정보를 쉽게 찾을 수 있도록 돕는 웹 플랫폼입니다.

### 참고 사이트

- https://www.techblogposts.com/ko

---

## 🛠 기술 스택

### Frontend

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (라이트/다크 모드 지원)
- **State Management**: Jotai (전역 상태 관리)
- **Data Fetching**: TanStack Query (React Query)

### Backend & Infrastructure

- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (GitHub OAuth)
- **Cron Jobs**: Vercel Cron Jobs
- **AI API**: OpenAI GPT API
- **Hosting**: Vercel

### Libraries

- **State Management**: Jotai
- **Data Fetching**: TanStack Query (React Query)
- **RSS Parsing**: rss-parser
- **Date Handling**: date-fns
- **HTTP Client**: fetch (native)
- **Form**: react-hook-form
- **Icons**: lucide-react

---

## 🎯 핵심 기능

### 1. 블로그 자동 수집 스케줄러

- **실행 주기**: 하루 8번 (3시간 간격)
- **스케줄**: 00:00, 03:00, 06:00, 09:00, 12:00, 15:00, 18:00, 21:00 (KST)
- **방법**: Vercel Cron Jobs + Next.js API Route
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
- **상태 관리**: Jotai를 사용하여 사용자 정보, 로그인 상태를 전역으로 관리
- **서버 확인**: 초기 로드 시 서버에서 로그인 상태 확인 후 클라이언트에 전달
- **즐겨찾기 기능**:
  - 로그인한 사용자만 이용 가능
  - 사용자별 즐겨찾기 목록 관리 (Jotai atom으로 캐싱)
  - 즐겨찾기 필터링 기능

### 4. 검색 및 필터링

- **텍스트 검색**: 게시글 제목 기반 검색 (Full-text search)
- **태그 필터링**: 다중 태그 선택 가능 (OR 조건)
- **회사 필터링**: 다중 회사 선택 가능 (OR 조건)
- **정렬 옵션**:
  - 최신순 (기본값)
  - 회사별
  - 태그별

#### URL 쿼리 파라미터

검색, 태그 필터, 회사 필터, 페이지 정보는 URL 쿼리 파라미터로 저장되어 사용자가 필터링된 결과를 공유할 수 있습니다.

**파라미터 구조**:

```
/?page=2&search=react&tags=Frontend,Backend&companies=toss,kakao
```

- `page`: 현재 페이지 번호 (기본값: 1)
- `search`: 검색 쿼리 (URL 인코딩됨)
- `tags`: 선택된 태그 (쉼표로 구분)
- `companies`: 선택된 회사 ID (쉼표로 구분)

**예시**:

- 기본: `/` 또는 `/?page=1`
- 검색: `/?search=react&page=1`
- 태그: `/?tags=Frontend,Backend&page=1`
- 회사: `/?companies=toss,kakao&page=1`
- 모두: `/?search=react&tags=Frontend,Backend&companies=toss,kakao&page=2`

**구현 방식**:

- `app/page.tsx`: 메인 페이지, 라우팅 및 데이터 관리
- `components/PostsContainer.tsx`: useSearchParams() 훅으로 URL 파라미터 읽기, 상태 동기화, URL 업데이트 처리
- `components/search/SearchBar.tsx`: 검색어 변경 시 콜백 호출
- `components/search/CompanyFilter.tsx`: 회사 필터 모달 및 선택 UI
- `components/posts/Pagination.tsx`: onPageChange 콜백으로 URL 업데이트

### 5. 페이지네이션

- **방식**: 페이지 번호 기반 (무한 스크롤 X)
- **페이지당 게시글 수**: 20개
- **네비게이션 구성**:
  ```
  [처음] [이전] [1] [2] [3] [4] [5] [다음] [마지막]
  ```
- **동적 페이지 번호**: 현재 페이지 기준 ±2 페이지 표시

### 6. UI/UX

- **테마**: 라이트 모드 / 다크 모드 (사용자 선택 & 시스템 설정 감지)
- **반응형 브레이크포인트**:
  - 모바일: < 768px (md 미만)
  - 데스크탑: ≥ 768px (md 이상)

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

- **헤더**:
  - 좌측: 로고 + 포스트 + 블로그 + 즐겨찾기 (가로 배치)
  - 우측: 테마 토글 + 로그인 버튼 (제일 마지막)
  - 햄버거 메뉴 숨김
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
```

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
├── CLAUDE.md                   # 이 문서
│
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root 레이아웃 (테마 프로바이더)
│   ├── page.tsx                # 메인 페이지 (게시글 목록)
│   ├── globals.css             # Tailwind CSS
│   │
│   ├── api/                    # API 라우트 (서버)
│   │   ├── cron/
│   │   │   └── fetch-blogs/
│   │   │       └── route.ts    # 블로그 자동 수집 (3시간마다)
│   │   ├── posts/
│   │   │   └── route.ts        # 게시글 조회 API (검색, 필터, 페이지네이션)
│   │   ├── bookmarks/
│   │   │   └── route.ts        # 즐겨찾기 CRUD API
│   │   ├── companies/
│   │   │   └── route.ts        # 기업 목록/관리 API
│   │   └── auth/
│   │       ├── callback/
│   │       │   └── route.ts    # GitHub OAuth 콜백
│   │       └── signout/
│   │           └── route.ts    # 로그아웃
│   │
│   ├── (pages)/                # 페이지 그룹
│   │   ├── admin/
│   │   │   └── companies/
│   │   │       └── page.tsx    # 기업 블로그 관리 페이지
│   │   ├── blogs/
│   │   │   └── page.tsx        # 기업 블로그 목록 페이지
│   │   └── bookmarks/
│   │       └── page.tsx        # 즐겨찾기 페이지
│
├── components/                 # React 컴포넌트
│   ├── layout/
│   │   ├── Header.tsx          # 헤더 (반응형)
│   │   ├── MobileMenu.tsx      # 모바일 사이드 메뉴
│   │   ├── Navigation.tsx      # 네비게이션 링크
│   │   ├── Sidebar.tsx         # 태그 필터 사이드바 (데스크탑)
│   │   └── Footer.tsx          # 푸터
│   │
│   ├── posts/
│   │   ├── PostCard.tsx        # 개별 게시글 카드
│   │   ├── PostList.tsx        # 게시글 그리드
│   │   └── Pagination.tsx      # 페이지네이션 (URL 파라미터 지원)
│   │
│   ├── search/
│   │   ├── SearchBar.tsx       # 검색 UI
│   │   ├── CompanyFilter.tsx   # 회사 필터 모달 및 인기 회사
│   │   └── TagFilter.tsx       # 태그 필터 모달 및 인기 태그
│   │
│   ├── admin/
│   │   ├── CompanyList.tsx     # 기업 목록 테이블
│   │   ├── CompanyForm.tsx     # 기업 추가/수정 폼
│   │   └── CompanyStats.tsx    # 기업별 통계
│   │
│   ├── auth/
│   │   ├── LoginButton.tsx     # GitHub OAuth 로그인
│   │   └── UserProfile.tsx     # 사용자 프로필
│   │
│   ├── theme/
│   │   └── ThemeToggle.tsx     # 다크/라이트 모드 토글
│   │
│   ├── ui/                     # shadcn/ui 기본 컴포넌트
│   │   └── ...
│   │
│   └── PostsContainer.tsx      # 검색/필터/페이지네이션 통합 (URL 파라미터 관리)
│
├── features/                   # 기능별 로직
│   ├── posts/
│   │   ├── services/
│   │   │   ├── fetch.ts        # 게시글 조회 로직
│   │   │   ├── filter.ts       # 검색/필터링 로직
│   │   │   └── types.ts        # Post 관련 타입
│   │   │
│   │   └── hooks/
│   │       ├── usePosts.ts     # 게시글 조회 훅
│   │       └── usePostFilter.ts # 필터링 훅
│   │
│   ├── blogs/
│   │   ├── services/
│   │   │   ├── rss-parser.ts   # RSS 피드 파싱
│   │   │   ├── fetch.ts        # 블로그/회사 조회 로직
│   │   │   ├── filter.ts       # 회사 필터링 로직 (인기 회사 등)
│   │   │   └── types.ts        # Company 관련 타입
│   │   │
│   │   └── hooks/
│   │       └── useCompanies.ts # 기업 정보 조회 훅
│   │
│   ├── ai/
│   │   ├── services/
│   │   │   ├── openai.ts       # OpenAI API 래퍼
│   │   │   ├── summarize.ts    # 요약 생성 (1-2줄)
│   │   │   ├── tagging.ts      # 태그 자동 생성
│   │   │   └── types.ts        # AI 관련 타입
│   │   │
│   │   └── prompts/
│   │       ├── summarize.prompt.ts   # 요약 프롬프트
│   │       └── tagging.prompt.ts     # 태그 생성 프롬프트
│   │
│   ├── auth/
│   │   ├── services/
│   │   │   ├── github.ts       # GitHub OAuth
│   │   │   └── types.ts        # Auth 관련 타입
│   │   │
│   │   └── hooks/
│   │       └── useAuth.ts      # 인증 훅
│   │
│   ├── bookmarks/
│   │   ├── services/
│   │   │   └── types.ts        # Bookmark 관련 타입
│   │   │
│   │   └── hooks/
│   │       └── useBookmarks.ts # 즐겨찾기 훅
│   │
│   ├── request/
│       ├── actions/
│       │   ├── submit.ts       # 요청 제출 Server Action
│       │   └── index.ts        # 배럴 export
│       │
│       ├── hooks/
│       │   ├── useSubmitRequest.ts # 요청 제출 mutation 훅
│       │   └── index.ts        # 배럴 export
│       │
│       ├── ui/
│       │   ├── RequestForm.tsx  # 요청 폼 컴포넌트 (클라이언트)
│       │   └── index.ts        # 배럴 export
│       │
│       └── index.ts            # 배럴 export (actions, hooks, ui export)
│
│   └── login/
│       ├── ui/
│       │   ├── LoginContainer.tsx # 로그인 UI 컴포넌트 (클라이언트)
│       │   └── index.ts        # 배럴 export
│       │
│       └── index.ts            # 배럴 export (ui export)
│
├── atoms/                      # Jotai 전역 상태 (atoms)
│   ├── auth.ts                 # 인증 관련 atom
│   ├── ui.ts                   # UI 상태 atom (테마, 모달 등)
│   ├── filters.ts              # 검색/필터 상태 atom
│   └── index.ts                # 배럴 export
│
├── supabase/                   # Supabase 클라이언트 & 타입
│   ├── client.ts               # 클라이언트용 Supabase
│   ├── server.ts               # 서버용 Supabase (API 라우트)
│   ├── types.ts                # DB 타입
│   └── index.ts                # 배럴 export
│
├── utils/                      # 공유 유틸리티
│   ├── date.ts                 # 날짜 포맷팅
│   ├── string.ts               # 문자열 처리
│   ├── cn.ts                   # className 유틸
│   ├── constants.ts            # 상수
│   └── index.ts                # 배럴 export
│
├── hooks/                      # 공유 훅
│   ├── use-posts.ts            # 게시글 조회 훅
│   ├── use-companies.ts        # 기업 정보 조회 훅
│   ├── use-bookmarks.ts        # 즐겨찾기 훅
│   ├── use-tags.ts             # 태그 조회 훅
│   └── index.ts                # 배럴 export
│
├── types/                      # 전역 타입
│   ├── index.ts                # 모든 타입 export
│   ├── api.ts                  # API 요청/응답 타입
│   ├── database.ts             # DB 스키마 타입
│   └── common.ts               # 공통 타입
│
└── supabase/                   # Supabase 설정
    ├── migrations/             # DB 마이그레이션
    │   ├── 001_create_companies.sql
    │   ├── 002_create_posts.sql
    │   ├── 003_create_bookmarks.sql
    │   ├── 004_create_tags.sql
    │   └── 005_add_rls_policies.sql
    │
    └── seed.sql                # 초기 데이터 (토스, 카카오)
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
├── auth.ts          # 사용자 정보, 로그인 상태 등
├── ui.ts            # 테마, 모달 상태 등
├── filters.ts       # 검색/필터 상태
└── index.ts         # 배럴 export
```

**예: 인증 상태 관리 (atoms/auth.ts)**

```typescript
import { atom } from 'jotai';
import type { User } from '@supabase/auth-js';

// 현재 로그인한 사용자
export const userAtom = atom<User | null>(null);

// 로딩 상태
export const isAuthLoadingAtom = atom<boolean>(true);

// 에러 상태
export const authErrorAtom = atom<Error | null>(null);
```

**예: UI 상태 관리 (atoms/ui.ts)**

```typescript
import { atom } from 'jotai';

// 모바일 메뉴 열림/닫힘
export const mobileMenuOpenAtom = atom<boolean>(false);

// 필터 모달 열림/닫힘
export const filterModalOpenAtom = atom<boolean>(false);

// 현재 테마
export const themeAtom = atom<'light' | 'dark'>('light');
```

**예: 필터 상태 관리 (atoms/filters.ts)**

```typescript
import { atom } from 'jotai';

// 검색 쿼리
export const searchQueryAtom = atom<string>('');

// 선택된 태그
export const selectedTagsAtom = atom<string[]>([]);

// 선택된 회사
export const selectedCompaniesAtom = atom<string[]>([]);

// 현재 페이지
export const currentPageAtom = atom<number>(1);
```

**사용 방식:**

```typescript
// 클라이언트 컴포넌트에서
'use client';

import { useAtom } from 'jotai';
import { userAtom, isAuthLoadingAtom } from '@/atoms/auth';

export function HeaderClient() {
  const [user] = useAtom(userAtom);
  const [isLoading] = useAtom(isAuthLoadingAtom);

  return (
    <div>
      {!isLoading && !user ? (
        <button>로그인</button>
      ) : (
        <button>로그아웃</button>
      )}
    </div>
  );
}
```

**특징:**
- ✅ 최소한의 보일러플레이트
- ✅ 가볍고 빠른 성능
- ✅ TypeScript 완벽 지원
- ✅ 컴포넌트 외부에서도 상태 접근 가능
- ✅ Context API와 다르게 Provider 불필요 (기본 제공)

#### **supabase/** - Supabase 클라이언트 & 타입

- Supabase 클라이언트 (클라이언트/서버)
- DB 타입 정의
- 중앙 진입점 (index.ts)

#### **utils/** - 공유 유틸리티

- 날짜 포맷팅 유틸
- 문자열 처리 유틸
- className 유틸 (cn)
- 상수 정의

#### **hooks/** - 공유 훅

- usePosts: 게시글 조회 훅
- useCompanies: 기업 정보 조회 훅
- useBookmarks: 즐겨찾기 훅
- useTags: 태그 조회 훅

#### **types/** - 전역 타입

- Database 스키마
- API 요청/응답 타입
- 공통 인터페이스

#### **supabase/** - DB 설정

- 마이그레이션 파일
- 초기 데이터

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

**4. 배포 환경 변수**

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
      "path": "/api/cron/fetch-blogs",
      "schedule": "0 */3 * * *"
    }
  ]
}
```

### Cron API 보안

```typescript
// app/api/cron/fetch-blogs/route.ts
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  // 블로그 수집 로직
}
```

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

### 색상 팔레트 (Tailwind)

- **라이트 모드**:
  - Background: bg-white, bg-gray-50
  - Text: text-gray-900, text-gray-600
  - Primary: #2563EB (파란색) - bg-blue-600, text-blue-600
  - Accent: #F6A54C (주황색) - bg-orange-400, text-orange-500
  - Border: border-gray-200
- **다크 모드**:
  - Background: bg-gray-950, bg-gray-900
  - Text: text-gray-100, text-gray-400
  - Primary: #3B82F6 (밝은 파란색) - bg-blue-500, text-blue-400
  - Accent: #FBBF24 (밝은 주황색) - bg-yellow-400, text-yellow-300
  - Border: border-gray-700

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

- **포스트 (Posts)**: `/` - 모든 게시글 목록
- **블로그 (Blogs)**: `/blogs` - 기업 블로그 목록
- **즐겨찾기 (Bookmarks)**: `/bookmarks` - 내 즐겨찾기

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

- [x] `vercel.json` 설정 (0 */3 * * *)
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

### Phase 6: 배포 준비 (현재 진행 중) 🔄

- [ ] **문서화**: README.md, CLAUDE.md 최신화 ✅ README.md 완료
- [ ] **SEO 설정**: robots.txt, sitemap.xml, OG 태그
- [ ] **성능 최적화**: Lighthouse 분석, 이미지 최적화
- [ ] **분석 도구**: Google Analytics, Vercel Analytics 연결
- [ ] **모니터링**: Sentry 설정
- [ ] **최종 검증**: 환경 변수, 테스트
- [ ] **배포**: Vercel에 프로덕션 배포

### Phase 7: 추가 기능 (향후)

- [ ] 게시글 상세 페이지
- [ ] 댓글 기능
- [ ] 알림 기능 (새 글 알림)
- [ ] 모바일 앱 (React Native)

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

- **Vercel Analytics**: 트래픽 분석
- **Sentry**: 에러 트래킹
- **Supabase Dashboard**: DB 모니터링
- **Console Logging**:
  - Cron Job 실행 로그
  - RSS 파싱 성공/실패
  - AI 태그 생성 결과

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

**마지막 업데이트**: 2026년 1월 14일 (Phase 6 배포 준비 진행 중)
