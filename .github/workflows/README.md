# GitHub Actions Workflows

## fetch-posts.yml

블로그 게시글 자동 수집 워크플로우입니다.

### 실행 시간

- **자동 실행**: 매일 한국시간 15:00, 21:00 (UTC 06:00, 12:00)
- **수동 실행**: GitHub Actions 탭에서 "Run workflow" 버튼 클릭

### 동작 방식

1. 활성화된 기업 블로그 목록 조회 (Supabase)
2. 각 기업의 RSS 피드 파싱
3. 새로운 게시글 감지 (중복 체크)
4. 키워드 기반 태그 자동 선택 (사전정의 태그 매칭)
5. Supabase에 게시글 저장

### 환경 변수 설정 (GitHub Secrets)

GitHub Repository Settings > Secrets and variables > Actions에서 다음 secrets를 추가해야 합니다:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase Service Role Key
- `OPENAI_API_KEY`: OpenAI API Key

### 로컬에서 테스트

```bash
# 환경 변수 설정 (.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-key

# 스크립트 실행
npm run fetch-posts
```

### 로그 확인

- **성공**: GitHub Actions 탭에서 워크플로우 실행 로그 확인
- **실패**: Artifacts에서 에러 로그 다운로드 가능 (7일 보관)

### 문제 해결

**Q: 워크플로우가 실행되지 않아요**

- GitHub Actions가 활성화되어 있는지 확인
- Secrets가 올바르게 설정되어 있는지 확인

**Q: 스크립트가 실패해요**

- Actions 탭에서 상세 로그 확인
- 환경 변수가 올바른지 확인
- Supabase 연결 상태 확인

**Q: 중복된 게시글이 생성돼요**

- URL 기반 중복 체크가 동작하는지 확인
- DB에서 `posts.url` 컬럼에 UNIQUE 제약 조건이 있는지 확인
