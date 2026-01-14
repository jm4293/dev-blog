# devBlog.kr 성능 최적화 가이드

이 문서는 devBlog.kr의 성능을 최적화하고 모니터링하는 방법을 설명합니다.

---

## 🎯 성능 목표

| 지표 | 목표 | 현재 |
|------|------|------|
| **Lighthouse 점수** | 85+ | ? |
| **First Contentful Paint (FCP)** | < 1.8s | ? |
| **Largest Contentful Paint (LCP)** | < 2.5s | ? |
| **Cumulative Layout Shift (CLS)** | < 0.1 | ? |
| **Time to Interactive (TTI)** | < 3.5s | ? |

---

## 📊 Lighthouse 분석

### 로컬에서 Lighthouse 실행

```bash
# 1. 프로덕션 빌드
npm run build

# 2. 프로덕션 서버 시작
npm run start

# 3. Chrome DevTools에서 Lighthouse 실행
# Chrome > F12 > Lighthouse > Analyze page load
```

### Lighthouse 결과 해석

**분수 범위:**
- 90-100: Green (우수)
- 50-89: Yellow (개선 필요)
- 0-49: Red (긴급 개선)

**개선 순서:**
1. Performance (성능) - 가장 중요
2. Accessibility (접근성)
3. Best Practices (모범 사례)
4. SEO
5. PWA

---

## 🖼️ 이미지 최적화

### Next.js Image Component 사용

**잘못된 예:**
```tsx
// ❌ HTML img 태그 사용
<img src="/images/blog.jpg" alt="Blog" />
```

**올바른 예:**
```tsx
// ✅ Next.js Image 컴포넌트 사용
import Image from 'next/image';

<Image
  src="/images/blog.jpg"
  alt="Blog"
  width={800}
  height={600}
  priority={false}
  loading="lazy"
/>
```

### Image 컴포넌트 주요 속성

| 속성 | 설명 | 기본값 |
|------|------|--------|
| `src` | 이미지 경로 | 필수 |
| `alt` | 대체 텍스트 | 필수 |
| `width` | 이미지 너비 (px) | 필수 |
| `height` | 이미지 높이 (px) | 필수 |
| `priority` | 우선 로딩 | false |
| `loading` | 로딩 전략 | "lazy" |
| `quality` | JPEG 품질 (1-100) | 75 |
| `placeholder` | 로딩 중 표시 | "empty" |

### 권장 이미지 포맷

```
jpg/jpeg    → 사진, 복잡한 이미지
png         → 투명도 필요 시
webp        → 최신 포맷 (자동 변환)
avif        → 최고 압축률 (자동 변환)
svg         → 로고, 아이콘
```

### 이미지 크기 최적화

```bash
# 이미지 압축 도구 설치
npm install -D imagemin imagemin-mozjpeg imagemin-pngquant

# 이미지 압축
npx imagemin public/images/* --out-dir=public/images
```

---

## 📦 번들 크기 분석

### 번들 분석기 설치

```bash
npm install -D @next/bundle-analyzer
```

### next.config.js 수정

```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
```

### 번들 분석 실행

```bash
ANALYZE=true npm run build
```

### 번들 최적화 팁

1. **코드 스플리팅**
```tsx
// ✅ 동적 import 사용
const HeavyComponent = dynamic(() => import('@/components/Heavy'), {
  loading: () => <p>로딩 중...</p>,
});
```

2. **Tree Shaking**
```tsx
// ❌ 전체 라이브러리 import
import _ from 'lodash';

// ✅ 필요한 함수만 import
import { debounce } from 'lodash-es';
```

3. **라이브러리 대체**
```
date-fns      → 가벼운 날짜 처리
clsx (or cn)  → className 병합
jotai          → 가벼운 상태 관리
```

---

## 🚀 성능 개선 체크리스트

### 이미지 & 미디어
- [ ] 모든 이미지에 width/height 지정
- [ ] Next.js Image 컴포넌트 사용
- [ ] WebP/AVIF 포맷 지원
- [ ] Lazy loading 활성화
- [ ] 이미지 압축 (75% 이상 압축률)

### 코드 & 번들
- [ ] 불필요한 의존성 제거
- [ ] 대용량 컴포넌트는 dynamic import
- [ ] Tree shaking 확인
- [ ] 번들 크기 1MB 이하

### 렌더링 & 로딩
- [ ] Suspense/Loading 상태 구현
- [ ] Critical path 최소화
- [ ] Font 최적화 (시스템 폰트 사용)
- [ ] 캐시 정책 설정

### SEO & 메타
- [ ] 메타 태그 완벽 설정
- [ ] Open Graph 이미지 최적화
- [ ] robots.txt, sitemap.xml 설정
- [ ] 구조화된 데이터 (JSON-LD)

---

## 📈 모니터링 도구

### Vercel Analytics
```bash
# 자동으로 데이터 수집 (배포 후)
# Vercel 대시보드에서 확인
```

### Google PageSpeed Insights
```
https://pagespeed.web.dev/
```

### WebPageTest
```
https://www.webpagetest.org/
```

### Chrome DevTools Coverage
```
F12 > More tools > Coverage
```

---

## 🔧 성능 최적화 팁

### 1. 폰트 최적화

```tsx
// next/font 사용 (시스템 폰트)
import { Noto_Sans_KR } from 'next/font/google';

const notoSans = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '700'],
});

// 또는 시스템 폰트 사용
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### 2. 캐시 정책

```javascript
// next.config.js
const nextConfig = {
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 5,
  },
};
```

### 3. 라우트 프리페칭

```tsx
import Link from 'next/link';

// prefetch 기본값: 'auto' (뷰포트에 들어올 때 프리페치)
<Link href="/about" prefetch={true}>
  About
</Link>
```

### 4. 조건부 렌더링

```tsx
// ✅ 서버 컴포넌트에서 처리
export default async function Page() {
  const data = await fetch(...);

  if (!data) return <NotFound />;

  return <Content data={data} />;
}
```

---

## 📋 배포 전 체크리스트

```bash
# 1. 빌드 확인
npm run build

# 2. 번들 분석
ANALYZE=true npm run build

# 3. Lighthouse 테스트
npm run start
# Chrome DevTools에서 Lighthouse 실행

# 4. 환경 변수 확인
cat .env.local

# 5. 성능 목표 달성 확인
# Lighthouse: 85점 이상
# FCP: 1.8초 이내
# LCP: 2.5초 이내
```

---

## 🎓 참고 자료

- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [PageSpeed Insights](https://pagespeed.web.dev/)

---

**마지막 업데이트**: 2026년 1월 14일
