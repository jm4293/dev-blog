/**
 * Chrome 확장플러그인 백그라운드 스크립트
 * - 확장 아이콘 배지 업데이트
 */

// 배지 업데이트 함수
async function updateBadge() {
  try {
    const response = await fetch('https://www.devblog.kr/api/posts?page=1&limit=1');

    if (!response.ok) {
      return;
    }

    const data = await response.json();
    const total = data.pagination?.total || 0;

    if (total > 0) {
      const badgeText = total > 999 ? '99+' : total.toString();
      chrome.action.setBadgeText({ text: badgeText });
      chrome.action.setBadgeBackgroundColor({ color: '#2563EB' });
    } else {
      chrome.action.setBadgeText({ text: '' });
    }
  } catch (error) {}
}

// 확장 설치 시 실행
if (typeof chrome !== 'undefined' && chrome.runtime) {
  chrome.runtime.onInstalled.addListener(() => {
    updateBadge();
  });
}
