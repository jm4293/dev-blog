# Google Search Console "리디렉션이 포함된 페이지" 오류 해결기 - Vercel 도메인 설정

## 문제 발생

Google Search Console에서 사이트맵 유효성 검사를 진행하던 중, 다음과 같은 오류가 발생했습니다.

```
유효성 검사 상태: 실패함
문제: 리디렉션이 포함된 페이지
URL: https://devblog.kr/posts
```

분명 사이트는 정상적으로 작동하고 있었기 때문에, 처음에는 Next.js의 middleware 설정 문제인 줄 알았습니다.

## 원인 분석

### 처음 의심한 부분: Next.js Middleware

프로젝트에는 루트 경로(`/`)를 `/posts`로 리디렉션하는 middleware가 있었습니다.

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/posts';
    return NextResponse.redirect(url);
  }
}
```

하지만 이건 `/` → `/posts` 리디렉션일 뿐, `/posts` 자체에 리디렉션이 걸려있는 건 아니었습니다.

### 진짜 원인: Vercel 도메인 설정

Vercel 대시보드의 도메인 설정을 확인해보니 문제를 발견했습니다.

**기존 (잘못된) 설정:**

| 도메인           | 설정                              |
| ---------------- | --------------------------------- |
| `devblog.kr`     | → 307 리디렉션 → `www.devblog.kr` |
| `www.devblog.kr` | Production 연결                   |

**문제점:**

1. 사이트맵과 환경변수(`NEXT_PUBLIC_SITE_URL`)는 `https://devblog.kr` 사용
2. 하지만 Vercel에서 `devblog.kr` → `www.devblog.kr`로 리디렉션 설정
3. Google이 `devblog.kr/posts`를 크롤링하면 `www.devblog.kr/posts`로 리디렉션됨
4. 결과: "리디렉션이 포함된 페이지" 오류 발생

## 해결 방법

Vercel 도메인 설정에서 리디렉션 방향을 반대로 변경했습니다.

**수정된 설정:**

| 도메인           | 설정                          |
| ---------------- | ----------------------------- |
| `devblog.kr`     | Production 연결 (메인)        |
| `www.devblog.kr` | → 307 리디렉션 → `devblog.kr` |

![Vercel 도메인 설정](./images/vercel-domain-settings.png)

**설정 방법:**

1. Vercel Dashboard → Settings → Domains
2. `devblog.kr`: "Connect to an environment" → Production 선택
3. `www.devblog.kr`: "Redirect to Another Domain" → `devblog.kr` 입력
4. 각각 Save 클릭

## 결과

도메인 설정 변경 후 Google Search Console에서 유효성 검사를 다시 요청하면 됩니다. 이제 `devblog.kr`이 메인 도메인으로 작동하고, `www.devblog.kr`로 접속하면 `devblog.kr`로 리디렉션됩니다.

## 교훈

- Google Search Console 오류가 코드 문제라고 단정짓지 말 것
- 인프라/호스팅 설정도 함께 확인할 것
- 사이트맵의 URL과 실제 서비스되는 도메인이 일치하는지 확인할 것
- www와 non-www 중 하나를 메인으로 정하고 일관성 있게 사용할 것
