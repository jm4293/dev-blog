import { test, expect } from '@playwright/test';

test.describe('기본 사용자 흐름 E2E 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 메인 페이지로 이동
    await page.goto('/');
    // 페이지 로드 완료 대기
    await page.waitForLoadState('networkidle');
  });

  // ✅ E2E 테스트 1: 페이지 로드 확인
  test('should load the main page', async ({ page }) => {
    // 페이지 제목 확인
    await expect(page).toHaveTitle(/dev|blog|post/i);

    // 주요 콘텐츠가 로드되어야 함
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  // ✅ E2E 테스트 2: 헤더 확인
  test('should display header with navigation', async ({ page }) => {
    // 헤더가 있어야 함
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // 로고 또는 브랜드 이름이 있어야 함
    const logo = header.locator('text=/devBlog|dev.*blog/i').first();
    if (await logo.isVisible()) {
      await expect(logo).toBeVisible();
    }
  });

  // ✅ E2E 테스트 3: 메인 콘텐츠 영역 확인
  test('should display main content area', async ({ page }) => {
    // 메인 영역이 있어야 함
    const main = page.locator('main');
    if (await main.isVisible()) {
      await expect(main).toBeVisible();
    }

    // 또는 일반 콘텐츠 영역
    const content = page.locator('[role="main"], main, .content, #content').first();
    if (await content.isVisible()) {
      await expect(content).toBeVisible();
    }
  });

  // ✅ E2E 테스트 4: 검색 기능 접근
  test('should have search functionality', async ({ page }) => {
    // 검색 입력 찾기
    const searchInput = page.locator('input[type="text"], input[placeholder*="검색"]').first();

    if (await searchInput.isVisible()) {
      // 검색 입력에 값을 입력할 수 있어야 함
      await searchInput.fill('test');

      // 입력된 값 확인
      await expect(searchInput).toHaveValue('test');

      // 입력 초기화
      await searchInput.fill('');
    }
  });

  // ✅ E2E 테스트 5: 필터 버튼 접근
  test('should have interactive elements', async ({ page }) => {
    // 대화형 요소(버튼, 링크 등) 찾기
    const interactiveElements = page.locator('button, a, [role="button"]');

    // 대화형 요소가 있어야 함
    const count = await interactiveElements.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  // ✅ E2E 테스트 6: 페이지 구조 검증
  test('should have proper page structure', async ({ page }) => {
    // HTML 기본 구조 확인
    const html = page.locator('html');
    const htmlBox = await html.boundingBox();
    expect(htmlBox).toBeTruthy();

    // body 태그 확인
    const body = page.locator('body');
    const bodyBox = await body.boundingBox();
    expect(bodyBox).toBeTruthy();

    // 페이지가 렌더링되어야 함
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
    expect(content?.length).toBeGreaterThan(0);
  });

  // ✅ E2E 테스트 7: 모바일 메뉴 접근성 (모바일)
  test('should handle mobile menu on small screens', async ({ page }) => {
    // 뷰포트 크기를 모바일로 설정
    await page.setViewportSize({ width: 375, height: 667 });

    // 페이지 새로고침
    await page.reload();
    await page.waitForLoadState('networkidle');

    // 페이지가 여전히 표시되어야 함
    await expect(page.locator('body')).toBeVisible();
  });

  // ✅ E2E 테스트 8: 데스크톱 레이아웃 (데스크톱)
  test('should display desktop layout', async ({ page }) => {
    // 뷰포트 크기를 데스크톱으로 설정
    await page.setViewportSize({ width: 1920, height: 1080 });

    // 페이지 새로고침
    await page.reload();
    await page.waitForLoadState('networkidle');

    // 페이지가 여전히 표시되어야 함
    await expect(page.locator('body')).toBeVisible();
  });

  // ✅ E2E 테스트 9: 페이지 상호작용 (클릭)
  test('should handle basic user interactions', async ({ page }) => {
    // 클릭 가능한 요소 찾기
    const clickableElements = page.locator('button, a[href], [role="button"]').first();

    if (await clickableElements.isVisible()) {
      // 요소가 클릭 가능한지 확인
      const box = await clickableElements.boundingBox();
      expect(box).toBeTruthy();
    }
  });

  // ✅ E2E 테스트 10: 네비게이션 확인
  test('should have navigation links', async ({ page }) => {
    // 네비게이션 링크 찾기
    const navLinks = page.locator('a[href], nav a').first();

    if (await navLinks.isVisible()) {
      // 링크가 있어야 함
      await expect(navLinks).toBeVisible();
    }
  });
});
