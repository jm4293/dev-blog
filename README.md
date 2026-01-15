# devBlog.kr

> 한국 IT 기업들의 기술 블로그를 한 곳에서 모아볼 수 있는 플랫폼

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018.0.0-brightgreen.svg)]()
[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0+-38B2AC.svg)](https://tailwindcss.com/)

---

## ✨ 주요 기능

- **🔄 자동 수집**: Vercel Cron Job으로 매일 00:00 KST에 RSS 피드 자동 수집
- **🏷️ 자동 태그**: 키워드 기반 태그 자동 선택 (Frontend, Backend, DevOps, Database 등)
- **🔍 검색 & 필터**: 제목 검색 + 다중 태그/회사 필터링 (OR 조건)
- **👤 GitHub 로그인**: GitHub OAuth로 안전하게 로그인 및 즐겨찾기 관리
- **🌓 테마 지원**: 라이트/다크 모드 (시스템 설정 자동 감지)
- **📱 반응형**: 모바일부터 데스크탑까지 완벽 최적화

---

## 🛠 기술 스택

| 분류          | 기술                                           |
| ------------- | ---------------------------------------------- |
| **Frontend**  | Next.js 14, React 18, TypeScript, Tailwind CSS |
| **상태 관리** | Jotai, TanStack Query, React Hook Form         |
| **Backend**   | Supabase (PostgreSQL, GitHub OAuth)            |
| **배포**      | Vercel (with Cron Jobs)                        |
| **개발 도구** | ESLint, Prettier, Husky, TypeScript            |

---

## 📖 프로젝트 구조

```
dev-blog/
├── app/              # Next.js App Router
├── components/       # React 컴포넌트
├── features/         # 기능별 비즈니스 로직
├── atoms/            # Jotai 전역 상태
├── supabase/         # Supabase 클라이언트
├── utils/            # 유틸리티 함수
├── hooks/            # React 훅
├── lib/              # 라이브러리
└── public/           # 정적 파일
```
