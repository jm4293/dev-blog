# API 명세

> **📡 devBlog.kr REST API 엔드포인트**
> 이 문서는 모든 API 엔드포인트의 요청/응답 명세를 설명합니다.

---

## 📋 목차

1. [인증](#인증)
2. [Rate Limiting](#rate-limiting)
3. [게시글 API](#게시글-api)
4. [북마크 API](#북마크-api)
5. [기업/블로그 API](#기업블로그-api)
6. [태그 API](#태그-api)
7. [최근 본 글 API](#최근-본-글-api)
8. [알림 API](#알림-api)
9. [ISR 캐시 갱신 API](#isr-캐시-갱신-api)
10. [에러 응답](#에러-응답)

---

## 인증

### 방식

- **Provider**: Supabase Auth (GitHub OAuth)
- **토큰**: 쿠키 기반 (HttpOnly, Secure)
- **헤더**: 자동으로 쿠키에서 읽음

### 인증 필요 여부

| 엔드포인트             | 인증 필요        |
| ---------------------- | ---------------- |
| `/api/posts`           | ❌               |
| `/api/companies`       | ❌               |
| `/api/tags`            | ❌               |
| `/api/bookmarks`       | ✅               |
| `/api/recent-views`    | ✅               |
| `/api/notifications/*` | ✅               |
| `/api/revalidate`      | ✅ (Secret 인증) |

---

## Rate Limiting

### 제한 정책

| API 타입     | 제한       | 기간  |
| ------------ | ---------- | ----- |
| **공개 API** | 100 요청   | 1시간 |
| **인증 API** | 1,000 요청 | 1시간 |

### Rate Limit 헤더

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1678886400
```

### 초과 시 응답

```json
{
  "error": "Too many requests",
  "details": "Rate limit: 100 requests per hour"
}
```

---

## 게시글 API

### GET `/api/posts`

게시글 목록 조회 (페이지네이션, 검색, 필터링)

#### 쿼리 파라미터

| 파라미터    | 타입   | 필수 | 설명                           | 기본값   |
| ----------- | ------ | ---- | ------------------------------ | -------- |
| `page`      | number | ❌   | 페이지 번호 (1부터 시작)       | `1`      |
| `search`    | string | ❌   | 검색어 (제목 검색)             | -        |
| `tags`      | string | ❌   | 태그 필터 (쉼표 구분)          | -        |
| `companies` | string | ❌   | 회사 필터 (쉼표 구분)          | -        |
| `sort`      | string | ❌   | 정렬 방식 (`newest`, `oldest`) | `newest` |

#### 요청 예시

```http
GET /api/posts?page=2&search=react&tags=Frontend,Backend&companies=toss,kakao&sort=newest
```

#### 응답 (200 OK)

```json
{
  "posts": [
    {
      "id": "uuid",
      "title": "게시글 제목",
      "url": "https://example.com/post",
      "summary": "게시글 요약...",
      "author": "작성자",
      "tags": ["Frontend", "React"],
      "published_at": "2024-01-01T00:00:00Z",
      "scraped_at": "2024-01-01T00:00:00Z",
      "company": {
        "id": "uuid",
        "name": "토스",
        "name_en": "Toss",
        "logo_url": "/company_logos/toss.webp",
        "blog_url": "https://toss.tech"
      }
    }
  ],
  "totalCount": 150,
  "totalPages": 8
}
```

#### 에러 응답

```json
{
  "error": "Invalid page number",
  "details": "Page must be greater than 0"
}
```

---

## 북마크 API

### GET `/api/bookmarks`

현재 사용자의 북마크 목록 조회

#### 인증

✅ 필수

#### 응답 (200 OK)

```json
{
  "bookmarks": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "post_id": "uuid",
      "created_at": "2024-01-01T00:00:00Z",
      "post": {
        "id": "uuid",
        "title": "게시글 제목",
        "url": "https://example.com/post",
        "summary": "게시글 요약...",
        "tags": ["Frontend"],
        "published_at": "2024-01-01T00:00:00Z",
        "company": {
          "name": "토스",
          "logo_url": "/company_logos/toss.webp"
        }
      }
    }
  ]
}
```

#### 에러 응답

```json
{
  "error": "Unauthorized",
  "details": "Please login to view bookmarks"
}
```

---

### POST `/api/bookmarks`

북마크 추가

#### 인증

✅ 필수

#### 요청 바디

```json
{
  "postId": "uuid"
}
```

#### 응답 (201 Created)

```json
{
  "bookmark": {
    "id": "uuid",
    "user_id": "uuid",
    "post_id": "uuid",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### 에러 응답

```json
{
  "error": "Already bookmarked",
  "details": "This post is already in your bookmarks"
}
```

---

### DELETE `/api/bookmarks`

북마크 삭제

#### 인증

✅ 필수

#### 쿼리 파라미터

| 파라미터 | 타입   | 필수 | 설명             |
| -------- | ------ | ---- | ---------------- |
| `postId` | string | ✅   | 삭제할 게시글 ID |

#### 요청 예시

```http
DELETE /api/bookmarks?postId=uuid
```

#### 응답 (200 OK)

```json
{
  "message": "Bookmark deleted successfully"
}
```

---

### GET `/api/bookmarks/stats`

북마크 통계 (활동 히트맵용)

#### 인증

✅ 필수

#### 쿼리 파라미터

| 파라미터 | 타입   | 필수 | 설명                            |
| -------- | ------ | ---- | ------------------------------- |
| `year`   | number | ❌   | 조회할 연도 (기본값: 현재 연도) |

#### 요청 예시

```http
GET /api/bookmarks/stats?year=2024
```

#### 응답 (200 OK)

```json
{
  "stats": {
    "2024-01-01": 3,
    "2024-01-02": 5,
    "2024-01-03": 2
  },
  "total": 120
}
```

---

## 기업/블로그 API

### GET `/api/companies`

기업 블로그 목록 조회

#### 쿼리 파라미터

| 파라미터   | 타입    | 필수 | 설명                             |
| ---------- | ------- | ---- | -------------------------------- |
| `featured` | boolean | ❌   | 인기 블로그만 조회 (`true`)      |
| `all`      | boolean | ❌   | 모든 블로그 조회 (비활성화 포함) |

#### 요청 예시

```http
GET /api/companies?featured=true
```

#### 응답 (200 OK)

```json
{
  "companies": [
    {
      "id": "uuid",
      "name": "토스",
      "name_en": "Toss",
      "logo_url": "/company_logos/toss.webp",
      "blog_url": "https://toss.tech",
      "rss_url": "https://toss.tech/rss.xml",
      "description": "토스 기술 블로그",
      "is_active": true,
      "is_featured": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 32
}
```

---

## 태그 API

### GET `/api/tags`

태그 목록 조회

#### 쿼리 파라미터

| 파라미터   | 타입    | 필수 | 설명                                    |
| ---------- | ------- | ---- | --------------------------------------- |
| `featured` | boolean | ❌   | 인기 태그만 조회 (`true`)               |
| `category` | string  | ❌   | 특정 카테고리의 태그만 조회             |
| `sort`     | string  | ❌   | 정렬 방식 (`name`, `usage`, `featured`) |

#### 요청 예시

```http
GET /api/tags?featured=true&sort=usage
```

#### 응답 (200 OK)

```json
{
  "tags": [
    {
      "id": "uuid",
      "name": "Frontend",
      "category": "frontend",
      "usage_count": 250,
      "is_featured": true,
      "created_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": "uuid",
      "name": "React",
      "category": "frontend",
      "usage_count": 180,
      "is_featured": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 20
}
```

---

## 최근 본 글 API

### GET `/api/recent-views`

현재 사용자의 최근 본 글 목록 조회

#### 인증

✅ 필수

#### 응답 (200 OK)

```json
{
  "recentViews": [
    {
      "post_id": "uuid",
      "title": "게시글 제목",
      "url": "https://example.com/post",
      "blog_name": "토스",
      "blog_logo": "/company_logos/toss.webp",
      "timestamp": 1678886400000
    }
  ]
}
```

**참고**: 실제로는 로컬 스토리지 기반이므로 이 API는 사용되지 않습니다.

---

## 알림 API

### GET `/api/notifications/preferences`

알림 설정 및 등록된 기기 목록 조회

#### 인증

✅ 필수

#### 응답 (200 OK)

```json
{
  "preferences": {
    "new_post_enabled": true
  },
  "devices": [
    {
      "id": "uuid",
      "device_os": "windows",
      "browser": "chrome",
      "enabled": true,
      "created_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": "uuid",
      "device_os": "android",
      "browser": "chrome",
      "enabled": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### POST `/api/notifications/subscribe`

Push 알림 구독 저장

#### 인증

✅ 필수

#### 요청 바디

```json
{
  "endpoint": "https://fcm.googleapis.com/fcm/send/...",
  "keys": {
    "p256dh": "...",
    "auth": "..."
  },
  "device_os": "windows",
  "browser": "chrome"
}
```

#### 응답 (201 Created)

```json
{
  "message": "Subscription created successfully",
  "subscription": {
    "id": "uuid",
    "user_id": "uuid",
    "endpoint": "...",
    "device_os": "windows",
    "browser": "chrome",
    "enabled": true
  }
}
```

---

### DELETE `/api/notifications/subscribe`

Push 알림 구독 해제

#### 인증

✅ 필수

#### 쿼리 파라미터

| 파라미터   | 타입   | 필수 | 설명                |
| ---------- | ------ | ---- | ------------------- |
| `endpoint` | string | ✅   | 해제할 endpoint URL |

#### 요청 예시

```http
DELETE /api/notifications/subscribe?endpoint=https://fcm.googleapis.com/...
```

#### 응답 (200 OK)

```json
{
  "message": "Subscription deleted successfully"
}
```

---

### PUT `/api/notifications/subscribe`

기기별 알림 설정 변경 (OS 단위 bulk update)

#### 인증

✅ 필수

#### 요청 바디

```json
{
  "device_os": "windows",
  "enabled": false
}
```

#### 응답 (200 OK)

```json
{
  "message": "2 subscriptions updated successfully"
}
```

---

### POST `/api/notifications/send`

Push 알림 발송 (내부용, GitHub Actions 전용)

#### 인증

✅ Bearer 토큰 (CRON_SECRET)

#### 요청 헤더

```
Authorization: Bearer {CRON_SECRET}
```

#### 요청 바디

```json
{
  "postsCreated": 15
}
```

#### 응답 (200 OK)

```json
{
  "message": "Notifications sent successfully",
  "sent": 45,
  "failed": 2,
  "removed": 2
}
```

#### 에러 응답

```json
{
  "error": "Unauthorized",
  "details": "Invalid CRON_SECRET"
}
```

---

## ISR 캐시 갱신 API

### POST `/api/revalidate`

ISR 캐시 즉시 갱신 (내부용)

#### 인증

✅ Secret 인증

#### 쿼리 파라미터

| 파라미터 | 타입   | 필수 | 설명                       |
| -------- | ------ | ---- | -------------------------- |
| `secret` | string | ✅   | REVALIDATE_SECRET          |
| `path`   | string | ✅   | 갱신할 경로 (예: `/posts`) |

#### 요청 예시

```http
POST /api/revalidate?secret=xxx&path=/posts
```

#### 응답 (200 OK)

```json
{
  "revalidated": true,
  "path": "/posts",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

#### 에러 응답

```json
{
  "message": "Invalid secret"
}
```

---

## 에러 응답

### 공통 에러 형식

```json
{
  "error": "Error type",
  "details": "Detailed error message"
}
```

### HTTP 상태 코드

| 코드    | 의미            | 예시                      |
| ------- | --------------- | ------------------------- |
| **200** | 성공            | GET 요청 성공             |
| **201** | 생성 성공       | POST 요청 성공            |
| **400** | 잘못된 요청     | 필수 파라미터 누락        |
| **401** | 인증 실패       | 로그인 필요               |
| **403** | 권한 없음       | 다른 사용자의 데이터 접근 |
| **404** | 리소스 없음     | 존재하지 않는 ID          |
| **429** | Rate Limit 초과 | 요청 횟수 초과            |
| **500** | 서버 오류       | 내부 서버 오류            |

### 에러 예시

#### 400 Bad Request

```json
{
  "error": "Invalid parameter",
  "details": "Page must be a positive number"
}
```

#### 401 Unauthorized

```json
{
  "error": "Unauthorized",
  "details": "Please login to access this resource"
}
```

#### 404 Not Found

```json
{
  "error": "Not found",
  "details": "Post with id 'xxx' not found"
}
```

#### 429 Too Many Requests

```json
{
  "error": "Too many requests",
  "details": "Rate limit: 100 requests per hour"
}
```

#### 500 Internal Server Error

```json
{
  "error": "Internal server error",
  "details": "Database connection failed"
}
```

---

## 📚 관련 문서

- [데이터베이스 스키마](./database-schema.md) - 테이블 구조 및 RLS 정책
- [핵심 기능](./features.md) - 각 API를 사용하는 기능 설명
- [환경 변수 가이드](./environment-setup.md) - API 키 및 설정
- [ISR 설정 가이드](./isr-setup-guide.md) - ISR 캐시 갱신 상세

---

**마지막 업데이트**: 2026년 3월 10일
