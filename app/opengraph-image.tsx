import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '개발블로그·기술블로그·테크블로그 모음 — devBlog.kr';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '80px',
        background: 'linear-gradient(135deg, #07090F 0%, #1A1F35 100%)',
        color: '#F8F8FB',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          color: '#4D6BFB',
          fontSize: '28px',
          fontWeight: 600,
        }}
      >
        <span>● devBlog.kr</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div
          style={{
            fontSize: '88px',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <span>한국 개발자들이 매일 보는</span>
          <span style={{ color: '#4D6BFB' }}>32개 기술블로그</span>
        </div>
        <div
          style={{
            fontSize: '32px',
            color: '#949BB5',
            maxWidth: '900px',
            lineHeight: 1.4,
          }}
        >
          토스 · 카카오 · 네이버 · 우아한형제들 · 라인 · AWS · 무신사 외
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          fontSize: '22px',
          color: '#6B7390',
        }}
      >
        <span>6시간마다 자동 수집 · 무료</span>
        <span>devblog.kr</span>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
