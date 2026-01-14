# Google Analytics 초기 설정 가이드

devBlog.kr의 Google Analytics를 처음 설정하는 방법을 단계별로 설명합니다.

---

## 📋 설정 체크리스트

- [ ] Google 계정 준비
- [ ] Google Analytics 계정 생성
- [ ] 측정 ID(GA ID) 발급받기
- [ ] 환경 변수 설정
- [ ] Vercel에 환경 변수 추가
- [ ] 배포 후 데이터 수집 확인

---

## 🚀 단계별 설정

### 1단계: Google Analytics 계정 생성

**소요 시간: 5분**

```
1. Google Analytics 접속
   https://analytics.google.com/

2. "시작하기" 클릭

3. 계정 설정
   - 계정 이름: devBlog.kr
   - 데이터 공유 설정: 모두 체크 (권장)
   ➜ "다음" 클릭

4. 속성(Property) 설정
   - 속성 이름: devBlog.kr
   - 보고 시간대: Asia/Seoul (한국 서울)
   - 통화: KRW (한국 원)
   ➜ "다음" 클릭

5. 비즈니스 정보 (선택)
   - 산업: 기술
   - 비즈니스 규모: 소규모
   ➜ "만들기" 클릭

6. Google 이용약관 동의
   ➜ 동의 후 진행
```

---

### 2단계: 데이터 스트림 생성

**소요 시간: 3분**

```
1. 데이터 스트림 추가
   Analytics > Admin > 데이터 스트림 > 스트림 만들기

2. 플랫폼 선택
   ➜ "웹" 선택

3. 웹 스트림 설정
   - 웹사이트 URL: https://devblog.kr
   - 스트림 이름: devBlog.kr Web
   ➜ "스트림 만들기" 클릭

4. 측정 ID 확인
   ⭐ 이것이 중요한 정보입니다!
   형식: G-XXXXXXXXXX (10자리)
```

---

### 3단계: 측정 ID 복사

**⭐ 가장 중요한 단계**

```
Google Analytics 화면에서:

Admin (관리) > 데이터 스트림 > devBlog.kr Web 클릭

상세 정보에서:
┌─────────────────────────────────┐
│ 측정 ID: G-XXXXXXXXXX           │  ← 이것을 복사하세요!
│ 스트림 이름: devBlog.kr Web      │
│ 스트림 URL: https://devblog.kr   │
└─────────────────────────────────┘
```

---

### 4단계: 로컬 환경 변수 설정

**소요 시간: 1분**

```bash
# 1. .env.local 파일 열기
#    프로젝트 루트의 .env.local 파일을 텍스트 에디터로 열기

# 2. 측정 ID 추가
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# 예시:
# NEXT_PUBLIC_GA_ID=G-ABC1234567

# 3. 파일 저장
```

---

### 5단계: Vercel에 환경 변수 추가

**소요 시간: 3분** (배포 전에)

```
1. Vercel 대시보드 접속
   https://vercel.com/dashboard

2. 프로젝트 선택 (dev-blog)

3. Settings (설정) 클릭

4. Environment Variables 클릭

5. "Add New" 클릭

6. 환경 변수 추가
   ┌──────────────────────────────┐
   │ Name: NEXT_PUBLIC_GA_ID      │
   │ Value: G-XXXXXXXXXX          │ ← 측정 ID 입력
   │ Environments: Production     │ ← 선택
   └──────────────────────────────┘

7. "Save" 클릭

8. 확인
   환경 변수 목록에 표시되는지 확인
```

---

## 🧪 설정 확인 (배포 후)

### 방법 1: Google Analytics에서 확인

```
1. Google Analytics 접속
   https://analytics.google.com/

2. 실시간 보고서 확인
   Admin > Reports > Real-time

   또는 메인 대시보드의 "실시간 사용자" 확인

3. 현재 활동 중인 사용자가 보이는지 확인
   - devblog.kr 사이트 방문
   - Google Analytics 실시간 창 새로고침
   - 사용자 수가 증가하는지 확인
```

### 방법 2: 브라우저 개발자 도구에서 확인

```
1. devblog.kr 접속

2. F12 키 (개발자 도구 열기)

3. Network 탭 클릭

4. 검색창에 "gtag" 입력

5. gtag 요청이 보이는지 확인
   - gtag.js 파일
   - www.googletagmanager.com

   ✅ 보이면 정상!
   ❌ 안 보이면 환경 변수 확인
```

### 방법 3: Console에서 확인

```
1. F12 > Console 탭

2. 다음 코드 입력:
   console.log(window.NEXT_PUBLIC_GA_ID)

   또는

   console.log(window.gtag)

3. 결과 확인
   ✅ 함수가 보이면 정상!
   ❌ undefined이면 환경 변수 재확인
```

---

## 📊 배포 후 모니터링

### 첫 24시간 체크리스트

```
[ ] Google Analytics 계정에 데이터 수신 확인
    - 실시간 보고서에서 사용자 수 확인
    - 페이지뷰 기록 확인

[ ] 이벤트 추적 확인
    - 검색 이벤트 (search)
    - 필터 이벤트 (filter)
    - 클릭 이벤트 (click_post)

[ ] 데이터 정확성 확인
    - 접속 국가: 주로 한국 (KR)
    - 접속 기기: 모바일, 데스크탑 혼합
    - 접속 시간: 업무 시간 집중

[ ] 에러 확인
    - Google Analytics 오류 없음
    - 측정 ID 유효
```

### 1주일 후 확인

```
[ ] 일일 사용자 수 추이
    - 증가/감소 추세
    - 주중/주말 비교

[ ] 인기 페이지
    - 메인 페이지 (/)
    - 즐겨찾기 (/bookmarks)
    - 블로그 (/blogs)

[ ] 주요 이벤트
    - 가장 많이 사용되는 필터
    - 가장 많이 검색되는 키워드
    - 가장 클릭 많은 게시글
```

---

## 🆘 문제 해결

### 데이터가 안 보이는 경우

**확인 순서:**

```
1. 측정 ID 확인
   ✓ NEXT_PUBLIC_GA_ID 값이 정확한가?
   ✓ G-로 시작하는가?
   ✓ 10자리 영숫자인가?

2. 환경 변수 확인 (로컬)
   .env.local 파일 확인:
   cat .env.local | grep GA_ID

3. 환경 변수 확인 (Vercel)
   Vercel > Settings > Environment Variables
   NEXT_PUBLIC_GA_ID 있는가?

4. 배포 상태 확인
   Vercel > Deployments
   최신 배포가 성공했는가?

5. 캐시 삭제
   브라우저: Ctrl+Shift+Delete (전체 캐시 삭제)
   Vercel: Revalidate 버튼 클릭

6. 시간 경과
   데이터 수집에 최대 24시간 소요될 수 있음
```

### 스크립트 로드 안 되는 경우

```
1. CSP(Content Security Policy) 확인
   ✓ googletagmanager.com이 화이트리스트에 있는가?

2. 스크립트 차단 확인
   ✓ 브라우저 확장 프로그램에서 차단하지 않는가?
   (예: uBlock Origin, Privacy Badger)

3. 개발자 도구에서 에러 확인
   F12 > Console에 빨간 에러 없는가?

4. Google Tag Manager 태그 발행
   https://tagmanager.google.com/
   최신 버전 발행했는가?
```

---

## 📞 필요한 정보

배포할 때 다음 정보가 필요합니다:

```
1. 측정 ID (필수)
   형식: G-XXXXXXXXXX
   출처: Google Analytics > Admin > 데이터 스트림

2. 사이트 URL (참고)
   https://devblog.kr

3. 환경 변수 이름 (참고)
   NEXT_PUBLIC_GA_ID
```

---

## ✅ 완료 후 확인

```
모든 단계를 완료한 후:

✅ .env.local에 NEXT_PUBLIC_GA_ID 설정
✅ Vercel 환경 변수 추가
✅ 배포 완료
✅ Google Analytics에서 데이터 수신 확인
✅ 실시간 보고서에서 사용자 보임
✅ 네트워크 탭에서 gtag.js 로드 확인
```

---

## 🎓 다음 단계

```
GA 설정 완료 후:

1. ANALYTICS.md 참고
   - 주요 리포트 확인 방법
   - KPI 추적 방법
   - 고급 설정

2. 배포 후 모니터링
   - 일일 사용자 수 확인
   - 주요 페이지 성과 분석
   - 개선 필요 부분 식별

3. 데이터 기반 최적화
   - 사용자 행동 분석
   - 인기 콘텐츠 강화
   - 문제 영역 개선
```

---

**마지막 업데이트**: 2026년 1월 14일
