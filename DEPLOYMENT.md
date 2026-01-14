# devBlog.kr 배포 가이드

이 문서는 devBlog.kr을 프로덕션 환경에 배포하는 방법을 설명합니다.

---

## 📋 배포 전 체크리스트

### 1. 코드 및 문서

- [x] README.md - 프로젝트 개요 및 설치 가이드
- [x] CLAUDE.md - 상세 기술 문서 및 아키텍처
- [x] PERFORMANCE.md - 성능 최적화 가이드
- [x] .env.example - 환경 변수 템플릿

### 2. SEO 최적화

- [x] robots.txt - 검색 엔진 크롤러 지시
- [x] sitemap.xml - 동적 사이트맵
- [x] 메타 태그 - Open Graph, Twitter Card
- [x] OG 이미지 - 소셜 공유 이미지

### 3. 보안

- [ ] 환경 변수 설정 (모든 필수 값 포함)
- [ ] .env.local을 .gitignore에 포함
- [ ] GitHub OAuth 설정 완료
- [ ] CRON_SECRET 생성 및 설정
- [ ] Supabase RLS 정책 활성화

### 4. 성능

- [ ] npm run build 성공
- [ ] npm run analyze로 번들 분석
- [ ] Lighthouse 점수 85점 이상
- [ ] 이미지 최적화 완료

### 5. 기능 테스트

- [ ] 메인 페이지 로딩
- [ ] 게시글 검색 & 필터링
- [ ] GitHub 로그인
- [ ] 즐겨찾기 추가/삭제
- [ ] 다크모드 전환

---

## 🚀 배포 단계

### 단계 1: Supabase 설정

```bash
# 1. Supabase 프로젝트 생성
# https://supabase.com에 로그인 → New Project

# 2. API 키 복사
# Settings > API > Project URL, Anon Key, Service Role Key

# 3. 데이터베이스 마이그레이션 실행
# Supabase Dashboard > SQL Editor > 마이그레이션 파일 실행

# 4. RLS 정책 활성화
# Supabase Dashboard > Authentication > Policies

# 5. 환경 변수 설정
# .env.local에 복사
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
```

### 단계 2: GitHub OAuth 설정

```bash
# 1. GitHub 설정 열기
# https://github.com/settings/developers/

# 2. OAuth App 생성
# New OAuth App 클릭

# 3. 기본 정보 입력
- Application name: devBlog.kr
- Homepage URL: https://devblog.kr
- Authorization callback URL: https://devblog.kr/auth/callback

# 4. 클라이언트 ID, 시크릿 복사

# 5. Supabase에 OAuth 설정
# Supabase Dashboard > Authentication > Providers > GitHub
# - Client ID 입력
# - Client Secret 입력
```

### 단계 3: 로컬 검증

```bash
# 1. 환경 변수 설정
cp .env.example .env.local
# .env.local 파일 수정 (모든 값 입력)

# 2. 빌드 테스트
npm run build

# 3. 번들 분석
npm run analyze

# 4. 성능 테스트
npm run start
# Chrome DevTools > Lighthouse 실행

# 5. 기능 테스트
# 로컬에서 모든 기능 테스트
```

### 단계 4: Vercel 배포

```bash
# 1. Vercel 계정 생성
# https://vercel.com/signup

# 2. GitHub 연결
# Vercel > Import Project > GitHub 연결

# 3. 저장소 선택
# dev-blog 저장소 선택

# 4. 환경 변수 설정
# Vercel > Settings > Environment Variables
NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
NEXT_PUBLIC_GITHUB_CLIENT_ID=xxx
CRON_SECRET=xxx
NEXT_PUBLIC_SITE_URL=https://devblog.kr

# 5. 배포
# Vercel에서 자동 배포 시작
```

### 단계 5: 도메인 설정

```bash
# 1. 도메인 구매
# 가비아, 호스팅KR 등에서 devblog.kr 구매

# 2. 도메인 연결
# Vercel > Settings > Domains > Add Domain
# devblog.kr 입력

# 3. DNS 레코드 설정
# 도메인 제공사의 DNS 설정에서
# Vercel이 제시한 CNAME/A 레코드 추가
```

### 단계 6: Cron Job 설정

```bash
# vercel.json은 이미 설정됨 (0 */3 * * *)

# 다음 사항 확인:
# 1. Vercel Cron 페이지에서 작업 확인
# 2. 실행 로그 확인
# 3. 에러 시 Sentry에서 추적

# 수동 테스트:
curl -X GET https://devblog.kr/api/cron/fetch-blogs \
  -H "Authorization: Bearer $CRON_SECRET"
```

---

## 🔍 배포 후 점검

### 1. SEO 검증

```bash
# Google Search Console
https://search.google.com/search-console

# 1. 사이트 추가
# 2. sitemap.xml 제출 (https://devblog.kr/sitemap.xml)
# 3. robots.txt 확인 (https://devblog.kr/robots.txt)

# Bing 웹마스터 도구
https://www.bing.com/webmasters/

# 1. 사이트 추가
# 2. sitemap.xml 제출
```

### 2. 성능 모니터링

```bash
# PageSpeed Insights
https://pagespeed.web.dev/?url=https://devblog.kr

# 목표: 85점 이상 (모든 카테고리)
# 개선 필요 항목 확인 및 수정
```

### 3. 기능 테스트

```bash
# 프로덕션 환경에서 테스트
# 1. 메인 페이지 로딩
# 2. 게시글 검색 & 필터링
# 3. GitHub 로그인
# 4. 즐겨찾기 추가/삭제
# 5. 다크모드 전환
# 6. RSS 피드 수집 (3시간 대기)
```

### 4. 분석 도구 설정

```bash
# Google Analytics
https://analytics.google.com/

# 1. 속성 생성 (데이터 스트림 생성)
# 2. 추적 ID 복사
# 3. .env.local에 추가
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Vercel Analytics
# 자동으로 활성화됨 (Vercel 대시보드 > Analytics)
```

### 5. 모니터링 & 알림

```bash
# Sentry (선택 사항)
https://sentry.io/

# 1. 계정 생성
# 2. Next.js 프로젝트 생성
# 3. DSN 복사
# 4. .env.local에 추가
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

---

## 📊 배포 후 모니터링 대시보드

### Vercel 대시보드
- 배포 상태 확인
- Analytics 확인
- 환경 변수 관리

### Supabase 대시보드
- 데이터베이스 상태
- API 호출 로그
- 인증 로그

### Google Search Console
- 색인 상태
- 검색 성능
- 사이트맵 상태

### Google Analytics
- 사용자 행동
- 트래픽 소스
- 전환 추적

---

## 🔧 배포 후 주의사항

### 1. 환경 변수 보안

```bash
# ❌ 절대 하면 안 됨
SUPABASE_SERVICE_ROLE_KEY을 클라이언트 코드에 하드코딩

# ✅ 올바른 방법
.env.local에 저장 후 Vercel Environment Variables에 추가
```

### 2. Cron Job 모니터링

```bash
# 매 3시간마다 자동 실행되는 작업 모니터링
# Vercel 대시보드 > Cron Jobs > fetch-blogs 확인

# 실패 시:
# 1. Sentry에서 에러 확인
# 2. Supabase 로그 확인
# 3. API 키 유효성 확인
```

### 3. 데이터베이스 백업

```bash
# Supabase에서 자동 백업 설정
# Settings > Backups > Daily backup 활성화

# 수동 백업:
# Supabase > Database > Backups > Create backup
```

### 4. SSL 인증서

```bash
# Vercel에서 자동 관리됨
# Let's Encrypt로 자동 갱신
# 수동 확인: https://www.ssllabs.com/ssltest/
```

---

## 🚨 트러블슈팅

### 배포 실패

```bash
# 1. 빌드 로그 확인
# Vercel > Deployments > Failed > View Logs

# 2. 환경 변수 확인
# Vercel > Settings > Environment Variables

# 3. 로컬에서 빌드 테스트
npm run build

# 4. 종속성 업데이트
npm install
npm update
```

### Cron Job 실패

```bash
# 1. API 엔드포인트 테스트
curl -X GET https://devblog.kr/api/cron/fetch-blogs \
  -H "Authorization: Bearer $CRON_SECRET"

# 2. Supabase 연결 확인
# Supabase > Database > Connection info

# 3. API 키 유효성 확인
# Supabase > Settings > API
```

### 성능 저하

```bash
# 1. Vercel Analytics 확인
# 느린 페이지 식별

# 2. Lighthouse 재실행
# 개선 항목 확인

# 3. 이미지 최적화 확인
# 모든 이미지가 Next.js Image 컴포넌트 사용 여부 확인

# 4. 번들 크기 재분석
npm run analyze
```

---

## 📞 도움말

### 유용한 링크

- [Vercel 문서](https://vercel.com/docs)
- [Supabase 문서](https://supabase.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Google Search Console](https://search.google.com/search-console)

### 긴급 상황

```bash
# 배포 롤백
# Vercel > Deployments > 이전 버전 선택 > Redeploy

# 데이터베이스 복구
# Supabase > Database > Backups > Restore
```

---

**마지막 업데이트**: 2026년 1월 14일
