# UI 스타일링 규칙

> **CSS 변수 클래스 기반 스타일링 (하드코딩 금지)**

---

## ⚠️ 절대 금지: 하드코딩 색상

### ❌ 잘못된 예

```typescript
// 하드코딩된 색상 (금지!)
<div className="bg-blue-600 text-white">
<div className="bg-gray-900 dark:bg-gray-100">
<button className="border-gray-300 hover:bg-blue-500">
```

**문제점**:

- 다크모드 지원 어려움
- 일관성 없는 색상
- 테마 변경 시 모든 파일 수정 필요

---

### ✅ 올바른 예

```typescript
// CSS 변수 클래스 사용
<div className="bg-background text-foreground">
<div className="bg-card border-border">
<button className="bg-foreground text-background hover:opacity-90">
```

**장점**:

- 다크모드 자동 지원
- 일관된 색상 시스템
- 테마 변경 시 CSS만 수정

---

## 🎨 사용 가능한 CSS 변수 클래스

### 배경 색상

| 클래스          | 용도          | 라이트    | 다크      |
| --------------- | ------------- | --------- | --------- |
| `bg-background` | 페이지 배경   | `#FAFAFA` | `#141414` |
| `bg-card`       | 카드 배경     | `#FFFFFF` | `#1C1C1C` |
| `bg-muted`      | 보조 배경     | `#F2F2F2` | `#292929` |
| `bg-secondary`  | 세컨더리 배경 | `#F2F2F2` | `#292929` |

### 텍스트 색상

| 클래스                  | 용도        | 라이트    | 다크      |
| ----------------------- | ----------- | --------- | --------- |
| `text-foreground`       | 기본 텍스트 | `#212121` | `#EBEBEB` |
| `text-muted-foreground` | 보조 텍스트 | `#707070` | `#949494` |

### 테두리 색상

| 클래스          | 용도        | 라이트    | 다크      |
| --------------- | ----------- | --------- | --------- |
| `border-border` | 기본 테두리 | `#E0E0E0` | `#333333` |

### 특수 색상

| 클래스                          | 용도      | 설명                      |
| ------------------------------- | --------- | ------------------------- |
| `bg-foreground text-background` | 강조 버튼 | 배경/텍스트 색상 반전     |
| `text-destructive`              | 삭제/경고 | 빨간색 (라이트/다크 동일) |

---

## 🎨 글래스모피즘 유틸리티

### 정의 위치: `app/globals.css`

```css
.glass-sidebar {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(0, 0, 0, 0.1);
}

.glass-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.glass-modal {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(30px);
}

/* 다크모드 */
.dark .glass-sidebar {
  background: rgba(28, 28, 28, 0.7);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.dark .glass-card {
  background: rgba(28, 28, 28, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.dark .glass-modal {
  background: rgba(28, 28, 28, 0.95);
}
```

### 사용 예시

```typescript
// 사이드바
<aside className="glass-sidebar">

// 게시글 카드
<div className="glass-card">

// 필터 모달
<div className="glass-modal">
```

---

## 📐 반응형 브레이크포인트

### Tailwind 기본 브레이크포인트 사용

| 접두사 | 최소 너비 | 용도                              |
| ------ | --------- | --------------------------------- |
| `sm:`  | 640px     | 작은 태블릿                       |
| `md:`  | 768px     | 데스크탑 (주요 브레이크포인트) ⭐ |
| `lg:`  | 1024px    | 큰 데스크탑                       |
| `xl:`  | 1280px    | 매우 큰 화면                      |

### 프로젝트 기준

- **모바일**: `< 768px` (md 미만)
- **데스크탑**: `≥ 768px` (md 이상)

### 사용 예시

```typescript
// 모바일에서 숨김, 데스크탑에서 표시
<div className="hidden md:flex">

// 모바일 1열, 데스크탑 3열
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">

// 모바일 전체 너비, 데스크탑 고정 너비
<button className="w-full md:w-auto">
```

---

## 🎯 레이아웃 패턴

### 1. 모바일 헤더

```typescript
<header className="sticky top-0 z-50 h-16 border-b border-border bg-background/95 backdrop-blur">
  <div className="container flex items-center justify-between h-full px-4">
    <Logo />
    <MobileHamburger />
  </div>
</header>
```

### 2. 데스크탑 사이드바

```typescript
<aside className="fixed left-0 top-0 h-screen w-16 hover:w-60 glass-sidebar transition-all duration-300">
  <nav className="flex flex-col h-full py-4">
    {/* 네비게이션 */}
  </nav>
</aside>
```

### 3. 게시글 카드

```typescript
<article className="glass-card rounded-lg p-6 transition-all hover:shadow-lg hover:-translate-y-1">
  <header className="flex items-center gap-2 mb-4">
    <img className="w-6 h-6 rounded" />
    <span className="text-sm text-muted-foreground">토스</span>
  </header>
  <h3 className="text-lg font-semibold text-foreground mb-2">제목</h3>
  <p className="text-sm text-muted-foreground line-clamp-2">요약</p>
</article>
```

### 4. 버튼 스타일

```typescript
// 기본 버튼
<button className="px-4 py-2 bg-foreground text-background rounded-lg hover:opacity-90 transition">

// 보조 버튼
<button className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-secondary transition">

// 위험 버튼
<button className="px-4 py-2 bg-destructive text-white rounded-lg hover:opacity-90 transition">
```

---

## 🎨 아이콘 사용

### lucide-react 사용

```typescript
import { Heart, Search, Menu, X } from 'lucide-react';

// 아이콘 크기
<Heart className="w-5 h-5" />  // 기본 (20px)
<Heart className="w-4 h-4" />  // 작게 (16px)
<Heart className="w-6 h-6" />  // 크게 (24px)

// 아이콘 색상
<Heart className="text-foreground" />
<Heart className="text-muted-foreground" />
<Heart className="text-destructive" />
```

---

## 📏 간격 (Spacing)

### 일관된 간격 사용

```typescript
// 패딩
p - 2; // 8px
p - 4; // 16px (기본)
p - 6; // 24px (카드)
p - 8; // 32px (큰 여백)

// 마진
m - 2; // 8px
m - 4; // 16px (기본)
m - 6; // 24px
m - 8; // 32px

// Gap (그리드/플렉스)
gap - 2; // 8px
gap - 4; // 16px (기본)
gap - 6; // 24px
gap - 8; // 32px
```

---

## 🎯 타이포그래피

### 텍스트 크기

```typescript
text-xs    // 12px - 보조 텍스트
text-sm    // 14px - 기본 텍스트
text-base  // 16px - 중요 텍스트
text-lg    // 18px - 제목
text-xl    // 20px - 큰 제목
text-2xl   // 24px - 페이지 제목
```

### 폰트 굵기

```typescript
font - normal; // 400 - 일반
font - medium; // 500 - 중간
font - semibold; // 600 - 반굵게 (제목)
font - bold; // 700 - 굵게
```

### 줄 제한 (Line Clamp)

```typescript
line - clamp - 1; // 1줄 제한
line - clamp - 2; // 2줄 제한
line - clamp - 3; // 3줄 제한
```

---

## ⚡ 애니메이션

### Transition

```typescript
// 기본
transition;

// 특정 속성
transition - colors; // 색상만
transition - opacity; // 투명도만
transition - transform; // 변형만
transition - all; // 모든 속성

// 지속 시간
duration - 150; // 150ms (빠름)
duration - 300; // 300ms (기본)
duration - 500; // 500ms (느림)
```

### Hover 효과

```typescript
// 투명도
hover: opacity - 90;
hover: opacity - 80;

// 그림자
hover: shadow - lg;
hover: shadow - xl;

// 변형
hover: -translate - y - 1; // 위로 이동
hover: scale - 105; // 확대
```

---

## 📚 참고 문서

- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)
- [lucide-react 아이콘](https://lucide.dev/)
- [app/globals.css](../../../app/globals.css)
