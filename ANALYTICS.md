# Google Analytics 설정 가이드

이 문서는 devBlog.kr의 Google Analytics 및 Google Tag Manager(GTM) 설정 방법을 설명합니다.

---

## 📊 설정 단계

### 1단계: Google Analytics 생성

```bash
1. Google Analytics 접속
   https://analytics.google.com/

2. 계정 생성 (또는 기존 계정 사용)
   - 계정명: devBlog.kr
   - 데이터 공유 설정: 기본값

3. 속성 생성 (Property)
   - 속성명: devBlog.kr
   - 시간대: Asia/Seoul
   - 통화: KRW (한국 원화)

4. 데이터 스트림 생성
   - 플랫폼: 웹
   - 웹사이트 URL: https://devblog.kr
   - 스트림명: devBlog.kr Web

5. 측정 ID 복사
   - 형식: G-XXXXXXXXXX
```

### 2단계: Google Tag Manager 생성

```bash
1. Google Tag Manager 접속
   https://tagmanager.google.com/

2. 계정 생성
   - 계정명: devBlog.kr
   - 컨테이너명: devBlog.kr Web
   - 컨테이너 대상: 웹

3. 컨테이너 ID 복사
   - 형식: GTM-XXXXXXX
```

### 3단계: 환경 변수 설정

```bash
# .env.local (개발) 또는 Vercel 환경 변수 (배포)

# Google Analytics 측정 ID
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 4단계: Vercel 배포 후 설정

```bash
# Vercel > Settings > Environment Variables에서:
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 🎯 추적 이벤트

### 자동 추적 (기본)
- 페이지 뷰 (pageview)
- 스크롤 뎁스 (scroll)

### 커스텀 이벤트 (구현됨)

```typescript
import { events } from '@/lib/gtag';

// 1. 검색 추적
events.search('react');

// 2. 태그 필터 추적
events.filterByTag('Frontend');

// 3. 회사 필터 추적
events.filterByCompany('toss');

// 4. 페이지네이션 추적
events.paginate(2);

// 5. 게시글 클릭 추적
events.clickPost('post-id', 'toss');

// 6. 즐겨찾기 추적
events.addBookmark('post-id');
events.removeBookmark('post-id');

// 7. 로그인/로그아웃 추적
events.login();
events.logout();

// 8. 테마 변경 추적
events.toggleTheme('dark');

// 9. 외부 링크 클릭 추적
events.externalClick('https://example.com');
```

---

## 📈 Google Analytics 대시보드

### 주요 리포트

#### 1. 실시간 (Real-time)
```
경로: Analytics > Reports > Real-time

확인 사항:
- 현재 활동 중인 사용자 수
- 현재 페이지 뷰
- 이벤트 발생 현황
```

#### 2. 사용자 개요 (User Overview)
```
경로: Analytics > Reports > Life cycle > Acquisition > User acquisition

확인 사항:
- 총 사용자 수
- 신규 사용자 수
- 활성 사용자 수
- 재방문 사용자
```

#### 3. 페이지 및 화면 (Pages and screens)
```
경로: Analytics > Reports > Life cycle > Engagement > Pages and screens

확인 사항:
- 가장 인기 있는 페이지
- 페이지 뷰 수
- 평균 체류 시간
- 이탈률
```

#### 4. 이벤트 (Events)
```
경로: Analytics > Reports > Life cycle > Engagement > Events

확인 사항:
- 사용자가 수행한 모든 이벤트
- 이벤트별 빈도
- 이벤트별 사용자 수

주요 이벤트:
- search: 검색 수행
- filter: 필터링 사용
- click_post: 게시글 클릭
- add_bookmark: 즐겨찾기 추가
```

#### 5. 전환 (Conversions)
```
경로: Analytics > Reports > Life cycle > Monetization > Conversions

확인 사항:
- 주요 사용자 행동 추적
- 전환 깔때기 분석
```

---

## 🔧 고급 설정

### 1. Google Search Console 연결

```bash
1. Google Search Console 접속
   https://search.google.com/search-console

2. Analytics 속성 연결
   Settings > Google Analytics property > 속성 선택

3. 검색 성능 데이터 확인
   Performance > Queries, Pages, Countries 등
```

### 2. Google Analytics와 Google Ads 연결

```bash
1. Google Analytics 접속

2. Admin > Property Settings > Google Ads linking

3. Ads 계정 선택 및 연결

4. 전환 추적 설정 (옵션)
```

### 3. 커스텀 보고서 생성

```bash
1. Analytics > Explore > Create custom report

2. 측정기준 및 측정값 선택
   예: 페이지 경로 + 클릭 수

3. 필터 및 차트 설정

4. 저장
```

---

## 📊 주요 성과 지표 (KPI)

### 트래픽 지표

| 지표 | 설명 | 목표 |
|------|------|------|
| **사용자** | 고유 사용자 수 | 월 5,000명 |
| **세션** | 사용자가 방문한 횟수 | 월 10,000회 |
| **페이지뷰** | 페이지를 본 횟수 | 월 50,000회 |
| **평균 세션 시간** | 평균 방문 시간 | 2분 이상 |

### 참여도 지표

| 지표 | 설명 | 목표 |
|------|------|------|
| **이탈률** | 한 페이지만 보고 나가는 비율 | 50% 이하 |
| **평균 페이지 수** | 평균 방문 시 본 페이지 수 | 3개 이상 |
| **재방문 사용자** | 다시 방문한 사용자 비율 | 30% 이상 |

### 목표 달성 지표

| 지표 | 설명 | 측정 방법 |
|------|------|----------|
| **클릭 수** | 게시글 클릭 수 | events.clickPost() |
| **즐겨찾기** | 즐겨찾기 추가 수 | events.addBookmark() |
| **검색 사용** | 검색 기능 사용 수 | events.search() |

---

## 🚀 배포 후 모니터링 체크리스트

```bash
배포 직후 (1-24시간)
- [ ] Google Tag Manager 컨테이너 발행
- [ ] Analytics에서 실시간 데이터 확인
- [ ] 모든 페이지 로드 확인
- [ ] 이벤트 추적 확인

1주일 후
- [ ] 사용자 수 확인
- [ ] 주요 페이지 트래픽 분석
- [ ] 이탈률 확인
- [ ] 인기 있는 필터/검색어 분석

1개월 후
- [ ] 월간 트래픽 통계 정리
- [ ] 사용자 행동 분석
- [ ] 개선 필요 부분 식별
- [ ] 다음 달 최적화 계획 수립
```

---

## 📱 모바일 앱 분석 (향후)

```bash
Firebase Analytics 연동 시:

1. Firebase Console 접속
2. Google Analytics 속성 연결
3. Mobile SDK 통합
4. 모바일 사용자 행동 추적
```

---

## 🔐 개인정보 보호

### GDPR & 개인정보보호법 준수

```bash
필수 설정:
- [ ] 쿠키 동의 배너 추가 (Vercel Analytics)
- [ ] Google Analytics 데이터 보관 기간 설정 (14개월)
- [ ] IP 익명화 활성화 (기본값)
- [ ] 개인정보처리방침 업데이트
```

### .env.local에서 민감한 정보 보호

```bash
# ✅ 올바른 방법
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX  # 공개해도 안전

# ❌ 절대 하면 안 됨
ANALYTICS_SECRET_KEY=xxxxx  # .env에만 저장
```

---

## 🆘 트러블슈팅

### 데이터가 나타나지 않는 경우

```bash
1. 환경 변수 확인
   echo $NEXT_PUBLIC_GA_ID

2. 개발자 도구에서 확인
   F12 > Network > gtag 검색

3. Google Tag Manager 확인
   Preview mode 활성화 후 테스트

4. 캐시 삭제 및 재로드
   Ctrl+Shift+Delete (Hard refresh)
```

### GTM 이벤트가 추적되지 않는 경우

```bash
1. GTM Preview mode에서 확인
2. 이벤트 이름 확인 (대소문자 구분)
3. 데이터 레이어 확인 (F12 > Console)
4. GTM 태그 발행 상태 확인
```

---

## 📚 참고 자료

- [Google Analytics 문서](https://support.google.com/analytics)
- [Google Tag Manager 문서](https://support.google.com/tagmanager)
- [Next.js Analytics](https://vercel.com/analytics)
- [GA4 이벤트 가이드](https://developers.google.com/analytics/devguides/collection/ga4/events)

---

**마지막 업데이트**: 2026년 1월 14일
