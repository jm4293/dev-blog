import { test, expect } from '@playwright/test';

test.describe('검색 & 필터링 사용자 여정', () => {
  test.beforeEach(async ({ page }) => {
    // 메인 페이지로 이동
    await page.goto('/');
    // 페이지 로드 완료 대기
    await page.waitForLoadState('networkidle');
  });

  // ✅ E2E 테스트 1: 기본 게시글 목록 로드
  test('should load posts on initial page load', async ({ page }) => {
    // 게시글 카드가 보일 때까지 대기 (최소 1개)
    const postCards = page.locator('[data-testid="post-card"]');
    await expect(postCards.first()).toBeVisible();

    // 페이지네이션이 보여야 함
    const pagination = page.locator('[data-testid="pagination"]');
    await expect(pagination).toBeVisible();
  });

  // ✅ E2E 테스트 2: 검색 기능
  test('should search posts by title', async ({ page }) => {
    // 검색 입력 필드 찾기
    const searchInput = page.locator('[data-testid="search-input"]');
    await expect(searchInput).toBeVisible();

    // 검색어 입력
    await searchInput.fill('React');

    // 검색 결과 로드 대기
    await page.waitForLoadState('networkidle');

    // URL에 검색 파라미터 확인
    await expect(page).toHaveURL(/search=React/);

    // 검색 결과가 있어야 함
    const postCards = page.locator('[data-testid="post-card"]');
    await expect(postCards.first()).toBeVisible();
  });

  // ✅ E2E 테스트 3: 태그 필터링
  test('should filter posts by tag', async ({ page }) => {
    // 인기 태그 버튼 찾기
    const tagButtons = page.locator('[data-testid="tag-button"]');

    // 첫 번째 인기 태그 클릭 (예: Frontend)
    const firstTag = tagButtons.first();
    const tagName = await firstTag.textContent();
    await firstTag.click();

    // 필터 로드 대기
    await page.waitForLoadState('networkidle');

    // URL에 태그 파라미터 확인
    await expect(page).toHaveURL(/tags=/);

    // 선택된 태그 배지가 보여야 함
    const selectedTagBadge = page.locator('[data-testid="selected-tag-badge"]').first();
    await expect(selectedTagBadge).toBeVisible();
    await expect(selectedTagBadge).toContainText(tagName || '');
  });

  // ✅ E2E 테스트 4: 회사 필터링
  test('should filter posts by company', async ({ page }) => {
    // 회사 필터 모달 열기
    const companyFilterButton = page.locator('[data-testid="company-filter-button"]');
    await companyFilterButton.click();

    // 모달이 열려야 함
    const modal = page.locator('[data-testid="company-filter-modal"]');
    await expect(modal).toBeVisible();

    // 첫 번째 회사 선택
    const companyOptions = page.locator('[data-testid="company-option"]');
    const firstCompany = companyOptions.first();
    const companyName = await firstCompany.textContent();
    await firstCompany.click();

    // 완료 버튼 클릭
    const completeButton = page.locator('[data-testid="filter-complete-button"]');
    await completeButton.click();

    // 필터 로드 대기
    await page.waitForLoadState('networkidle');

    // URL에 회사 파라미터 확인
    await expect(page).toHaveURL(/companies=/);

    // 선택된 회사 배지가 보여야 함
    const selectedCompanyBadge = page.locator('[data-testid="selected-company-badge"]').first();
    await expect(selectedCompanyBadge).toBeVisible();
  });

  // ✅ E2E 테스트 5: 검색 + 필터 조합
  test('should apply search and filters together', async ({ page }) => {
    // 검색 입력
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('Backend');

    await page.waitForLoadState('networkidle');

    // 태그 필터링
    const tagButtons = page.locator('[data-testid="tag-button"]');
    await tagButtons.first().click();

    await page.waitForLoadState('networkidle');

    // URL에 검색과 태그 파라미터 모두 확인
    await expect(page).toHaveURL(/search=Backend/);
    await expect(page).toHaveURL(/tags=/);

    // 선택된 필터들이 모두 보여야 함
    const selectedTagBadge = page.locator('[data-testid="selected-tag-badge"]');
    await expect(selectedTagBadge).toBeVisible();

    // 게시글 결과가 있어야 함
    const postCards = page.locator('[data-testid="post-card"]');
    await expect(postCards.first()).toBeVisible();
  });

  // ✅ E2E 테스트 6: 정렬 옵션 변경
  test('should change sorting order', async ({ page }) => {
    // 정렬 드롭다운 찾기
    const sortButton = page.locator('[data-testid="sort-dropdown"]');
    await expect(sortButton).toBeVisible();

    // 현재 정렬 옵션 확인 (기본값: 최신순)
    await expect(sortButton).toContainText(/최신순|newest/i);

    // 정렬 옵션 변경 (오래된순)
    await sortButton.click();

    const oldestOption = page.locator('[data-testid="sort-oldest"]');
    await oldestOption.click();

    // 로드 대기
    await page.waitForLoadState('networkidle');

    // URL에 정렬 파라미터 확인
    await expect(page).toHaveURL(/sort=oldest/);

    // 정렬 드롭다운 업데이트 확인
    await expect(sortButton).toContainText(/오래된순|oldest/i);
  });

  // ✅ E2E 테스트 7: 필터 초기화
  test('should reset filters', async ({ page }) => {
    // 필터 적용
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('React');

    const tagButtons = page.locator('[data-testid="tag-button"]');
    await tagButtons.first().click();

    await page.waitForLoadState('networkidle');

    // 선택된 필터 배지 확인
    let selectedBadges = page.locator('[data-testid="selected-tag-badge"]');
    await expect(selectedBadges).toHaveCount(1);

    // 검색 초기화 버튼 클릭 (X 버튼)
    const clearSearchButton = page.locator('[data-testid="clear-search-button"]');
    if (await clearSearchButton.isVisible()) {
      await clearSearchButton.click();
      await page.waitForLoadState('networkidle');
    }

    // URL에 검색 파라미터가 없어야 함
    const url = page.url();
    expect(url).not.toContain('search=');

    // 검색 입력이 비워져야 함
    await expect(searchInput).toHaveValue('');
  });

  // ✅ E2E 테스트 8: URL 파라미터로 필터 공유
  test('should load filters from URL parameters', async ({ page }) => {
    // URL 파라미터로 페이지 접근
    await page.goto('/?search=React&tags=Frontend&companies=toss&sort=oldest');

    // 페이지 로드 완료 대기
    await page.waitForLoadState('networkidle');

    // 검색 입력에 값이 있어야 함
    const searchInput = page.locator('[data-testid="search-input"]');
    await expect(searchInput).toHaveValue('React');

    // 선택된 필터 배지들이 보여야 함
    const selectedBadges = page.locator('[data-testid="selected-tag-badge"], [data-testid="selected-company-badge"]');
    await expect(selectedBadges.first()).toBeVisible();

    // 정렬 옵션 확인
    const sortButton = page.locator('[data-testid="sort-dropdown"]');
    await expect(sortButton).toContainText(/오래된순|oldest/i);
  });
});
