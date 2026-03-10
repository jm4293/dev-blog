# 상태 관리 규칙

> **TanStack Query vs Jotai - 명확한 책임 분리**

---

## 🎯 기본 원칙

### TanStack Query (주요 상태 관리)

**용도**: 서버 데이터

- ✅ API 호출 결과
- ✅ 데이터베이스 조회 결과
- ✅ 캐싱이 필요한 데이터
- ✅ 서버와 동기화가 필요한 데이터

### Jotai (최소 사용)

**용도**: UI 상태만

- ✅ 모달 열림/닫힘
- ✅ 모바일 메뉴 상태
- ✅ 토스트 알림
- ✅ 테마 (다크/라이트)

---

## ✅ TanStack Query 사용 예시

### 1. 데이터 조회 (Query)

```typescript
// features/posts/hooks/usePosts.ts
import { useQuery } from '@tanstack/react-query';
import { fetchPosts } from '../services/fetch';

export function usePosts(page: number, search: string) {
  return useQuery({
    queryKey: ['posts', page, search],
    queryFn: () => fetchPosts(page, search),
    staleTime: 1000 * 60 * 5, // 5분
  });
}
```

**사용**:

```typescript
export function PostsContainer() {
  const { data, isLoading, error } = usePosts(1, '');

  if (isLoading) return <Skeleton />;
  if (error) return <Error />;

  return <PostList posts={data.posts} />;
}
```

### 2. 데이터 변경 (Mutation)

```typescript
// features/bookmarks/hooks/useAddBookmark.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBookmark } from '../services/fetch';

export function useAddBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => createBookmark(postId),
    onSuccess: () => {
      // 캐시 무효화 (자동 재조회)
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });
}
```

**사용**:

```typescript
export function BookmarkButton({ postId }: Props) {
  const mutation = useAddBookmark();

  const handleClick = () => {
    mutation.mutate(postId);
  };

  return (
    <button onClick={handleClick} disabled={mutation.isPending}>
      {mutation.isPending ? '저장 중...' : '즐겨찾기'}
    </button>
  );
}
```

---

## ✅ Jotai 사용 예시

### 1. Atom 정의

```typescript
// atoms/mobileMenu.atom.ts
import { atom } from 'jotai';

export const mobileMenuOpenAtom = atom<boolean>(false);
```

### 2. Atom 사용

```typescript
// components/layout/MobileHamburger.tsx
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

---

## ❌ 잘못된 사용 예시

### 1. Jotai에 서버 데이터 저장 (금지!)

```typescript
// ❌ 잘못된 예
import { atom } from 'jotai';

// 서버 데이터를 Jotai에 저장 금지!
export const postsAtom = atom<Post[]>([]);

export function usePosts() {
  const [posts, setPosts] = useAtom(postsAtom);

  useEffect(() => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then((data) => setPosts(data.posts));
  }, []);
}
```

**문제점**:

- 캐싱 없음
- 중복 요청
- 로딩/에러 상태 관리 어려움
- 서버 데이터 동기화 어려움

```typescript
// ✅ 올바른 예 (TanStack Query 사용)
import { useQuery } from '@tanstack/react-query';

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch('/api/posts').then((res) => res.json()),
  });
}
```

---

### 2. TanStack Query 없이 fetch 직접 호출 (금지!)

```typescript
// ❌ 잘못된 예
export function PostsContainer() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts);
        setLoading(false);
      });
  }, []);
}
```

**문제점**:

- 캐싱 없음
- 중복 요청 방지 없음
- 에러 핸들링 복잡
- 재시도 로직 없음

```typescript
// ✅ 올바른 예 (TanStack Query 사용)
import { usePosts } from '@/features/posts/hooks';

export function PostsContainer() {
  const { data, isLoading } = usePosts();

  if (isLoading) return <Skeleton />;

  return <PostList posts={data.posts} />;
}
```

---

## 📋 체크리스트

### 새로운 상태를 추가할 때:

**질문 1**: 이 데이터는 서버에서 오는가?

- ✅ Yes → TanStack Query 사용
- ❌ No → 질문 2로

**질문 2**: 이 상태는 UI 표시용인가?

- ✅ Yes → Jotai 사용
- ❌ No → useState 또는 props 사용

---

## 🗂️ 현재 사용 중인 Atom 목록

```typescript
// atoms/mobileMenu.atom.ts
export const mobileMenuOpenAtom: boolean;

// atoms/toast.atom.ts
export const toastsAtom: Toast[];
```

**참고**: 새 Atom 추가 시 신중하게 고려하세요. 대부분의 경우 TanStack Query로 해결 가능합니다.

---

## 🚀 TanStack Query 설정

### Query Keys 중앙 관리

```typescript
// lib/query-keys.ts
export const queryKeys = {
  posts: {
    all: ['posts'] as const,
    list: (filters: Filters) => ['posts', 'list', filters] as const,
    detail: (id: string) => ['posts', 'detail', id] as const,
  },
  bookmarks: {
    all: ['bookmarks'] as const,
    list: () => ['bookmarks', 'list'] as const,
  },
};
```

**사용**:

```typescript
useQuery({
  queryKey: queryKeys.posts.list({ page: 1, search: '' }),
  queryFn: () => fetchPosts(1, ''),
});
```

---

## 📚 참고 문서

- [TanStack Query 공식 문서](https://tanstack.com/query/latest)
- [Jotai 공식 문서](https://jotai.org/)
- [폴더 구조](../../../docs/folder-structure.md)
