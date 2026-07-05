# devBlog.kr

IT 기업 기술 블로그를 한 곳에서 모아 보는 서비스입니다.

**사이트**: [devblog.kr](https://devblog.kr)

## 소개

토스, 카카오, 네이버, 우아한형제들 등 국내 주요 기업의 기술 블로그 글을 6시간마다 자동으로 수집합니다.
회사 블로그를 일일이 돌아다닐 필요 없이 최신 글을 검색하고, 태그와 회사별로 필터링해서 볼 수 있습니다.
무료이며 광고가 없습니다.

## 주요 기능

- **자동 수집**: RSS 기반으로 6시간마다 새 글 수집 (하루 4회)
- **검색·필터**: 제목 검색, 태그(React, Backend, DevOps 등)·회사별 필터
- **랜딩 페이지**: 태그별(`/tags`)·회사별(`/companies`) 글 모아보기
- **주간 인기글**: 한 주 동안 인기 있었던 글 TOP 10 (`/digest`)
- **즐겨찾기**: GitHub 로그인 후 마음에 드는 글 저장
- **Push 알림**: 새 글 알림, 관심 태그·회사만 골라 받기 가능
- **다크모드·반응형**: 모바일부터 PC까지 지원

글 본문은 저장하지 않으며, 카드를 클릭하면 원본 블로그로 이동합니다 (저작권 보호).

새 블로그 추가는 [devblog.kr/request](https://devblog.kr/request)에서 요청할 수 있습니다.

## 기술 스택

| 분류      | 기술                                           |
| --------- | ---------------------------------------------- |
| Frontend  | Next.js (App Router), TypeScript, Tailwind CSS |
| 상태 관리 | TanStack Query, Jotai                          |
| Backend   | Supabase (PostgreSQL, GitHub OAuth)            |
| 수집      | GitHub Actions + RSS 파싱, OpenAI 태그 분류    |
| 배포      | Vercel                                         |

## 동작 방식

GitHub Actions가 6시간마다 각 기업의 RSS 피드를 확인해 새 글의 제목·URL·요약만 저장합니다.
저장 시 사전 정의된 태그 목록에서 적합한 태그를 자동 선택하고, ISR 캐시를 갱신한 뒤
알림을 구독한 사용자에게 Web Push를 발송합니다.

## 문의

- 버그 제보·기능 제안: [GitHub Issues](https://github.com/jm4293/dev-blog/issues)
- 블로그 추가 요청: [devblog.kr/request](https://devblog.kr/request)
