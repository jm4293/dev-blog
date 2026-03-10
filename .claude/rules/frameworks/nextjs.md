---
paths:
  - 'app/**/*.tsx'
  - 'app/**/page.tsx'
  - 'app/**/layout.tsx'
---

# Next.js App Router 규칙

## page.tsx는 항상 서버 컴포넌트

- ❌ 'use client' 디렉티브 금지
- ✅ export const metadata 설정
- ✅ 클라이언트 로직은 features/{기능}/ui로 분리

## 올바른 예

```typescript
// app/(pages)/posts/page.tsx (서버)
import { PostsContainer } from '@/features/posts';

export const metadata = { title: '포스트' };

export default function PostsPage() {
  return <PostsContainer />;
}
```
