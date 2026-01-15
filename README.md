# devBlog.kr

> 한국 IT 기업들의 기술 블로그를 한 곳에서 모아볼 수 있는 플랫폼

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018.0.0-brightgreen.svg)]()
[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0+-38B2AC.svg)](https://tailwindcss.com/)
![Status](https://img.shields.io/badge/status-active%20development-yellow.svg)

---

## 📋 목차

- [개요](#개요)
- [주요 기능](#주요-기능)
- [빠른 시작](#빠른-시작)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [개발 가이드](#개발-가이드)
- [배포](#배포)
- [기여하기](#기여하기)
- [라이선스](#라이선스)

---

## 개요

**devBlog.kr**은 한국 IT 기업들의 기술 블로그를 자동으로 수집하고, 태그 기반 분류를 통해 개발자들이 원하는 정보를 쉽게 찾을 수 있는 플랫폼입니다.

### ✨ 핵심 기능

- 🤖 **자동 수집**: Cron Job으로 3시간마다 블로그 게시글 자동 수집
- 🏷️ **스마트 분류**: 키워드 기반 자동 태그 선택 (Frontend, Backend, DevOps 등)
- 🔍 **강력한 검색**: 텍스트 검색 + 다중 태그/회사 필터
- ❤️ **즐겨찾기**: GitHub 로그인 후 관심 게시글 저장
- 📱 **반응형 디자인**: 모바일/데스크탑 완벽 최적화
- 🌙 **라이트/다크 모드**: 사용자 선호도 자동 감지

---

## 빠른 시작

### 필수 환경

- Node.js 18+
- npm 또는 yarn
- Supabase 계정
- GitHub OAuth 애플리케이션

### 설치

```bash
# 저장소 클론
git clone https://github.com/jm4293/dev-blog.git
cd dev-blog

# 의존성 설치
npm install

# 환경 변수 설정 (.env.local)
cp .env.example .env.local
# .env.local 파일 수정

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

### 빌드 & 배포

```bash
# 빌드
npm run build

# 프로덕션 실행
npm start

# Vercel 배포
vercel deploy
```

---

## 기술 스택

### Frontend

| 항목                | 설명                                      |
| ------------------- | ----------------------------------------- |
| **Next.js 14**      | React 기반 풀스택 프레임워크 (App Router) |
| **TypeScript**      | 타입 안정성                               |
| **Tailwind CSS**    | 유틸리티 CSS 프레임워크                   |
| **shadcn/ui**       | 고급 UI 컴포넌트                          |
| **Jotai**           | 가벼운 전역 상태 관리                     |
| **TanStack Query**  | 서버 상태 관리                            |
| **React Hook Form** | 폼 상태 관리                              |

### Backend & Infrastructure

| 항목           | 설명                                   |
| -------------- | -------------------------------------- |
| **Supabase**   | PostgreSQL 데이터베이스 & GitHub OAuth |
| **Vercel**     | 배포 및 Cron Jobs                      |
| **rss-parser** | RSS 피드 파싱                          |

### Development Tools

| 항목           | 설명        |
| -------------- | ----------- |
| **TypeScript** | 타입 체킹   |
| **ESLint**     | 코드 품질   |
| **Prettier**   | 코드 포맷팅 |

---

## 프로젝트 구조

```
dev-blog/
├── app/                    # Next.js App Router
│   ├── (pages)/           # 페이지 그룹
│   │   ├── admin/         # 관리자 페이지
│   │   ├── blogs/         # 블로그 목록
│   │   └── bookmarks/     # 즐겨찾기
│   ├── api/               # API 라우트
│   ├── layout.tsx         # Root 레이아웃
│   └── page.tsx           # 메인 페이지
│
├── components/            # React 컴포넌트
│   ├── layout/           # 헤더, 푸터, 네비게이션
│   ├── posts/            # 게시글 관련 컴포넌트
│   ├── search/           # 검색/필터 컴포넌트
│   └── ui/               # shadcn/ui 컴포넌트
│
├── features/             # 기능별 로직 (중요!)
│   ├── posts/           # 게시글 기능
│   ├── blogs/           # 블로그/회사 기능
│   ├── auth/            # 인증
│   └── bookmarks/       # 즐겨찾기
│
├── atoms/               # Jotai 전역 상태
├── supabase/            # Supabase 클라이언트 & 타입
├── utils/               # 공유 유틸리티
├── types/               # 전역 타입 정의
└── hooks/               # 공유 훅
```

자세한 구조는 [CLAUDE.md](./CLAUDE.md#-프로젝트-구조)를 참고하세요.

---

## 개발 가이드

### 코딩 규칙

- TypeScript Strict Mode 활성화
- 함수형 컴포넌트만 사용
- 컴포넌트는 UI 렌더링만 담당
- 비즈니스 로직은 `features/` 폴더에 분리

### 파일 구조 및 Export 방식

**app/ 경로 (페이지, 레이아웃, API):**

```typescript
export default function Home() {
  // ...
}

export async function GET(request: Request) {
  // ...
}
```

**components/, features/ (공유 코드):**

```typescript
export function PostCard({ post }: PostCardProps) {
  // ...
}

export async function fetchPosts(page: number) {
  // ...
}
```

### 코드 품질 관리 (Husky)

커밋 및 푸시 시 자동으로 코드 품질을 검사합니다.

**Pre-commit 검사 (커밋 전):**

- 🔍 **Console 문장 검사**: `console.log()`, `console.error()` 등이 있으면 커밋 차단
- 🎨 **ESLint + Prettier**: 코드 스타일 자동 수정
- ✅ **TypeScript**: 타입 검사

**Pre-push 검사 (푸시 전):**

- 🔍 **전체 ESLint 검사**: 모든 파일의 코드 품질 검증
- ✅ **TypeScript**: 전체 타입 검사
- 🔨 **빌드 검증**: 빌드 성공 여부 확인

**Husky 설정 완료 후:**

```bash
# 의존성 설치 시 자동으로 husky 설정됨
npm install

# 수동으로 설정하고 싶으면
npm run prepare
```

**검사 우회 (권장하지 않음):**

```bash
# Pre-commit 검사 스킵
git commit --no-verify

# Pre-push 검사 스킵
git push --no-verify
```

### 커밋 메시지 규칙

```
feat: 새 기능
fix: 버그 수정
refactor: 코드 리팩토링
style: 스타일 변경
docs: 문서 수정
test: 테스트 추가
chore: 기타 변경
```

자세한 개발 가이드는 [CLAUDE.md](./CLAUDE.md)를 참고하세요.

---

## 배포

### 환경 변수 설정

```bash
# .env.local 또는 Vercel 환경 변수

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# GitHub OAuth
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id

# Cron Job 보안
CRON_SECRET=your_random_secret_32chars

# 사이트 URL
NEXT_PUBLIC_SITE_URL=https://devblog.kr
```

### Supabase 설정

1. [Supabase](https://supabase.com)에서 프로젝트 생성
2. 마이그레이션 실행 (`supabase/migrations/`)
3. RLS 정책 활성화
4. API 키 복사

### Vercel 배포

1. [Vercel](https://vercel.com)에서 프로젝트 연결
2. 환경 변수 추가
3. 자동 배포 활성화
4. 도메인 설정

### SEO 최적화

- `robots.txt` - 검색 엔진 크롤러 지시
- `sitemap.xml` - 사이트 구조 표시
- OG 메타 태그 - 소셜 미디어 공유 최적화
- 구조화된 데이터 - Schema.org 지원

### 배포 체크리스트

- [ ] 환경 변수 설정 (프로덕션)
- [ ] Supabase 마이그레이션 완료
- [ ] GitHub OAuth 설정 완료
- [ ] SEO 설정 완료
- [ ] Lighthouse 점수 80점 이상
- [ ] Analytics 설정 완료

---

## 기여하기

이 프로젝트는 한국 개발자 커뮤니티를 위해 개발되고 있습니다.

### 새 기업 블로그 추가

1. Supabase에 기업 정보 추가
2. RSS URL 검증
3. Pull Request 생성

### 버그 리포트

GitHub Issues에서 다음 정보를 포함해 리포트해주세요:

- 재현 단계
- 예상 결과
- 실제 결과
- 환경 정보 (브라우저, OS 등)

---

## 참고 자료

- [CLAUDE.md](./CLAUDE.md) - 상세 기술 문서
- [Next.js 문서](https://nextjs.org/docs)
- [Supabase 문서](https://supabase.com/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [shadcn/ui 문서](https://ui.shadcn.com/)

---

## 라이선스

이 프로젝트는 [MIT License](LICENSE)로 공개됩니다.

---

<div align="center">

**[⬆ 목차로 가기](#-목차)**

Made with ❤️ by [jm4293](https://github.com/jm4293)

최종 업데이트: 2026년 1월 14일

</div>
