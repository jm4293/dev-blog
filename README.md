# devBlog.kr

> 한국 개발 기업들의 기술 블로그를 한 곳에서 모아보는 플랫폼

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018.0.0-brightgreen.svg)]()
[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
![Status](https://img.shields.io/badge/status-active%20development-yellow.svg)

---

## 📋 목차

- [개요](#개요)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [라이선스](#라이선스)

---

## 개요

**devBlog.kr**은 한국 IT 기업들의 기술 블로그를 자동으로 수집하고, AI 기반 태그 분류를 통해 개발자들이 원하는 정보를 쉽게 찾을 수 있는 플랫폼입니다.

- **자동 수집**: Cron Job을 통한 블로그 자동 수집 (3시간마다)
- **AI 처리**: OpenAI GPT-4o-mini를 활용한 자동 요약 및 태그 생성
- **빠른 검색**: 전체 텍스트 검색 및 다중 태그 필터링
- **반응형 디자인**: 모바일부터 데스크탑까지 완벽한 UI/UX
- **라이트/다크 모드**: 사용자 선호도에 따른 테마 지원

---

## 기술 스택

### Frontend

```
Next.js 14+              - React 기반 풀스택 프레임워크
TypeScript 5.0+          - 타입 안정성
Tailwind CSS             - 유틸리티 CSS 프레임워크
shadcn/ui               - 고급 UI 컴포넌트
React Context API       - 상태 관리
```

### Backend & Infrastructure

```
Supabase (PostgreSQL)   - 데이터베이스 & 인증
Vercel                  - 배포 & Cron Job
OpenAI GPT-4o-mini     - AI 처리 (요약, 태그)
```

### Libraries

```
rss-parser              - RSS 피드 파싱
cheerio                 - HTML 파싱
@supabase/supabase-js  - Supabase 클라이언트
date-fns                - 날짜 포맷팅
```

### Development Tools

```
TypeScript              - 타입 체킹
ESLint                  - 코드 품질
Prettier                - 코드 포맷팅
Next.js Dev Server     - 개발 서버
```

---

## 라이선스

이 프로젝트는 [MIT License](LICENSE)로 공개됩니다.

---

<div align="center">

**[⬆ 목차로 가기](#-목차)**

Made with ❤️ by [jm4293](https://github.com/jm4293)

</div>
