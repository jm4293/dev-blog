---
paths:
  - 'components/**/*.tsx'
  - 'features/**/ui/*.tsx'
---

# React 컴포넌트 규칙

## Export 방식

- ✅ function 키워드 + named export
- ❌ export default 금지 (app/ 제외)

```typescript
// ✅ 올바른 예
export function PostCard({ post }: PostCardProps) {
  return <div>...</div>;
}
```

## Props 타입

- ✅ interface 사용 (prefix 'I' 없음)

```typescript
interface PostCardProps {
  post: Post;
  onBookmark?: (id: string) => void;
}
```
