# 데이터베이스 스키마

devBlog.kr의 Supabase PostgreSQL 데이터베이스 구조를 상세히 설명합니다.

---

## 📊 테이블 구조

### 1. `companies` (기업 정보)

기업 블로그 메타데이터를 저장합니다.

```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,              -- 기업명 (한글)
  name_en VARCHAR(255),                    -- 기업명 (영문)
  logo_url TEXT,                           -- 로고 이미지 URL (WebP)
  blog_url TEXT NOT NULL,                  -- 블로그 메인 URL
  rss_url TEXT NOT NULL,                   -- RSS 피드 URL
  description TEXT,                        -- 기업 설명
  is_active BOOLEAN DEFAULT true,          -- 활성화 여부 (수집 대상)
  is_featured BOOLEAN DEFAULT false,       -- 인기 블로그 여부
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_companies_is_active ON companies(is_active);
CREATE INDEX idx_companies_is_featured ON companies(is_featured);
```

**컬럼 설명:**

- `is_active`: false면 Cron Job에서 수집 제외
- `is_featured`: true면 메인 페이지 "인기 블로그"에 표시
- `logo_url`: `/company_logos/{company_name}.webp` 형식

**예시 데이터:**

```sql
INSERT INTO companies (name, name_en, blog_url, rss_url, is_featured) VALUES
('토스', 'Toss', 'https://toss.tech/', 'https://toss.tech/rss.xml', true),
('카카오', 'Kakao', 'https://tech.kakao.com/', 'https://tech.kakao.com/feed/', true);
```

---

### 2. `posts` (게시글)

수집된 블로그 게시글을 저장합니다.

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,                     -- 게시글 제목
  url TEXT NOT NULL UNIQUE,                -- 게시글 원본 URL (중복 방지)
  content TEXT,                            -- 게시글 본문 (현재 미사용)
  summary TEXT,                            -- 게시글 요약 (RSS description)
  author VARCHAR(255),                     -- 작성자
  tags TEXT[] DEFAULT '{}',                -- 태그 배열 (예: ["React", "Backend"])
  published_at TIMESTAMPTZ NOT NULL,       -- 게시글 작성일
  scraped_at TIMESTAMPTZ DEFAULT NOW(),    -- 수집일
  view_count INT NOT NULL DEFAULT 0,       -- 전체 읽기 클릭 수 (increment_post_view RPC)
  bookmark_count INT NOT NULL DEFAULT 0,   -- 북마크 수 (bookmarks 트리거로 동기화)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_posts_company_id ON posts(company_id);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);
CREATE INDEX idx_posts_title_search ON posts USING GIN(to_tsvector('korean', title));
```

**컬럼 설명:**

- `url`: UNIQUE 제약으로 중복 수집 방지
- `tags`: PostgreSQL 배열 타입, GIN 인덱스로 빠른 검색
- `content`: 저작권 이슈로 현재 저장 안 함 (NULL)
- `summary`: RSS description 필드에서 가져옴 (2-3줄)

**중요:**

- ❌ **본문(content) 저장 안 함**: 저작권 + 용량 이슈
- ✅ **저장하는 것**: 제목, URL, 요약, 태그

**인덱스 전략:**

- `published_at DESC`: 최신순 정렬 최적화
- `GIN(tags)`: 배열 검색 최적화 (WHERE tags @> ARRAY['React'])
- `GIN(to_tsvector('korean', title))`: 전문 검색 (Full-text)

---

### 3. `bookmarks` (즐겨찾기)

사용자별 게시글 즐겨찾기를 저장합니다.

```sql
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id)                 -- 중복 북마크 방지
);

-- 인덱스
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_post_id ON bookmarks(post_id);
```

**컬럼 설명:**

- `user_id`: Supabase Auth 사용자 ID
- `post_id`: 게시글 ID
- `UNIQUE(user_id, post_id)`: 동일 게시글 중복 북마크 방지

**RLS 정책:**

```sql
-- 사용자는 자신의 북마크만 CRUD 가능
CREATE POLICY "Users can view own bookmarks" ON bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookmarks" ON bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks" ON bookmarks
  FOR DELETE USING (auth.uid() = user_id);
```

---

### 4. `tags` (태그 관리)

사전정의된 태그 목록을 관리합니다.

```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,       -- 태그 이름 (예: "React")
  category VARCHAR(50),                    -- 카테고리 (예: "Frontend")
  usage_count INT DEFAULT 0,               -- 사용 횟수 (통계용)
  is_featured BOOLEAN DEFAULT false,       -- 인기 태그 여부
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_tags_category ON tags(category);
CREATE INDEX idx_tags_is_featured ON tags(is_featured);
```

**태그 카테고리:**

- **Frontend**: React, Vue, Next.js, TypeScript, CSS, HTML, Angular
- **Backend**: Node.js, Java, Spring, Python, Django, Go, PHP, Kotlin
- **Database**: PostgreSQL, MongoDB, MySQL, Redis, Elasticsearch, Firebase
- **DevOps**: Docker, Kubernetes, AWS, GCP, Azure, CI/CD, GitHub Actions
- **Mobile**: React Native, Flutter, iOS, Android, Swift
- **AI/ML**: Machine Learning, Deep Learning, NLP, Computer Vision, LLM, PyTorch, TensorFlow
- **기타**: Architecture, Performance, Security, Testing, API, GraphQL

**중요:**

- ❌ **AI로 새 태그 생성 안 함** (비용 절감)
- ✅ **키워드 매칭**: 제목/내용에서 키워드 찾아 기존 태그 선택
- ✅ **추가 시**: 관리자가 테이블에 수동 INSERT

**예시 데이터:**

```sql
INSERT INTO tags (name, category, is_featured) VALUES
('React', 'Frontend', true),
('Backend', 'Backend', true),
('Database', 'Database', true),
('DevOps', 'DevOps', true),
('AI/ML', 'AI/ML', true);
```

---

### 5. `push_subscriptions` (Push 구독 정보)

Web Push 알림 구독 정보를 저장합니다.

```sql
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,           -- 브라우저 Push endpoint URL
  p256dh TEXT NOT NULL,                    -- 암호화 공개키
  auth TEXT NOT NULL,                      -- 암호화 인증키
  device_os VARCHAR(20) NOT NULL,          -- windows, mac, linux, android, ios
  browser VARCHAR(20) NOT NULL,            -- chrome, firefox, safari, edge
  enabled BOOLEAN DEFAULT true,            -- 기기별 알림 on/off
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX idx_push_subscriptions_enabled ON push_subscriptions(enabled);
```

**컬럼 설명:**

- `endpoint`: 브라우저가 제공하는 고유 Push URL (UNIQUE)
- `p256dh`, `auth`: Web Push 암호화 키 (브라우저에서 생성)
- `device_os`: 기기 OS (프로필 페이지에서 그룹화)
- `enabled`: false면 해당 기기로 Push 발송 안 함

**RLS 정책:**

```sql
CREATE POLICY "Users can manage own subscriptions" ON push_subscriptions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```

---

### 6. `notification_preferences` (유저 알림 설정)

사용자별 전체 알림 on/off 설정을 저장합니다.

```sql
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  new_post_enabled BOOLEAN DEFAULT true,             -- 새 글 알림 전체 on/off
  subscribed_tags TEXT[] NOT NULL DEFAULT '{}',      -- 관심 태그 (빈 배열 = 전체)
  subscribed_company_ids UUID[] NOT NULL DEFAULT '{}', -- 관심 회사 (빈 배열 = 전체)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_notification_preferences_user_id ON notification_preferences(user_id);
```

**알림 설정 구조:**

```
전체 알림 on/off (notification_preferences.new_post_enabled)
  ↓ ON일 때만
기기별 알림 on/off (push_subscriptions.enabled)
```

- **전체 토글 OFF** → 모든 기기 발송 안 됨
- **전체 토글 ON** → `enabled = true`인 기기만 발송

**RLS 정책:**

```sql
CREATE POLICY "Users can manage own preferences" ON notification_preferences
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```

---

## 🔒 Row Level Security (RLS)

### 기본 원칙

- **모든 테이블에 RLS 활성화**
- **사용자별 데이터 격리** (auth.uid() 확인)
- **공개 데이터는 SELECT만 허용** (posts, companies)

### RLS 정책 예시

```sql
-- posts: 모든 사용자 읽기 가능, 쓰기는 서버만
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

## 🔄 마이그레이션

### 파일 위치

`supabase/migrations/*.sql`

### 네이밍 규칙

`{timestamp}_{description}.sql`

**예시:**

- `20240101000000_initial_schema.sql`
- `20240102000000_add_companies.sql`
- `20240103000000_add_posts.sql`
- `20240104000000_add_bookmarks.sql`
- `20240105000000_add_tags.sql`
- `20240106000000_add_rls_policies.sql`

### 새 마이그레이션 생성

```bash
# 로컬
supabase migration new add_feature_name

# 프로덕션 적용
supabase db push
```

---

## 📈 인덱싱 전략

### 1. 기본 인덱스

- **PRIMARY KEY**: 모든 테이블의 `id` (UUID)
- **FOREIGN KEY**: 자동 인덱스 생성 (company_id, post_id, user_id)

### 2. 쿼리 최적화 인덱스

- **`posts.published_at DESC`**: 최신순 정렬
- **`posts.tags (GIN)`**: 배열 검색 (`WHERE tags @> ARRAY['React']`)
- **`posts.title (GIN to_tsvector)`**: 전문 검색 (`WHERE to_tsvector('korean', title) @@ to_tsquery('리액트')`)

### 3. 필터링 인덱스

- **`companies.is_active`**: 활성 기업만 조회
- **`companies.is_featured`**: 인기 블로그 조회
- **`tags.is_featured`**: 인기 태그 조회

---

## 🧪 쿼리 예시

### 최신 게시글 조회 (페이지네이션)

```sql
SELECT p.*, c.name, c.logo_url
FROM posts p
JOIN companies c ON p.company_id = c.id
WHERE c.is_active = true
ORDER BY p.published_at DESC
LIMIT 20 OFFSET 0;
```

### 태그 필터링 (OR 조건)

```sql
SELECT *
FROM posts
WHERE tags && ARRAY['React', 'Backend']  -- 배열 겹치는지 확인
ORDER BY published_at DESC;
```

### 사용자 북마크 조회

```sql
SELECT p.*, c.name, c.logo_url
FROM bookmarks b
JOIN posts p ON b.post_id = p.id
JOIN companies c ON p.company_id = c.id
WHERE b.user_id = auth.uid()
ORDER BY b.created_at DESC;
```

### 인기 태그 조회

```sql
SELECT name, category
FROM tags
WHERE is_featured = true
ORDER BY usage_count DESC
LIMIT 8;
```

---

## 🔧 유지보수

### 정기 작업

- **인덱스 재구성**: `REINDEX` (월 1회)
- **통계 업데이트**: `ANALYZE` (주 1회)
- **오래된 데이터 정리**: 6개월 이상 된 게시글 아카이빙 (선택)

### 백업

- **Supabase 자동 백업**: 프로덕션 환경 일 1회
- **로컬 백업**: `pg_dump` 명령어 사용

---

## 📚 관련 문서

- [API 명세](./api-specification.md) - 각 테이블의 CRUD API
- [프로젝트 개요](./project-overview.md) - 프로젝트 맥락
- [Agent 가이드라인](./agent-guidelines.md) - DB 작업 시 주의사항
