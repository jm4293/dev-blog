# 환경 변수 설정 가이드

> 개발 환경과 프로덕션 환경의 환경 변수를 올바르게 설정하는 방법입니다.

---

## 📋 환경 변수 개요

### 로컬 개발 환경

- **파일**: `.env.local`
- **Git**: 제외 (.gitignore)
- **용도**: 로컬 개발 서버 실행 시 사용

### 프로덕션 환경

- **Vercel**: Vercel 대시보드에서 설정
- **GitHub Actions**: GitHub Secrets에서 설정

---

## 🔧 1. 로컬 환경 설정 (.env.local)

### 필수 환경 변수

```bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Vercel Cron Secret
CRON_SECRET=your-random-secret-string-minimum-32-characters

# 사이트 URL (로컬)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 선택적 환경 변수

```bash
# OpenAI API (태그 자동 생성 - 현재 비활성화)
OPENAI_API_KEY=sk-proj-...

# Web Push 알림 (VAPID Keys)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
VAPID_SUBJECT=mailto:your-email@example.com

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 환경 변수 생성 방법

**1. Supabase**

```bash
# 1. https://supabase.com 접속
# 2. 프로젝트 생성 후 Settings > API 메뉴
# 3. URL, anon key, service_role key 복사
```

**2. CRON_SECRET**

```bash
# 터미널에서 랜덤 문자열 생성
openssl rand -hex 32
```

**3. VAPID Keys (Web Push)**

```bash
# 한 번만 생성 (변경하면 기존 구독 무효화)
npx tsx -e "const webpush = require('web-push'); console.log(JSON.stringify(webpush.generateVAPIDKeys()))"
```

---

## 🚀 2. Vercel 배포 환경 설정

### Vercel 대시보드 설정

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard
   - 프로젝트 선택 → Settings → Environment Variables

2. **환경 변수 추가**

#### Production 환경 (필수)

| 변수명                          | 값                                 | Environment         |
| ------------------------------- | ---------------------------------- | ------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | `https://your-project.supabase.co` | Production, Preview |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...`                           | Production, Preview |
| `SUPABASE_SERVICE_ROLE_KEY`     | `eyJ...` ⚠️ **민감**               | Production          |
| `CRON_SECRET`                   | `your-secret` ⚠️ **민감**          | Production          |
| `NEXT_PUBLIC_SITE_URL`          | `https://devblog.kr`               | Production          |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY`  | `BOd...`                           | Production          |
| `VAPID_PRIVATE_KEY`             | `gdj...` ⚠️ **민감**               | Production          |
| `VAPID_SUBJECT`                 | `mailto:your-email@example.com`    | Production          |

#### Preview/Development 환경 (선택)

- Preview: Pull Request 배포 시 사용 (Production과 동일하게 설정 가능)
- Development: `vercel dev` 명령어 사용 시 (.env.local 우선)

### ⚠️ 주의사항

- **NEXT*PUBLIC*\* 변수**: 클라이언트에 노출됨 (브라우저에서 접근 가능)
- **그 외 변수**: 서버에서만 접근 가능
- **민감한 정보**: `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET`, `VAPID_PRIVATE_KEY`는 절대 클라이언트에 노출 금지

---

## 🔐 3. GitHub Secrets 설정

### GitHub Actions Cron Job용

1. **GitHub 리포지토리 접속**
   - https://github.com/jm4293/dev-blog
   - Settings → Secrets and variables → Actions

2. **Repository Secrets 추가**

| Secret 이름            | 값                   | 용도             |
| ---------------------- | -------------------- | ---------------- |
| `CRON_SECRET`          | `your-secret`        | Cron Job 인증    |
| `NEXT_PUBLIC_SITE_URL` | `https://devblog.kr` | API 호출 시 사용 |

### GitHub Actions 워크플로우 예시

```yaml
# .github/workflows/fetch-posts.yml
name: Fetch Blog Posts

on:
  schedule:
    - cron: '0 */6 * * *' # 6시간마다 (하루 4회)
  workflow_dispatch: # 수동 실행

jobs:
  fetch:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Vercel Cron
        run: |
          curl -X GET "${{ secrets.NEXT_PUBLIC_SITE_URL }}/api/cron/fetch-posts" \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

---

## 🔄 4. 환경 변수 동기화

### 로컬 → Vercel

```bash
# Vercel CLI 설치
npm i -g vercel

# 환경 변수 추가
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add SUPABASE_SERVICE_ROLE_KEY production

# 또는 Vercel 대시보드에서 수동 입력
```

### Vercel → 로컬

```bash
# Vercel 환경 변수 다운로드
vercel env pull .env.local
```

---

## 📝 5. 환경 변수 체크리스트

### 로컬 개발 환경 (.env.local)

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `CRON_SECRET`
- [ ] `NEXT_PUBLIC_SITE_URL` (http://localhost:3000)
- [ ] `NEXT_PUBLIC_VAPID_PUBLIC_KEY` (선택)
- [ ] `VAPID_PRIVATE_KEY` (선택)
- [ ] `VAPID_SUBJECT` (선택)

### Vercel Production

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `CRON_SECRET`
- [ ] `NEXT_PUBLIC_SITE_URL` (https://devblog.kr)
- [ ] `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
- [ ] `VAPID_PRIVATE_KEY`
- [ ] `VAPID_SUBJECT`
- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID` (선택)

### GitHub Secrets

- [ ] `CRON_SECRET`
- [ ] `NEXT_PUBLIC_SITE_URL`

---

## 🐛 문제 해결

### 1. Supabase 연결 오류

**증상**: "Invalid API key" 에러

**해결**:

```bash
# .env.local 확인
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Vercel 환경 변수 재설정
vercel env rm NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
```

### 2. Cron Job 인증 실패

**증상**: "Unauthorized" (401 에러)

**해결**:

- Vercel 환경 변수에 `CRON_SECRET` 올바르게 설정되었는지 확인
- GitHub Secrets의 `CRON_SECRET`과 동일한지 확인

### 3. Web Push 알림 오류

**증상**: "Invalid VAPID keys"

**해결**:

- VAPID Keys를 다시 생성하지 말 것 (기존 구독 무효화)
- 로컬과 Vercel의 키가 동일한지 확인

---

## 📚 관련 문서

- [프로젝트 개요](./project-overview.md)
- [Agent 가이드라인](./agent-guidelines.md)
- [데이터베이스 스키마](./database-schema.md)

---

**마지막 업데이트**: 2026년 2월 15일
