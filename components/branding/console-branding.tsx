'use client';

import { useEffect } from 'react';

// StrictMode 이중 마운트/페이지 전환에도 콘솔에는 한 번만 출력
let hasLogged = false;

const LOGO_ART = [
  '      _            _     _               _         ',
  '   __| | _____   _| |__ | | ___   __ _  | | ___ __ ',
  "  / _` |/ _ \\ \\ / / '_ \\| |/ _ \\ / _` | | |/ / '__|",
  ' | (_| |  __/\\ V /| |_) | | (_) | (_| |_|   <| |   ',
  '  \\__,_|\\___| \\_/ |_.__/|_|\\___/ \\__, (_)_|\\_\\_|   ',
  '                                 |___/             ',
].join('\n');

/**
 * F12 개발자 도구 콘솔에 devblog.kr 로고 아트 출력
 */
export function ConsoleBranding() {
  useEffect(() => {
    if (hasLogged) return;
    hasLogged = true;

    console.log(`%c${LOGO_ART}`, 'color:#7C3AED;font-family:monospace;font-weight:bold;line-height:1.2;');
    console.log(
      '%c기술블로그 모음 devBlog.kr%c — 6시간마다 새 글을 수집합니다. https://github.com/jm4293/dev-blog',
      'font-weight:bold;font-size:12px;',
      'font-weight:normal;font-size:12px;color:#888;',
    );
  }, []);

  return null;
}
