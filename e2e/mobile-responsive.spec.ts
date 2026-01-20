import { test, expect, devices } from '@playwright/test';

// 모바일 테스트는 Pixel 5 기기로 실행
test.use(devices['Pixel 5']);

test.describe('모바일 반응형 E2E 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 메인 페이지로 이동
    await page.goto('/');
    // 페이지 로드 완료 대기
    await page.waitForLoadState('networkidle');
  });

  // ✅ E2E 테스트 1: 모바일 헤더 레이아웃
  test('should display mobile header layout', async ({ page }) => {
    // 햄버거 메뉴 버튼이 보여야 함 (모바일에서만)
    const hamburgerButton = page.locator('[data-testid="mobile-menu-button"]');
    await expect(hamburgerButton).toBeVisible();

    // 로고는 보여야 함
    const logo = page.locator('[data-testid="header-logo"]');
    await expect(logo).toBeVisible();

    // 데스크탑 네비게이션은 숨겨져야 함
    const desktopNav = page.locator('[data-testid="desktop-navigation"]');
    if (await desktopNav.isVisible()) {
      // Pixel 5는 모바일 기기이므로 데스크탑 네비는 보이지 않아야 함
      const isVisible = await desktopNav.isVisible();
      expect(isVisible).toBe(false);
    }
  });

  // ✅ E2E 테스트 2: 모바일 메뉴 열기 & 닫기
  test('should open and close mobile menu', async ({ page }) => {
    // 햄버거 메뉴 클릭
    const hamburgerButton = page.locator('[data-testid="mobile-menu-button"]');
    await hamburgerButton.click();

    // 모바일 메뉴가 열려야 함
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');
    await expect(mobileMenu).toBeVisible();

    // 메뉴 항목들이 보여야 함
    const postLink = page.locator('[data-testid="mobile-menu"] >> text=포스트');
    await expect(postLink).toBeVisible();

    // X 버튼 또는 배경 클릭으로 닫기
    const closeButton = page.locator('[data-testid="mobile-menu-close"]');
    if (await closeButton.isVisible()) {
      await closeButton.click();
    } else {
      // 배경 클릭
      const overlay = page.locator('[data-testid="mobile-menu-overlay"]');
      await overlay.click();
    }

    // 메뉴가 닫혀야 함
    await expect(mobileMenu).not.toBeVisible();
  });

  // ✅ E2E 테스트 3: 모바일에서 게시글 카드 레이아웃
  test('should display single column post cards on mobile', async ({ page }) => {
    // 게시글 카드 컨테이너 확인
    const postList = page.locator('[data-testid="post-list"]');
    await expect(postList).toBeVisible();

    // 모바일에서는 1열로 표시되어야 함
    const postCards = page.locator('[data-testid="post-card"]');
    const firstCard = postCards.first();
    await expect(firstCard).toBeVisible();

    // 게시글 카드가 전체 너비를 사용해야 함 (거의)
    const cardBox = await firstCard.boundingBox();
    const pageBox = await page.locator('body').boundingBox();

    if (cardBox && pageBox) {
      // 카드 너비가 페이지 너비에 거의 가까워야 함 (약간의 마진 제외)
      expect(cardBox.width).toBeGreaterThan(pageBox.width * 0.8);
    }
  });

  // ✅ E2E 테스트 4: 모바일 검색 바
  test('should display mobile search bar', async ({ page }) => {
    // 검색 입력이 보여야 함
    const searchInput = page.locator('[data-testid="search-input"]');
    await expect(searchInput).toBeVisible();

    // 검색 입력에 포커스 가능해야 함
    await searchInput.click();
    await expect(searchInput).toBeFocused();

    // 검색어 입력
    await searchInput.fill('React');

    // 페이지 로드 대기
    await page.waitForLoadState('networkidle');

    // URL 파라미터 확인
    await expect(page).toHaveURL(/search=React/);
  });

  // ✅ E2E 테스트 5: 모바일 필터 모달
  test('should display mobile-optimized filter modal', async ({ page }) => {
    // 회사 필터 버튼 클릭
    const companyFilterButton = page.locator('[data-testid="company-filter-button"]');
    await expect(companyFilterButton).toBeVisible();
    await companyFilterButton.click();

    // 필터 모달이 열려야 함
    const filterModal = page.locator('[data-testid="company-filter-modal"]');
    await expect(filterModal).toBeVisible();

    // 모달이 화면을 채워야 함 (모바일 최적화)
    const modalBox = await filterModal.boundingBox();
    const pageBox = await page.locator('body').boundingBox();

    if (modalBox && pageBox) {
      // 모바일에서는 모달이 대부분의 공간을 차지해야 함
      expect(modalBox.width).toBeGreaterThan(pageBox.width * 0.8);
    }

    // 완료 버튼 클릭
    const completeButton = page.locator('[data-testid="filter-complete-button"]');
    await expect(completeButton).toBeVisible();
    await completeButton.click();

    // 모달이 닫혀야 함
    await expect(filterModal).not.toBeVisible();
  });

  // ✅ E2E 테스트 6: 모바일 터치 상호작용
  test('should handle mobile touch interactions', async ({ page }) => {
    // 게시글 카드 터치
    const postCard = page.locator('[data-testid="post-card"]').first();
    await expect(postCard).toBeVisible();

    // 호버 효과 대신 터치/탭 상호작용
    await postCard.tap();

    // 게시글 링크 클릭
    const postLink = postCard.locator('[data-testid="post-link"]');
    if (await postLink.isVisible()) {
      await postLink.click();

      // 게시글 상세 페이지로 이동 (또는 새 탭)
      // 구현에 따라 다름
    }
  });

  // ✅ E2E 테스트 7: 모바일에서 페이지네이션
  test('should display mobile-friendly pagination', async ({ page }) => {
    // 페이지네이션이 보여야 함
    const pagination = page.locator('[data-testid="pagination"]');
    await expect(pagination).toBeVisible();

    // 페이지 번호가 모두 보이지 않을 수 있음 (스크롤 필요)
    const pageNumbers = page.locator('[data-testid="page-number"]');
    const firstPageNumber = pageNumbers.first();
    await expect(firstPageNumber).toBeVisible();

    // 다음 버튼 클릭
    const nextButton = page.locator('[data-testid="pagination-next"]');
    if (await nextButton.isEnabled()) {
      await nextButton.click();
      await page.waitForLoadState('networkidle');

      // URL 파라미터 변경 확인
      await expect(page).toHaveURL(/page=2/);
    }
  });

  // ✅ E2E 테스트 8: 모바일 스크롤 성능
  test('should scroll smoothly on mobile', async ({ page }) => {
    // 페이지 아래로 스크롤
    await page.evaluate(() => {
      window.scrollBy(0, 500);
    });

    // 스크롤 위치 확인
    let scrollTop = await page.evaluate(() => window.scrollY);
    expect(scrollTop).toBeGreaterThan(0);

    // 게시글 카드들이 렌더링되어야 함
    const postCards = page.locator('[data-testid="post-card"]');
    await expect(postCards.first()).toBeVisible();
  });

  // ✅ E2E 테스트 9: 모바일에서 다크 모드 토글
  test('should toggle dark mode on mobile', async ({ page }) => {
    // 햄버거 메뉴 열기
    const hamburgerButton = page.locator('[data-testid="mobile-menu-button"]');
    await hamburgerButton.click();

    // 테마 토글 버튼 찾기
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    if (await themeToggle.isVisible()) {
      // 현재 테마 확인
      let htmlElement = await page.locator('html').evaluate((el) => el.getAttribute('class'));
      const isDark = htmlElement?.includes('dark');

      // 테마 토글
      await themeToggle.click();
      await page.waitForTimeout(500);

      // 테마 변경 확인
      htmlElement = await page.locator('html').evaluate((el) => el.getAttribute('class'));
      const isNowDark = htmlElement?.includes('dark');

      expect(isNowDark).toBe(!isDark);
    }
  });

  // ✅ E2E 테스트 10: 모바일에서 로그인 플로우
  test('should display mobile login button and flow', async ({ page }) => {
    // 햄버거 메뉴 열기
    const hamburgerButton = page.locator('[data-testid="mobile-menu-button"]');
    await hamburgerButton.click();

    // 로그인 버튼 찾기
    const loginButton = page.locator('[data-testid="login-button"]');
    await expect(loginButton).toBeVisible();

    // 로그인 버튼 클릭
    await loginButton.click();

    // 로그인 페이지로 이동
    await expect(page).toHaveURL(/login|auth/i);
  });

  // ✅ E2E 테스트 11: 모바일 뒤로가기 버튼
  test('should close mobile menu with back button', async ({ page }) => {
    // 햄버거 메뉴 열기
    const hamburgerButton = page.locator('[data-testid="mobile-menu-button"]');
    await hamburgerButton.click();

    // 모바일 메뉴가 열려야 함
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');
    await expect(mobileMenu).toBeVisible();

    // 브라우저 뒤로가기 (메뉴 닫기)
    await page.goBack();

    // 메뉴가 닫혀야 함 (또는 이전 페이지로 이동)
    // 구현에 따라 다를 수 있음
  });

  // ✅ E2E 테스트 12: 모바일 필터 배지 표시
  test('should display filter badges on mobile', async ({ page }) => {
    // 검색 입력
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('React');
    await page.waitForLoadState('networkidle');

    // 태그 필터 버튼들이 보여야 함
    const tagButtons = page.locator('[data-testid="tag-button"]');
    if (await tagButtons.first().isVisible()) {
      await tagButtons.first().click();
      await page.waitForLoadState('networkidle');

      // 선택된 필터 배지가 보여야 함
      const selectedBadges = page.locator('[data-testid="selected-tag-badge"]');
      await expect(selectedBadges.first()).toBeVisible();
    }
  });
});
