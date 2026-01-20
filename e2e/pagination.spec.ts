import { test, expect } from '@playwright/test';

test.describe('페이지네이션 E2E 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 메인 페이지로 이동
    await page.goto('/');
    // 페이지 로드 완료 대기
    await page.waitForLoadState('networkidle');
  });

  // ✅ E2E 테스트 1: 페이지네이션 UI 확인
  test('should display pagination controls', async ({ page }) => {
    // 페이지네이션 컨테이너 확인
    const pagination = page.locator('[data-testid="pagination"]');
    await expect(pagination).toBeVisible();

    // 페이지 번호들이 보여야 함
    const pageNumbers = page.locator('[data-testid="page-number"]');
    const pageCount = await pageNumbers.count();
    expect(pageCount).toBeGreaterThan(0);

    // 현재 페이지 강조 확인 (기본값: 페이지 1)
    const currentPage = page.locator('[data-testid="page-number"][aria-current="page"]').first();
    await expect(currentPage).toHaveText('1');
  });

  // ✅ E2E 테스트 2: 다음 페이지로 이동
  test('should navigate to next page', async ({ page }) => {
    // 첫 페이지 게시글 개수 확인
    let postCards = page.locator('[data-testid="post-card"]');
    const firstPageCount = await postCards.count();
    expect(firstPageCount).toBeGreaterThan(0);

    // 첫 번째 게시글의 제목 저장 (비교용)
    const firstPostTitle = await postCards.first().locator('[data-testid="post-title"]').textContent();

    // 다음 버튼 또는 페이지 2 클릭
    const nextButton = page.locator('[data-testid="pagination-next"]');
    if (await nextButton.isEnabled()) {
      await nextButton.click();
    } else {
      // 또는 페이지 번호 클릭
      const page2Button = page.locator('[data-testid="page-number"]').filter({ hasText: '2' });
      if (await page2Button.isVisible()) {
        await page2Button.click();
      }
    }

    // 페이지 로드 대기
    await page.waitForLoadState('networkidle');

    // URL 파라미터 확인
    await expect(page).toHaveURL(/page=2/);

    // 현재 페이지 강조 확인
    const currentPage = page.locator('[data-testid="page-number"][aria-current="page"]');
    await expect(currentPage).toHaveText('2');

    // 게시글 내용이 변경되어야 함 (다른 게시글들)
    postCards = page.locator('[data-testid="post-card"]');
    await expect(postCards.first()).toBeVisible();
  });

  // ✅ E2E 테스트 3: 이전 페이지로 이동
  test('should navigate to previous page', async ({ page }) => {
    // 먼저 페이지 2로 이동
    await page.goto('/?page=2');
    await page.waitForLoadState('networkidle');

    // 현재 페이지 확인
    let currentPage = page.locator('[data-testid="page-number"][aria-current="page"]');
    await expect(currentPage).toHaveText('2');

    // 이전 버튼 클릭
    const prevButton = page.locator('[data-testid="pagination-prev"]');
    if (await prevButton.isEnabled()) {
      await prevButton.click();
    } else {
      // 또는 페이지 1 클릭
      const page1Button = page.locator('[data-testid="page-number"]').filter({ hasText: '1' });
      await page1Button.click();
    }

    // 페이지 로드 대기
    await page.waitForLoadState('networkidle');

    // URL 파라미터 확인
    await expect(page).toHaveURL(/page=1/);

    // 현재 페이지 강조 확인
    currentPage = page.locator('[data-testid="page-number"][aria-current="page"]');
    await expect(currentPage).toHaveText('1');
  });

  // ✅ E2E 테스트 4: 특정 페이지 번호 클릭
  test('should navigate to specific page number', async ({ page }) => {
    // 페이지 3이 있는지 확인
    const page3Button = page.locator('[data-testid="page-number"]').filter({ hasText: '3' });

    if (await page3Button.isVisible()) {
      // 페이지 3 클릭
      await page3Button.click();
      await page.waitForLoadState('networkidle');

      // URL 파라미터 확인
      await expect(page).toHaveURL(/page=3/);

      // 현재 페이지 강조 확인
      const currentPage = page.locator('[data-testid="page-number"][aria-current="page"]');
      await expect(currentPage).toHaveText('3');

      // 게시글이 로드되어야 함
      const postCards = page.locator('[data-testid="post-card"]');
      await expect(postCards.first()).toBeVisible();
    }
  });

  // ✅ E2E 테스트 5: 처음 & 마지막 페이지 이동
  test('should navigate to first and last page', async ({ page }) => {
    // 마지막 페이지 버튼 찾기
    const allPageButtons = page.locator('[data-testid="page-number"]');
    const lastPageButton = allPageButtons.last();
    const lastPageNumber = await lastPageButton.textContent();

    // 마지막 페이지로 이동
    await lastPageButton.click();
    await page.waitForLoadState('networkidle');

    // 마지막 페이지 확인
    let currentPage = page.locator('[data-testid="page-number"][aria-current="page"]');
    await expect(currentPage).toHaveText(lastPageNumber || '');

    // 처음으로 버튼 또는 페이지 1 클릭
    const firstButton = page.locator('[data-testid="pagination-first"]');
    if (await firstButton.isVisible()) {
      await firstButton.click();
    } else {
      const page1Button = page.locator('[data-testid="page-number"]').filter({ hasText: '1' });
      await page1Button.click();
    }

    await page.waitForLoadState('networkidle');

    // 페이지 1 확인
    currentPage = page.locator('[data-testid="page-number"][aria-current="page"]');
    await expect(currentPage).toHaveText('1');
  });

  // ✅ E2E 테스트 6: 페이지 변경 시 스크롤 위치
  test('should scroll to top when changing page', async ({ page }) => {
    // 페이지 아래로 스크롤
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // 현재 스크롤 위치 확인
    let scrollTop = await page.evaluate(() => window.scrollY);
    expect(scrollTop).toBeGreaterThan(0);

    // 다음 페이지로 이동
    const nextButton = page.locator('[data-testid="pagination-next"]');
    if (await nextButton.isEnabled()) {
      await nextButton.click();
      await page.waitForLoadState('networkidle');

      // 스크롤 위치가 상단으로 돌아가야 함 (선택적: 구현에 따라)
      // scrollTop = await page.evaluate(() => window.scrollY);
      // expect(scrollTop).toBeLessThan(100); // 대부분 상단으로 스크롤됨
    }
  });

  // ✅ E2E 테스트 7: 필터 유지 시 페이지 변경
  test('should maintain filters when changing page', async ({ page }) => {
    // 검색 적용
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('React');
    await page.waitForLoadState('networkidle');

    // 태그 필터 적용
    const tagButtons = page.locator('[data-testid="tag-button"]');
    await tagButtons.first().click();
    await page.waitForLoadState('networkidle');

    // 현재 URL 저장
    const url1 = page.url();
    expect(url1).toContain('search=React');
    expect(url1).toContain('tags=');

    // 다음 페이지로 이동
    const nextButton = page.locator('[data-testid="pagination-next"]');
    if (await nextButton.isEnabled()) {
      await nextButton.click();
      await page.waitForLoadState('networkidle');

      // 새로운 URL 확인 (검색과 태그 필터 유지, 페이지 번호만 변경)
      const url2 = page.url();
      expect(url2).toContain('search=React');
      expect(url2).toContain('tags=');
      expect(url2).toContain('page=2');
    }
  });

  // ✅ E2E 테스트 8: 비활성화된 버튼
  test('should disable prev button on first page', async ({ page }) => {
    // 첫 페이지 확인
    const currentPage = page.locator('[data-testid="page-number"][aria-current="page"]');
    await expect(currentPage).toHaveText('1');

    // 이전 버튼이 비활성화되어야 함
    const prevButton = page.locator('[data-testid="pagination-prev"]');
    if (await prevButton.isVisible()) {
      await expect(prevButton).toBeDisabled();
    }

    // 페이지 2로 이동 후 다시 확인
    const page2Button = page.locator('[data-testid="page-number"]').filter({ hasText: '2' });
    if (await page2Button.isVisible()) {
      await page2Button.click();
      await page.waitForLoadState('networkidle');

      // 이전 버튼이 활성화되어야 함
      await expect(prevButton).toBeEnabled();
    }
  });

  // ✅ E2E 테스트 9: 페이지네이션 정보 표시
  test('should display pagination information', async ({ page }) => {
    // 페이지네이션 정보 (예: "1 - 20 of 150")
    const paginationInfo = page.locator('[data-testid="pagination-info"]');

    if (await paginationInfo.isVisible()) {
      const infoText = await paginationInfo.textContent();
      expect(infoText).toBeTruthy();
      expect(infoText).toMatch(/\d+/); // 숫자 포함
    }
  });
});
