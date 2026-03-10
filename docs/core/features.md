# 핵심 기능

> **🎯 devBlog.kr의 주요 기능 명세**
> 이 문서는 프로젝트의 모든 기능과 구현 상세를 설명합니다.

---

## 📋 기능 목록

1. [블로그 자동 수집 스케줄러](#1-블로그-자동-수집-스케줄러)
2. [태그 자동 선택](#2-태그-자동-선택-키워드-기반)
3. [인증 및 즐겨찾기](#3-인증-및-즐겨찾기)
4. [검색 및 필터링](#4-검색-및-필터링)
5. [페이지네이션](#5-페이지네이션)
6. [공지사항 시스템](#6-공지사항-시스템)
7. [최근 본 글](#7-최근-본-글)
8. [프로필 페이지](#8-프로필-페이지)
9. [블로그 추가 요청](#9-블로그-추가-요청)
10. [Push 알림 (계획)](#10-push-알림-기능)
11. [ISR 캐시 갱신](#11-isr-incremental-static-regeneration)
12. [UI/UX](#12-uiux)

---

## 1. 블로그 자동 수집 스케줄러

### 개요

GitHub Actions를 통해 32개 기업 블로그의 RSS 피드를 자동으로 수집하여 데이터베이스에 저장합니다.

### 실행 주기

- **스케줄**: 매일 15:00, 21:00 (KST) / UTC 06:00, 12:00
- **방법**: GitHub Actions (`.github/workflows/fetch-posts.yml`)
- **Cron 표현식**: `0 6,12 * * *`

### 블로그 관리

- **데이터베이스 기반**: `companies` 테이블에서 관리
- **활성화/비활성화**: `is_active` 필드로 수집 대상 제어
- **메타데이터**: RSS URL, 블로그 URL, 로고, 설명 등

### 수집 프로세스

```
1. DB에서 활성화된 기업 블로그 목록 조회 (is_active = true)
   ↓
2. 각 기업 블로그의 RSS 피드 확인 (rss-parser 사용)
   ↓
3. 신규 게시글 감지 (URL 중복 체크)
   ↓
4. 키워드 매칭으로 적절한 태그 선택 (3-5개)
   ↓
5. Supabase에 게시글 저장 (posts 테이블)
   ↓
6. ISR 캐시 갱신 (/api/revalidate 호출)
   ↓
7. Push 알림 발송 (새 글 알림)
```

### 구현 위치

- **GitHub Actions**: `.github/workflows/fetch-posts.yml`
- **스크립트**: `scripts/fetch-posts.ts`
- **서비스**: `features/posts/services/rss-parser.ts`
- **API**: `app/api/posts/route.ts` (POST)

### 환경 변수

```bash
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
CRON_SECRET=...
REVALIDATE_SECRET=...
NEXT_PUBLIC_SITE_URL=...
```

---

## 2. 태그 자동 선택 (키워드 기반)

### 개요

게시글 제목과 내용을 분석하여 사전정의된 태그 목록에서 적합한 태그를 자동으로 선택합니다.

### 방식

- **알고리즘**: 키워드 매칭 기반 점수 계산
- **AI 사용 안 함**: OpenAI API 사용하지 않음 (비용 절감)
- **사전정의 태그**: `tags` 테이블에 미리 등록된 태그만 사용
- **출력**: 3-5개의 기술 태그

### 태그 카테고리

| 카테고리     | 태그                                                                            |
| ------------ | ------------------------------------------------------------------------------- |
| **Frontend** | React, Vue, Next.js, TypeScript, CSS, HTML, Angular                             |
| **Backend**  | Node.js, Java, Spring, Python, Django, Go, PHP, Kotlin                          |
| **Database** | PostgreSQL, MongoDB, MySQL, Redis, Elasticsearch, Firebase                      |
| **DevOps**   | Docker, Kubernetes, AWS, GCP, Azure, CI/CD, GitHub Actions                      |
| **Mobile**   | React Native, Flutter, iOS, Android, Swift                                      |
| **AI/ML**    | Machine Learning, Deep Learning, NLP, Computer Vision, LLM, PyTorch, TensorFlow |
| **기타**     | Architecture, Performance, Security, Testing, API, GraphQL                      |

### 주의사항

- ❌ 새 태그를 AI로 생성 금지
- ✅ 새 태그 추가는 관리자가 수동으로 등록
- ✅ 인기 태그는 `is_featured=true`로 표시

### 구현 위치

- **서비스**: `features/ai/services/tag-selector.ts`
- **DB 테이블**: `tags`

---

## 3. 인증 및 즐겨찾기

### 인증

#### 방식

- **Provider**: GitHub OAuth (Supabase Auth)
- **라이브러리**: `@supabase/ssr` 0.8.0
- **토큰 관리**: 쿠키 기반 (HttpOnly, Secure)

#### 흐름

```
1. 사용자가 "GitHub 로그인" 버튼 클릭
   ↓
2. Supabase Auth → GitHub OAuth 페이지
   ↓
3. 사용자 인증 후 /auth/callback으로 리다이렉트
   ↓
4. 세션 토큰을 쿠키에 저장
   ↓
5. 원래 페이지로 리다이렉트
```

#### 상태 관리

- **TanStack Query**: 서버 상태 관리 (주요)
- **Jotai**: UI 상태만 (모바일 메뉴, 토스트)

### 즐겨찾기

#### 기능

- **대상**: 로그인한 사용자만
- **저장**: `bookmarks` 테이블 (user_id + post_id)
- **캐싱**: TanStack Query로 클라이언트 캐싱
- **UI**: 날짜별 그리드뷰

#### 구현 위치

- **Hooks**: `features/bookmarks/hooks/useBookmarkToggle.ts`
- **Actions**: `features/bookmarks/actions/createBookmark.action.ts`
- **API**: `app/api/bookmarks/route.ts`
- **UI**: `features/bookmarks/ui/BookmarkContainer.tsx`

---

## 4. 검색 및 필터링

### 텍스트 검색

- **대상**: 게시글 제목
- **방식**: Full-text search (PostgreSQL)
- **실시간**: 디바운스 적용 (500ms)

### 태그 필터링

- **다중 선택**: 가능 (OR 조건)
- **UI**: 인기 태그 버튼 + 태그 필터 모달
- **인기 태그**: 8개 표시 (Frontend, Backend, Database, DevOps, AI/ML, Mobile, Architecture, Performance)

### 회사 필터링

- **다중 선택**: 가능 (OR 조건)
- **UI**: 인기 회사 로고 버튼 + 회사 필터 모달
- **인기 회사**: `is_featured=true` 기업만 표시

### 정렬 옵션

- **최신순** (기본값): `published_at DESC`
- **오래된 순**: `published_at ASC`

### URL 쿼리 파라미터

필터 상태는 URL에 저장되어 공유 가능합니다.

```
/?page=2&search=react&tags=Frontend,Backend&companies=toss,kakao&sort=oldest
```

| 파라미터    | 설명                       | 예시                  |
| ----------- | -------------------------- | --------------------- |
| `page`      | 현재 페이지 번호           | `1`, `2`, `3`         |
| `search`    | 검색 쿼리                  | `react`, `typescript` |
| `tags`      | 선택된 태그 (쉼표 구분)    | `Frontend,Backend`    |
| `companies` | 선택된 회사 ID (쉼표 구분) | `toss,kakao`          |
| `sort`      | 정렬 방식                  | `newest`, `oldest`    |

### 구현 위치

- **Container**: `features/posts/ui/PostsContainer.tsx`
- **Hooks**: `features/posts/hooks/useSearchFilters.ts`
- **API**: `app/api/posts/route.ts`

---

## 5. 페이지네이션

### 방식

- **타입**: 페이지 번호 기반 (무한 스크롤 ❌)
- **페이지당 게시글 수**: 20개
- **네비게이션**: 처음 | 이전 | [1] [2] [3] [4] [5] | 다음 | 마지막

### 동적 페이지 번호

- 현재 페이지 기준 ±2 페이지 표시
- 총 페이지 5개 표시

### 예시

```
현재 페이지 3일 때: [1] [2] [3] [4] [5]
현재 페이지 10일 때: [8] [9] [10] [11] [12]
```

### 구현 위치

- **컴포넌트**: `components/pagination/Pagination.tsx`
- **URL 연동**: `features/posts/ui/PostsContainer.tsx`

---

## 6. 공지사항 시스템

### 공지사항 타입

| 타입          | 설명          | 배지 색상 |
| ------------- | ------------- | --------- |
| `notice`      | 일반 공지     | 파란색    |
| `update`      | 업데이트 소식 | 초록색    |
| `maintenance` | 점검 안내     | 주황색    |
| `event`       | 이벤트 안내   | 보라색    |

### 기능

- 관리자가 작성/수정/삭제
- 우선순위 설정 가능
- 타입별 배지 색상 구분

### 구현 위치

- **DB 테이블**: `announcements`
- **Hooks**: `features/announcements/hooks/useAnnouncements.ts`
- **UI**: `features/announcements/ui/AnnouncementList.tsx`
- **페이지**: `app/(pages)/announcements/page.tsx`

---

## 7. 최근 본 글

### 특징

- **저장 방식**: 로컬 스토리지 (로그인 불필요)
- **저장 개수**: 최대 50개
- **디바운스**: 중복 저장 방지 (500ms)

### 데이터 구조

```typescript
interface RecentView {
  postId: string;
  title: string;
  url: string;
  blogName: string;
  blogLogo: string;
  timestamp: number;
}
```

### 기능

- 날짜별 그룹화 표시
- 개별 삭제
- 전체 삭제

### 구현 위치

- **Hooks**: `features/recent-views/hooks/useRecentViews.ts`
- **로컬 스토리지**: `utils/local-storage.ts`
- **UI**: `features/recent-views/ui/RecentViewsList.tsx`
- **페이지**: `app/(pages)/recent-views/page.tsx`

---

## 8. 프로필 페이지

### 사용자 정보

- GitHub 프로필 정보
- 가입일, 이메일

### 활동 통계

- 전체 북마크 수
- 최근 활동 날짜

### 활동 히트맵

- **스타일**: GitHub 스타일 히트맵
- **기간**: 최근 1년간
- **데이터**: 일별 북마크 수

### 계정 관리

- 로그아웃
- 계정 삭제 (확인 모달)

### 구현 위치

- **UI**: `features/profile/ui/ProfileClient.tsx`
- **히트맵**: `features/profile/components/ActivityHeatmap.tsx`
- **Actions**: `features/auth/actions/withdraw.action.ts`
- **페이지**: `app/(pages)/profile/page.tsx`

---

## 9. 블로그 추가 요청

### 요청 폼

| 필드        | 필수 여부 | 설명             |
| ----------- | --------- | ---------------- |
| 블로그 이름 | 필수      | 기업/블로그 이름 |
| 블로그 URL  | 필수      | 메인 블로그 URL  |
| RSS URL     | 필수      | RSS 피드 URL     |
| 설명        | 선택      | 블로그 소개      |

### 검증

- URL 형식 검증
- 중복 체크

### 처리

- 관리자 검토 후 승인
- 승인 시 자동으로 수집 시작

### 구현 위치

- **Hooks**: `features/request/hooks/useSubmitRequest.ts`
- **Actions**: `features/request/actions/requestSubmit.action.ts`
- **UI**: `features/request/ui/RequestForm.tsx`
- **페이지**: `app/(pages)/request/page.tsx`

---

## 10. Push 알림 기능

> **⚠️ 현재 상태**: 기획 완료, 구현 대기 중

### 개요

- **대상**: 로그인 회원만
- **트리거**: GitHub Actions가 새 글을 저장한 후 `/api/notifications/send` 호출
- **알림 내용**: "오늘 N개의 새 글이 등록되었습니다" (요약형)
- **기술**: Web Push API + `web-push` 패키지

### 알림 설정 구조

```
전체 알림 on/off (유저 단위) → notification_preferences.new_post_enabled
  ↓ ON일 때만
기기별 알림 on/off (OS 단위 그룹화) → push_subscriptions.enabled
```

### 기기 OS 분류

| device_os | 표시명  | 아이콘 |
| --------- | ------- | ------ |
| `windows` | Windows | 🖥️     |
| `mac`     | Mac     | 🍎     |
| `linux`   | Linux   | 🖥️     |
| `android` | Android | 📱     |
| `ios`     | iPhone  | 🍎     |

### DB 테이블

- `push_subscriptions`: 장치별 구독 정보
- `notification_preferences`: 유저별 전체 알림 설정

### API 엔드포인트

| 메서드 | 경로                             | 역할                  |
| ------ | -------------------------------- | --------------------- |
| POST   | `/api/notifications/subscribe`   | 구독 저장             |
| DELETE | `/api/notifications/subscribe`   | 구독 해제             |
| GET    | `/api/notifications/preferences` | 알림 설정 조회        |
| PUT    | `/api/notifications/preferences` | 전체 알림 on/off 변경 |
| PUT    | `/api/notifications/subscribe`   | 기기별 enabled 변경   |
| POST   | `/api/notifications/send`        | Push 발송 (내부용)    |

### 발송 흐름

```
GitHub Actions (fetch-posts.ts)
  → 새 글 N개 저장 완료
  → POST /api/notifications/send { postsCreated: N }
  → notification_preferences에서 new_post_enabled = true인 유저 조회
  → 해당 유저의 push_subscriptions에서 enabled = true인 기기 조회
  → web-push로 각 기기에 알림 발송
  → 실패한 endpoint는 자동 삭제
```

### 구현 위치

- **Hooks**: `features/notifications/hooks/`
- **Services**: `features/notifications/services/`
- **UI**: `features/notifications/ui/NotificationSettings.tsx`
- **Service Worker**: `public/sw.js`

---

## 11. ISR (Incremental Static Regeneration)

### 개요

Next.js의 ISR을 활용하여 성능과 최신성을 모두 확보합니다.

### 작동 방식

```
사용자 요청 → 정적 페이지 제공 (빠름)
     ↓
30분 경과 or GitHub Actions 트리거
     ↓
백그라운드 재생성
     ↓
다음 요청부터 새 페이지 제공
```

### 설정

**1. 페이지 레벨 ISR**

```typescript
// app/(pages)/posts/page.tsx
export const revalidate = 1800; // 30분 = 1800초
```

**2. On-Demand Revalidation**

```typescript
// GitHub Actions에서 호출
POST /api/revalidate?secret=xxx&path=/posts
```

### 장점

- ✅ 정적 페이지 수준의 성능
- ✅ 30분마다 자동 갱신
- ✅ 새 글 수집 시 즉시 반영
- ✅ 서버 부하 감소
- ✅ SEO 최적화

### 구현 위치

- **API**: `app/api/revalidate/route.ts`
- **페이지 설정**: `app/(pages)/posts/page.tsx`
- **트리거**: `scripts/fetch-posts.ts`

자세한 내용: [ISR 설정 가이드](./isr-setup-guide.md)

---

## 12. UI/UX

### 테마

- **라이트 모드** / **다크 모드**
- 사용자 선택 + 시스템 설정 감지

### 반응형 브레이크포인트

- **모바일**: < 768px (md 미만)
- **데스크탑**: ≥ 768px (md 이상)

### 로딩 상태

- 스켈레톤 UI (북마크, 카드, 그리드)
- 페이지 로딩 스피너

### 토스트 알림

- 성공/에러/정보/경고 메시지
- 자동 닫힘 (5초)

### 빈 상태 UI

- 검색 결과 없음
- 북마크 없음
- 최근 본 글 없음

### 레이아웃

#### 모바일 (< 768px)

- **헤더**: 로고 + 햄버거 메뉴
- **메뉴**: 왼쪽에서 슬라이드
- **카드**: 1열 그리드

#### 데스크탑 (≥ 768px)

- **사이드바**: 고정 사이드바 (GSAP hover expand)
- **카드**: 3열 그리드
- **필터**: 인라인 표시

### 애니메이션

- **GSAP**: 사이드바 hover expand/collapse
- **Tailwind**: hover, focus, transition

### 구현 위치

- **레이아웃**: `components/layout/`
- **스켈레톤**: `components/skeleton/`
- **토스트**: `components/toast/ToastContainer.tsx`
- **테마**: `components/theme/ThemeToggle.tsx`

---

## 📚 관련 문서

- [데이터베이스 스키마](./database-schema.md) - 테이블 구조 및 RLS 정책
- [API 명세](./api-specification.md) - REST API 엔드포인트
- [코딩 컨벤션](./coding-conventions.md) - 코드 작성 규칙
- [폴더 구조](./folder-structure.md) - FSD 패턴 및 디렉토리
- [Push 알림 가이드](./push-notifications.md) - Push 알림 상세 구현

---

**마지막 업데이트**: 2026년 3월 10일
