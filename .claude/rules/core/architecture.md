# 아키텍처 규칙 (FSD 패턴)

상세 내용: [폴더 구조 문서](../../docs/core/folder-structure.md)

## 핵심 구조

```
features/{기능명}/
├── actions/       # Server Actions
├── services/      # API 호출, 비즈니스 로직
├── hooks/         # TanStack Query 훅
└── ui/            # 클라이언트 컴포넌트
```

## 데이터 흐름

```
page.tsx → features/ui → features/hooks → features/services → API Route
```

## 규칙

- ✅ 기능별 독립적인 폴더
- ✅ 단방향 의존성
- ❌ features 간 직접 의존 금지
