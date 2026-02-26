# ISR (Incremental Static Regeneration) 설정 가이드

## 개요

이 문서는 GitHub Actions에서 새 블로그 게시글을 수집한 후 자동으로 ISR 캐시를 갱신하는 설정 방법을 설명합니다.

## 작동 방식

```
GitHub Actions (매일 15:00, 21:00 KST)
  ↓
scripts/fetch-posts.ts 실행
  ↓
Supabase에 새 게시글 저장
  ↓
stats.postsCreated > 0 확인
  ↓
POST /api/revalidate?secret=xxx&path=/posts
  ↓
revalidatePath('/posts') 실행
  ↓
다음 사용자 방문 시 최신 데이터로 페이지 재생성
```

## 1. 환경 변수 생성

### REVALIDATE_SECRET 생성

터미널에서 안전한 랜덤 문자열을 생성합니다:

```bash
# Linux/macOS
openssl rand -hex 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

생성된 값을 복사해둡니다 (예: `a1b2c3d4e5f6...`)

## 2. 로컬 환경 설정

`.env.local` 파일에 추가:

```bash
# ISR Revalidation Secret
REVALIDATE_SECRET=a1b2c3d4e5f6...  # 방금 생성한 값
```

## 3. Vercel 환경 변수 설정

1. Vercel 대시보드 접속: https://vercel.com/dashboard
2. 프로젝트 선택 → **Settings** → **Environment Variables**
3. 다음 변수 추가:

| Name                | Value       | Environment                      |
| ------------------- | ----------- | -------------------------------- |
| `REVALIDATE_SECRET` | (생성한 값) | Production, Preview, Development |

**중요:** 모든 환경(Production, Preview, Development)에 추가해야 합니다.

## 4. GitHub Actions Secrets 설정

1. GitHub 저장소 접속
2. **Settings** → **Secrets and variables** → **Actions**
3. **New repository secret** 클릭
4. 다음 Secret 추가:

| Name                | Secret      |
| ------------------- | ----------- |
| `REVALIDATE_SECRET` | (생성한 값) |

**기존 Secrets 확인:**

- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `OPENAI_API_KEY`
- ✅ `CRON_SECRET`
- ✅ `NEXT_PUBLIC_SITE_URL`
- 🆕 `REVALIDATE_SECRET` (추가됨)

## 5. 테스트

### 로컬 테스트

```bash
# 1. 개발 서버 실행
npm run dev

# 2. 다른 터미널에서 fetch-posts 스크립트 실행
npx tsx scripts/fetch-posts.ts

# 3. 로그 확인
# "✅ ISR 캐시 갱신 완료" 메시지가 나오면 성공
```

### 프로덕션 테스트

```bash
# GitHub Actions 수동 실행
# GitHub 저장소 → Actions → "블로그 게시글 자동 수집" → Run workflow

# 실행 로그에서 다음 메시지 확인:
# 🔄 ISR 캐시 갱신 중...
# ✅ ISR 캐시 갱신 완료
```

### API 직접 테스트

```bash
# 로컬 환경
curl -X POST "http://localhost:3000/api/revalidate?secret=YOUR_SECRET&path=/posts"

# 프로덕션 환경
curl -X POST "https://devblog.kr/api/revalidate?secret=YOUR_SECRET&path=/posts"
```

**예상 응답:**

```json
{
  "revalidated": true,
  "path": "/posts",
  "timestamp": "2024-02-26T12:34:56.789Z"
}
```

## 6. ISR 설정 확인

### app/(pages)/posts/page.tsx

```typescript
// ISR 30분마다 자동 재생성
export const revalidate = 1800; // 30분 = 1800초
```

이 설정으로:

- ✅ 30분마다 자동 재생성
- ✅ GitHub Actions 호출 시 즉시 재생성
- ✅ 사용자는 항상 최신 데이터 확인

## 7. 문제 해결

### "Invalid secret" 오류

**원인:** `REVALIDATE_SECRET` 값이 일치하지 않음

**해결:**

1. `.env.local`, Vercel, GitHub Actions의 값이 모두 동일한지 확인
2. 값 앞뒤 공백 제거
3. 특수문자가 URL 인코딩되지 않았는지 확인

### "Error revalidating" 오류

**원인:** Next.js revalidatePath() 함수 오류

**해결:**

1. Next.js 버전 확인 (14.0.0 이상 필요)
2. `npm run build` 로컬 빌드 테스트
3. Vercel 재배포

### ISR 캐시가 갱신되지 않음

**원인:** 환경 변수 미설정 또는 API 호출 실패

**해결:**

1. GitHub Actions 로그에서 ISR 갱신 로그 확인
2. Vercel 로그에서 `/api/revalidate` 호출 확인
3. `NEXT_PUBLIC_SITE_URL`이 올바른 도메인인지 확인

## 8. 모니터링

### GitHub Actions 로그

```
✅ 수집 완료!
📊 실행 결과:
  처리한 블로그 수: 32
  발견한 게시글 수: 45
  새로 저장한 게시글 수: 5
  에러 수: 0
  소요 시간: 12.34초

🔄 ISR 캐시 갱신 중...
✅ ISR 캐시 갱신 완료 {
  "revalidated": true,
  "path": "/posts",
  "timestamp": "2024-02-26T06:00:00.000Z"
}

🔔 Push 알림 발송 중...
✅ Push 알림 발송 완료
```

### Vercel 로그

```
POST /api/revalidate?secret=***&path=/posts
Status: 200
Response: { "revalidated": true, ... }
```

## 9. 추가 경로 갱신

다른 페이지도 ISR 갱신이 필요한 경우:

### scripts/fetch-posts.ts 수정

```typescript
// 여러 경로 갱신
const pathsToRevalidate = ['/posts', '/bookmarks', '/companies'];

for (const path of pathsToRevalidate) {
  const response = await fetch(`${siteUrl}/api/revalidate?secret=${revalidateSecret}&path=${path}`, { method: 'POST' });
  // ...
}
```

## 10. 참고 자료

- [Next.js ISR 공식 문서](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [Next.js revalidatePath API](https://nextjs.org/docs/app/api-reference/functions/revalidatePath)
- [Vercel On-Demand Revalidation](https://vercel.com/docs/concepts/next.js/incremental-static-regeneration)

---

**작성일:** 2024-02-26
**작성자:** devBlog.kr 팀
