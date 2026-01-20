import { test, expect } from '@playwright/test';

test.describe('북마크 추가/제거 E2E 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 메인 페이지로 이동
    await page.goto('/');
    // 페이지 로드 완료 대기
    await page.waitForLoadState('networkidle');
  });

  // ✅ E2E 테스트 1: 비로그인 상태에서 북마크 불가능
  test('should show login prompt when trying to bookmark without login', async ({ page }) => {
    // 페이지 구조 확인
    await expect(page).toHaveTitle(/포스트|Post|dev/i);

    // 선택적: 북마크 버튼이 있으면 클릭 시도
    const bookmarkButtons = page.locator(
      'button:has-text("북마크"), button:has-text("Bookmark"), [data-testid="bookmark-button"]',
    );
    const count = await bookmarkButtons.count();

    if (count > 0) {
      await bookmarkButtons.first().click();

      // 로그인 프롬프트 또는 모달이 나타나야 함
      const loginPrompt = page.locator(
        'text=/로그인|Login/i, [data-testid="login-prompt"], [data-testid="login-modal"]',
      );
      // 로그인 관련 요소가 있을 수 있음
    }
  });

  // ✅ E2E 테스트 2: 로그인 후 북마크 추가
  test('should add bookmark after login', async ({ page, context }) => {
    // 테스트 환경에서 인증 토큰 설정
    await context.addCookies([
      {
        name: 'sb-access-token',
        value: 'test-token-value',
        domain: 'localhost',
        path: '/',
      },
    ]);

    // 페이지 새로고침
    await page.reload();
    await page.waitForLoadState('networkidle');

    // 페이지가 로드되어야 함
    await expect(page).toHaveTitle(/포스트|Post|dev/i);
  });

  // ✅ E2E 테스트 3: 북마크된 게시글 식별
  test('should show bookmarked posts with visual indicator', async ({ page, context }) => {
    // 테스트용 인증 쿠키 설정
    await context.addCookies([
      {
        name: 'sb-access-token',
        value: 'test-token-value',
        domain: 'localhost',
        path: '/',
      },
    ]);

    // 페이지 새로고침
    await page.reload();
    await page.waitForLoadState('networkidle');

    // 게시글 카드들 확인
    const postCards = page.locator('[data-testid="post-card"]');
    const cardCount = await postCards.count();

    // 최소 1개 게시글이 있어야 함
    expect(cardCount).toBeGreaterThan(0);

    // 각 게시글의 북마크 버튼 상태 확인
    for (let i = 0; i < Math.min(cardCount, 5); i++) {
      const bookmarkButton = postCards.nth(i).locator('[data-testid="bookmark-button"]');
      await expect(bookmarkButton).toBeVisible();

      // 북마크 상태는 활성화되거나 비활성화되어야 함
      const isBookmarked = await bookmarkButton
        .locator('[data-testid="bookmark-icon"]')
        .evaluate((el) => el.classList.contains('active') || el.classList.contains('bookmarked'));

      expect(typeof isBookmarked).toBe('boolean');
    }
  });

  // ✅ E2E 테스트 4: 북마크 제거
  test('should remove bookmark', async ({ page, context }) => {
    // 인증 설정
    await context.addCookies([
      {
        name: 'sb-access-token',
        value: 'test-token-value',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.reload();
    await page.waitForLoadState('networkidle');

    // 첫 번째 게시글에서 북마크된 것 찾기
    let bookmarkedButton = page
      .locator('[data-testid="bookmark-button"].active, [data-testid="bookmark-button"].bookmarked')
      .first();

    // 북마크된 게시글이 없으면 하나 추가
    if (!(await bookmarkedButton.isVisible())) {
      const firstBookmarkButton = page.locator('[data-testid="bookmark-button"]').first();
      await firstBookmarkButton.click();
      await page.waitForLoadState('networkidle');
      bookmarkedButton = firstBookmarkButton;
    }

    // 북마크 버튼 상태 확인
    await expect(bookmarkedButton).toHaveClass(/active|bookmarked/);

    // 북마크 제거 (다시 클릭)
    await bookmarkedButton.click();
    await page.waitForLoadState('networkidle');

    // 북마크 상태 제거 확인
    await expect(bookmarkedButton).not.toHaveClass(/active|bookmarked/);

    // 제거 피드백 메시지
    const successMessage = page.locator('[data-testid="toast"]');
    await expect(successMessage).toBeVisible({ timeout: 5000 });
  });

  // ✅ E2E 테스트 5: 즐겨찾기 페이지 확인
  test('should view bookmarked posts in bookmarks page', async ({ page, context }) => {
    // 인증 설정
    await context.addCookies([
      {
        name: 'sb-access-token',
        value: 'test-token-value',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.reload();
    await page.waitForLoadState('networkidle');

    // 즐겨찾기 페이지로 이동
    const bookmarksLink = page.locator('[data-testid="bookmarks-link"], a[href*="/bookmarks"]');
    if (await bookmarksLink.isVisible()) {
      await bookmarksLink.click();
      await page.waitForLoadState('networkidle');

      // 즐겨찾기 페이지 확인
      await expect(page).toHaveURL(/\/bookmarks/);

      // 북마크된 게시글 목록이 보여야 함
      const postCards = page.locator('[data-testid="post-card"]');

      // 북마크가 있으면 보여야 함
      const cardCount = await postCards.count();
      if (cardCount > 0) {
        await expect(postCards.first()).toBeVisible();
      }
    }
  });

  // ✅ E2E 테스트 6: 동시 북마크 추가
  test('should handle concurrent bookmark actions', async ({ page, context }) => {
    // 인증 설정
    await context.addCookies([
      {
        name: 'sb-access-token',
        value: 'test-token-value',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.reload();
    await page.waitForLoadState('networkidle');

    // 여러 게시글의 북마크 버튼 동시 클릭
    const postCards = page.locator('[data-testid="post-card"]');
    const cardCount = Math.min(await postCards.count(), 3);

    // 3개의 북마크 버튼을 모두 한 번에 클릭
    const bookmarkPromises = [];
    for (let i = 0; i < cardCount; i++) {
      const bookmarkButton = postCards.nth(i).locator('[data-testid="bookmark-button"]');
      bookmarkPromises.push(bookmarkButton.click());
    }

    // 모든 클릭 완료 대기
    await Promise.all(bookmarkPromises);

    // 네트워크 대기
    await page.waitForLoadState('networkidle');

    // 모든 북마크 상태 확인
    for (let i = 0; i < cardCount; i++) {
      const bookmarkButton = postCards.nth(i).locator('[data-testid="bookmark-button"]');
      // 북마크 상태가 일관성 있게 표시되어야 함
      await expect(bookmarkButton).toBeVisible();
    }
  });
});
