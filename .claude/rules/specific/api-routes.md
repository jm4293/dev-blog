---
paths:
  - 'app/api/**/*.ts'
---

# API Routes 규칙

> **이 규칙은 `app/api/` 폴더의 route.ts 파일을 수정할 때 자동으로 적용됩니다.**

---

## 🔒 필수 구현 사항

### 1. Rate Limiting 추가 (필수)

**모든 API 엔드포인트는 Rate Limiting 필수**

```typescript
import { checkRateLimit, createRateLimitResponse, extractIP, RATE_LIMIT_CONFIG } from '@/utils';

export async function GET(request: NextRequest) {
  // Rate Limiting
  const ip = extractIP(request);
  const isAllowed = checkRateLimit(
    ip,
    RATE_LIMIT_CONFIG.PUBLIC, // 또는 RATE_LIMIT_CONFIG.AUTHENTICATED
  );

  if (!isAllowed) {
    return createRateLimitResponse('Too many requests. Rate limit: 100 requests per hour');
  }

  // ... 나머지 로직
}
```

**Rate Limit 타입**:

- `RATE_LIMIT_CONFIG.PUBLIC`: 100 요청/시간 (공개 API)
- `RATE_LIMIT_CONFIG.AUTHENTICATED`: 1,000 요청/시간 (인증 API)

---

### 2. 에러 핸들링 표준화 (필수)

**모든 API는 try-catch로 감싸야 함**

```typescript
import { captureException } from '@/sentry.config';

export async function GET(request: NextRequest) {
  try {
    // ... API 로직

    return NextResponse.json({ data: ... });
  } catch (error) {
    // Sentry에 에러 전송
    captureException(error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
```

---

### 3. Supabase 서버 클라이언트 사용 (필수)

**API Route에서는 반드시 서버 클라이언트 사용**

```typescript
import { createSupabaseServerClient } from '@/supabase/server.supabase';

export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient();

  // ❌ 클라이언트 사용 금지
  // const supabase = createSupabaseClient();

  const { data, error } = await supabase.from('posts').select('*');

  // ...
}
```

---

### 4. 인증 확인 (인증 필요 API만)

**로그인이 필요한 API는 인증 확인 필수**

```typescript
export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient();

  // 인증 확인
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: 'Unauthorized', details: 'Please login to access this resource' },
      { status: 401 },
    );
  }

  // ... 인증된 사용자만 접근 가능한 로직
}
```

---

## 📋 응답 형식 표준화

### 성공 응답

```typescript
// GET (목록)
return NextResponse.json({
  data: [...],
  total: 100,
  page: 1
});

// GET (단일)
return NextResponse.json({
  data: { ... }
});

// POST/PUT
return NextResponse.json({
  message: 'Created successfully',
  data: { ... }
}, { status: 201 });

// DELETE
return NextResponse.json({
  message: 'Deleted successfully'
});
```

### 에러 응답

```typescript
// 400 Bad Request
return NextResponse.json({ error: 'Invalid parameter', details: 'Page must be a positive number' }, { status: 400 });

// 401 Unauthorized
return NextResponse.json({ error: 'Unauthorized', details: 'Please login to access this resource' }, { status: 401 });

// 404 Not Found
return NextResponse.json({ error: 'Not found', details: 'Post not found' }, { status: 404 });

// 429 Rate Limit
return createRateLimitResponse('Too many requests. Rate limit: 100 requests per hour');

// 500 Internal Server Error
return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
```

---

## 🔐 보안 규칙

### 1. 민감한 정보 노출 금지

```typescript
// ❌ 잘못된 예
return NextResponse.json({
  error: 'Database connection failed',
  details: 'Connection string: postgresql://user:password@...', // 노출!
});

// ✅ 올바른 예
return NextResponse.json({
  error: 'Database connection failed',
  details: 'Please contact administrator',
});
```

### 2. CRON_SECRET 인증 (내부 API)

```typescript
export async function POST(request: NextRequest) {
  // CRON_SECRET 인증
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.substring(7);

  if (token !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  // ... 내부 API 로직
}
```

---

## 📝 체크리스트

새 API Route를 만들 때:

- [ ] Rate Limiting 추가
- [ ] try-catch 에러 핸들링
- [ ] Supabase 서버 클라이언트 사용
- [ ] 인증 확인 (필요시)
- [ ] 표준 응답 형식 준수
- [ ] 민감한 정보 노출 체크
- [ ] Sentry captureException 추가

---

## 📚 참고 문서

- [API 명세](../../../docs/api-specification.md)
- [Rate Limiting 설정](../../../utils/rate-limit.ts)
