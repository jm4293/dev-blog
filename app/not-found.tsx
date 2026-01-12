'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const [isDark, setIsDark] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // 테마 감지 (저장된 테마 → 시스템 테마 → 기본값)
    const checkTheme = () => {
      const htmlElement = document.documentElement;

      // 저장된 테마 확인
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
        return;
      }

      // 시스템 테마 확인
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(isSystemDark);
    };

    checkTheme();

    // 테마 변경 감지
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Matrix rain animation
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const matrix =
      'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const matrixArray = matrix.split('');

    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    function draw() {
      if (!ctx || !canvas) return;

      // 테마에 따른 색상
      const bgColor = isDark ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.04)';
      const textColor = isDark ? '#0f0' : '#2563eb';

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = textColor;
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    const interval = setInterval(draw, 35);

    // GSAP animations
    const tl = gsap.timeline();

    tl.fromTo(titleRef.current, { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' })
      .fromTo(
        subtitleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        '-=0.5',
      )
      .fromTo(
        buttonsRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' },
        '-=0.3',
      );

    // Floating particles
    const particles: HTMLDivElement[] = [];
    const particleColor = isDark ? 'bg-green-400' : 'bg-blue-400';

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = `absolute w-1 h-1 ${particleColor} rounded-full opacity-60`;
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      containerRef.current?.appendChild(particle);
      particles.push(particle);

      gsap.to(particle, {
        y: 'random(-100, 100)',
        x: 'random(-100, 100)',
        duration: 'random(3, 6)',
        ease: 'none',
        repeat: -1,
        yoyo: true,
      });
    }

    return () => {
      clearInterval(interval);
      particles.forEach((particle) => particle.remove());
    };
  }, [isDark]);

  return (
    <div
      ref={containerRef}
      className={`min-h-screen ${isDark ? 'bg-black text-green-400' : 'bg-white text-blue-600'} flex items-center justify-center relative overflow-hidden transition-colors duration-300`}>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-20" />

      <div className="text-center z-10 px-4">
        <h1
          ref={titleRef}
          className={`text-8xl md:text-9xl font-bold mb-4 font-mono tracking-wider ${isDark ? 'text-green-400' : 'text-blue-600'}`}
          style={{ textShadow: isDark ? '0 0 20px #00ff00' : '0 0 20px #2563eb' }}>
          404
        </h1>

        <p
          ref={subtitleRef}
          className={`text-xl md:text-2xl mb-8 font-mono ${isDark ? 'text-green-300' : 'text-blue-500'}`}>
          페이지를 찾을 수 없습니다
        </p>

        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className={`group flex items-center gap-2 px-6 py-3 ${isDark ? 'bg-green-600 hover:bg-green-500 text-black' : 'bg-blue-600 hover:bg-blue-500 text-white'} font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg ${isDark ? 'hover:shadow-green-400/50' : 'hover:shadow-blue-400/50'}`}>
            <Home className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            홈으로 돌아가기
          </Link>

          <button
            onClick={() => window.history.back()}
            className={`group flex items-center gap-2 px-6 py-3 border-2 ${isDark ? 'border-green-400 hover:bg-green-400 hover:text-black text-green-400' : 'border-blue-400 hover:bg-blue-400 hover:text-white text-blue-400'} font-semibold rounded-lg transition-all duration-300 hover:scale-105`}>
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            이전 페이지
          </button>
        </div>

        <div className={`mt-12 text-sm opacity-60 font-mono ${isDark ? 'text-green-300' : 'text-blue-500'}`}>
          <p>{isDark ? '개발자의 세계에서 길을 잃었군요...' : '페이지를 찾는 중입니다...'}</p>
          <p className="mt-2">
            {isDark ? '하지만 코드는 여전히 실행되고 있습니다 🚀' : '잠시 후 다시 시도해주세요 🔍'}
          </p>
        </div>
      </div>
    </div>
  );
}
