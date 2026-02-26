# 리팩토링 계획 (Refactoring Plan)

## 📌 1. 리팩토링 목표 (Goals)

- [ ] **Presentational & Container 패턴 적용**: 비즈니스 로직과 순수 UI 렌더링을 완전히 분리
- [ ] **Suspense & ErrorBoundary 적극 활용**: 로딩 및 에러 상태의 선언적 처리
- [ ] **React Query 기반 데이터 통신**: `useSuspenseQuery`와 `useMutation`을 표준 훅으로 사용
- [ ] **프로젝트 전역 일관성 검증**: 특정 도메인(posts)에 국한되지 않고 전체 통일

---

## 📁 2. 폴더 및 아키텍처 규칙 (Architecture Rules)

### Root Directory

프로젝트 루트는 목적별로 명확하게 분리하여 사용합니다.

- `components/`: 전역적으로 쓰이는 공용 UI 컴포넌트
- `features/`: 도메인 단위(예: posts, users)의 핵심 로직 및 하위 컴포넌트
- `hooks/`: 전역 공통 훅
- `lib/`: 외부 라이브러리 설정 (예: React Query Provider)
- `supabase/`: 데이터베이스 관련 설정 및 타입
- `utils/`: 순수 유틸리티 함수
- `app/`: **오직 Next.js 라우팅 및 단순 서버 컴포넌트(Container 호출부) 용도**

### Features Directory (`features/[domain]/`)

각 Feature 내부는 다음 구조를 엄격히 따릅니다.

- `actions/`: Next.js Server Actions (데이터 뮤테이션 등)
- `hooks/`: 해당 Feature 전용 커스텀 훅 (React Query 훅 포함)
- `services/`: API 호출 등 순수 데이터 Fetch 통신 로직
- `types/`: 해당 Feature 전용 타입 정의
- `ui/`: 도메인 종속적인 Presentational 컴포넌트

---

## 🛠 3. 주요 리팩토링 항목 (Action Items)

### 3.1. 컴포넌트 패턴 (Presentational & Container)

- [ ] 모든 복잡한 데이터 패칭과 비즈니스 로직은 **Container** 컴포넌트로 이동
- [ ] **Presentational** 컴포넌트는 Props만을 받아 UI를 렌더링하며, 내부 비즈니스 로직 없게 구성
- [ ] Container와 Presentational의 경계에 `<Suspense>`와 `<ErrorBoundary>`를 배치

### 3.2. 상태 관리 및 데이터 패칭 (State & Fetching)

- [ ] 전역 상태 라이브러리(Zustand 등) 배제 (필요시 React Query + Local State로 커버 가능 여부 점검)
- [ ] `features/[domain]/hooks` 내에서 `useSuspenseQuery`로 서버 데이터를 가져오는 훅 작성
- [ ] 데이터 수정 로직은 `useMutation` 훅으로 감사고 내부에서 Server Actions 콜

### 3.3. Vercel 가이드라인 준수 (Agent Skills)

- [ ] Waterfall 방지 (병렬 패칭)
- [ ] boolean props 확산 방지 및 Compound Component 패턴 적극 활용 (추가 최적화)

---

## 📋 4. 작업 진행 순서 (Work Phases)

1. **`features/posts` PoC (Proof of Concept)**: 패턴 선행 적용 및 테스트
2. **패턴 검증 및 리뷰**: Posts 기능이 정상 작동하는지 확인
3. **전체 프로젝트 롤아웃**: 다른 모든 Feature 및 `app` 디렉토리에 동일 규칙 일괄 적용
