/**
 * 현재 기기의 device_os, browser를 User-Agent에서 감지
 */

export interface DeviceInfo {
  device_os: string; // windows, mac, linux, android, ios
  browser: string; // chrome, firefox, safari, edge
}

export function detectDevice(): DeviceInfo {
  const ua = navigator.userAgent.toLowerCase();

  return {
    device_os: detectOS(ua),
    browser: detectBrowser(ua),
  };
}

function detectOS(ua: string): string {
  if (ua.includes('android')) return 'android';
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) return 'ios';
  if (ua.includes('win')) return 'windows';
  if (ua.includes('mac') || ua.includes('macintosh')) return 'mac';
  if (ua.includes('linux')) return 'linux';
  return 'unknown';
}

function detectBrowser(ua: string): string {
  // Edge는 Chrome을 포함하므로 먼저 체크
  if (ua.includes('edg')) return 'edge';
  if (ua.includes('firefox')) return 'firefox';
  if (ua.includes('safari') && !ua.includes('chrome')) return 'safari';
  if (ua.includes('chrome')) return 'chrome';
  return 'unknown';
}
