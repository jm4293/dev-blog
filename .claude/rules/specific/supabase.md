---
paths:
  - 'supabase/**/*.ts'
  - 'features/**/services/fetch.ts'
  - 'app/api/**/*.ts'
---

# Supabase 클라이언트 규칙

> **이 규칙은 Supabase를 사용하는 파일을 수정할 때 자동으로 적용됩니다.**

---

## 🔑 클라이언트/서버 구분 (중요!)

### 클라이언트 사이드 (`createSupabaseClient`)

**사용 위치**: 브라우저 (클라이언트 컴포넌트, hooks)

```typescript
import { createSupabaseClient } from '@/supabase/client.supabase';

export function usePosts() {
  const supabase = createSupabaseClient();

  const { data } = await supabase.from('posts').select('*');
}
```

**특징**:

- `NEXT_PUBLIC_SUPABASE_ANON_KEY` 사용
- RLS 정책 자동 적용
- 브라우저에서 실행

---

### 서버 사이드 (`createSupabaseServerClient`)

**사용 위치**: API Routes, Server Components, Server Actions

```typescript
import { createSupabaseServerClient } from '@/supabase/server.supabase';

export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase.from('posts').select('*');
}
```

**특징**:

- 쿠키 기반 인증
- RLS 정책 적용
- 서버에서만 실행

---

### ⚠️ 절대 혼용 금지!

```typescript
// ❌ 잘못된 예 (API Route에서 클라이언트 사용)
import { createSupabaseClient } from '@/supabase/client.supabase';
// ✅ 올바른 예
import { createSupabaseServerClient } from '@/supabase/server.supabase';

export async function GET() {
  const supabase = createSupabaseClient(); // 금지!
}

export async function GET() {
  const supabase = await createSupabaseServerClient();
}
```

---

## 🛡️ RLS (Row Level Security) 정책

### 자동으로 적용되는 RLS 정책

#### 1. posts 테이블

```sql
-- 모든 사용자 읽기 가능
CREATE POLICY "Posts are viewable by everyone" ON posts
  FOR SELECT USING (true);
```

#### 2. bookmarks 테이블

```sql
-- 사용자별 CRUD (자동 필터링)
CREATE POLICY "Users can view own bookmarks" ON bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookmarks" ON bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks" ON bookmarks
  FOR DELETE USING (auth.uid() = user_id);
```

**중요**: RLS가 활성화된 테이블은 자동으로 필터링됨!

```typescript
// 현재 로그인한 사용자의 북마크만 자동으로 조회됨
const { data } = await supabase.from('bookmarks').select('*');
// WHERE user_id = auth.uid() 자동 추가!
```

---

## 🚀 쿼리 최적화

### 1. 필요한 컬럼만 선택

```typescript
// ❌ 잘못된 예 (모든 컬럼)
const { data } = await supabase
  .from('posts')
  .select('*');

// ✅ 올바른 예 (필요한 컬럼만)
const { data } = await supabase
  .from('posts')
  .select('id, title, url, published_at');
```

### 2. 조인 시 구체적인 컬럼

```typescript
// ❌ 잘못된 예
const { data } = await supabase
  .from('bookmarks')
  .select('*, posts(*)');

// ✅ 올바른 예
const { data } = await supabase
  .from('bookmarks')
  .select(`
    id,
    created_at,
    posts (
      id,
      title,
      url,
      summary,
      tags,
      published_at
    )
  `);
```

### 3. 필터링은 DB에서

```typescript
// ❌ 잘못된 예 (JS에서 필터링)
const { data } = await supabase.from('posts').select('*');
const filtered = data.filter(post => post.tags.includes('Frontend'));

// ✅ 올바른 예 (DB에서 필터링)
const { data } = await supabase
  .from('posts')
  .select('*')
  .contains('tags', ['Frontend']);
```

---

## 📝 쿼리 패턴

### 페이지네이션

```typescript
const PAGE_SIZE = 20;
const page = 1;

const { data, error, count } = await supabase
  .from('posts')
  .select('*', { count: 'exact' })
  .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
```

### 검색 (Full-text)

```typescript
const { data } = await supabase.from('posts').select('*').textSearch('title', searchQuery);
```

### 배열 필터링 (태그)

```typescript
// OR 조건: tags에 Frontend 또는 Backend 포함
const { data } = await supabase.from('posts').select('*').or('tags.cs.{Frontend}, tags.cs.{Backend}');
```

### 정렬

```typescript
const { data } = await supabase.from('posts').select('*').order('published_at', { ascending: false });
```

---

## 🔒 인증

### 현재 사용자 가져오기

```typescript
const {
  data: { user },
  error,
} = await supabase.auth.getUser();

if (error || !user) {
  // 비로그인 상태
  return null;
}

// 로그인된 사용자
console.log(user.id, user.email);
```

### 로그아웃

```typescript
await supabase.auth.signOut();
```

---

## ⚠️ 주의사항

### 1. SUPABASE_SERVICE_ROLE_KEY 사용 금지

```typescript
// ❌ 절대 금지! (RLS 우회)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // 위험!
);
```

**Service Role Key는**:

- RLS를 우회함
- 모든 데이터 접근 가능
- 관리자 전용 스크립트에서만 사용 (GitHub Actions 등)

### 2. 에러 핸들링 필수

```typescript
const { data, error } = await supabase.from('posts').select('*');

if (error) {
  console.error('Supabase error:', error);
  throw new Error('Failed to fetch posts');
}

return data;
```

### 3. types.supabase.ts 수동 수정 금지

```typescript
// ❌ types.supabase.ts 파일은 자동 생성됨
// 수동으로 수정하지 말 것!
```

**타입 업데이트 방법**:

```bash
npx supabase gen types typescript --project-id <project-id> > supabase/types.supabase.ts
```

---

## 📚 참고 문서

- [데이터베이스 스키마](../../../docs/database-schema.md)
- [Supabase 공식 문서](https://supabase.com/docs)
