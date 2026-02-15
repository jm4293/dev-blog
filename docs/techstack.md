# 기술 스택 (Tech Stack)

devBlog.kr 프로젝트에서 사용된 기술 스택을 상세히 설명합니다.

---

## 🎨 Frontend

### Core Framework

- **Next.js 14.2.0** (App Router)
  - 서버 컴포넌트 기반 렌더링
  - 파일 기반 라우팅 (`app/` 디렉토리)
  - API Routes (`app/api/`)
  - Middleware 지원 (`middleware.ts`)

### 언어

- **TypeScript 5**
  - Strict Mode 활성화
  - 완전한 타입 안전성
  - Supabase 타입 자동 생성

### 스타일링

- **Tailwind CSS 3.4.0**
  - 유틸리티 우선 CSS 프레임워크
  - 다크 모드 지원 (시스템 감지 + 사용자 선택)
  - 반응형 디자인 (모바일: <768px, 데스크탑: ≥768px)

### 상태 관리

- **TanStack Query 5.90.16 (React Query)** - 주요 상태 관리
  - 서버 상태 관리 (게시글, 북마크, 사용자 정보)
  - 자동 캐싱, 리페칭, 낙관적 업데이트
  - Query Key 중앙 관리 (`lib/query-keys.ts`)
- **Jotai 2.16.1** - 최소 사용
  - UI 상태만 (모바일 메뉴, 토스트 알림)
  - 가벼운 Atom 기반 상태 관리

---

## 🖥️ Backend & Infrastructure

### 데이터베이스

- **Supabase (PostgreSQL)**
  - 관계형 데이터베이스
  - Row Level Security (RLS)
  - 실시간 구독 (Real-time)
  - 자동 백업

### 인증

- **Supabase Auth** (GitHub OAuth)
  - `@supabase/ssr 0.8.0` 패키지 사용
  - 쿠키 기반 인증
  - 서버/클라이언트 분리 클라이언트

### 자동화

- **Vercel Cron Jobs**
  - 매일 00:00 KST 실행
  - 새 블로그 게시글 자동 수집
  - `CRON_SECRET` 인증

### AI/ML (선택적 사용)

- **OpenAI 6.15.0**
  - 모델: `gpt-4o-mini`
  - 용도: 키워드 기반 태그 선택 (현재 비활성화)
  - 비용 절감을 위해 태그 테이블 직접 매칭 방식 사용

### 호스팅

- **Vercel**
  - Edge Network
  - 자동 HTTPS
  - GitHub 연동 CI/CD
  - 환경 변수 관리

### 모니터링

- **Sentry 10.35.0**
  - 에러 트래킹
  - 성능 모니터링
  - 배포별 에러 추적

---

## 📦 주요 라이브러리

### 데이터 처리

- **rss-parser 3.13.0**: RSS 피드 파싱
- **date-fns**: 날짜 처리 및 포맷팅

### UI 컴포넌트

- **lucide-react**: 아이콘
- **react-hook-form**: 폼 유효성 검사

### 네트워크

- **fetch (native)**: HTTP 요청 (Axios 대신)

### Push 알림

- **web-push**: 서버에서 Push 알림 발송 (백엔드)
- **Web Push API**: 브라우저 Push 알림 수신 (프론트엔드)

### 분석

- **Google Analytics (GA4)**: 페이지 뷰, 이벤트 추적
- **Vercel Analytics**: 트래픽 분석, Core Web Vitals

---

## 🗂️ 데이터베이스 기술

### Supabase 특징

- **PostgreSQL 15**: 강력한 관계형 DB
- **Row Level Security (RLS)**: 사용자별 권한 관리
- **Realtime Subscriptions**: 실시간 변경 감지
- **Storage**: 로고 이미지 저장 (WebP 포맷)
- **Edge Functions**: Serverless 함수 (미사용)

### 인덱싱 전략

- `companies`: `is_active`, `is_featured` 인덱스
- `posts`: `company_id`, `published_at` (내림차순), `tags` (GIN), `title` (Full-text)
- `bookmarks`: `user_id`, `post_id` 복합 인덱스

---

## 🛠️ 개발 도구

### 린팅 & 포맷팅

- **Prettier**: 코드 포맷팅 (`.prettierrc`)
  - `singleQuote: true`
  - `tabWidth: 2`
  - `printWidth: 120`
- **ESLint**: Next.js 기본 설정

### 테스트 (계획)

- **Vitest**: 단위 테스트
- **Playwright**: E2E 테스트

### 타입 생성

- **Supabase CLI**: 자동 타입 생성 (`supabase/types.supabase.ts`)

---

## 🌐 배포 환경

### Production

- **Domain**: https://devblog.kr
- **Hosting**: Vercel
- **Environment**: Production
- **Branch**: `main`

### Development

- **Local**: `http://localhost:3000`
- **Branch**: `refactor/fsd-structure`

---

## 📊 의존성 버전 관리

### 주요 패키지 고정

```json
{
  "next": "14.2.0",
  "react": "^18",
  "@tanstack/react-query": "5.90.16",
  "jotai": "2.16.1",
  "@supabase/ssr": "0.8.0",
  "tailwindcss": "3.4.0"
}
```

### 업데이트 정책

- **Major 버전**: 신중하게 검토 후 업데이트
- **Minor/Patch**: 정기적으로 업데이트 (보안 패치 포함)
- **의존성 충돌**: `package-lock.json` 사용

---

## 🔐 보안 기술

### 인증

- **OAuth 2.0**: GitHub 로그인
- **JWT**: Supabase 세션 토큰
- **Cookie**: HTTP-only 쿠키 (XSS 방지)

### 데이터 보호

- **RLS**: 사용자별 데이터 격리
- **HTTPS**: 모든 통신 암호화
- **CRON_SECRET**: Cron Job 인증

### 환경 변수

- **`.env.local`**: 개발 환경 (Git 제외)
- **Vercel Secrets**: 프로덕션 환경 변수

---

## 🚀 성능 최적화

### 이미지 최적화

- **WebP 포맷**: 모든 로고 이미지 (32개)
- **Next.js Image**: 자동 최적화

### 코드 분할

- **Dynamic Import**: 필요시 로드
- **React.lazy**: 컴포넌트 lazy loading

### 캐싱 전략

- **TanStack Query**: 서버 상태 캐싱
- **Vercel Edge Cache**: CDN 캐싱

---

## 📖 관련 문서

- [프로젝트 개요](./project-overview.md)
- [환경 변수 가이드](./environment-setup.md)
- [폴더 구조](./folder-structure.md)
