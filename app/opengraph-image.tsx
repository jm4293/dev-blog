import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '기술블로그 모음 — devBlog.kr';
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
          fontSize: '32px',
          fontWeight: 600,
        }}
      >
        <span>● devBlog.kr</span>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          fontSize: '104px',
          fontWeight: 900,
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
        }}
      >
        <span>32개 기술블로그를</span>
        <span style={{ color: '#4D6BFB' }}>한 곳에서</span>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
