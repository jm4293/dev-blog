'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useShootingStars } from './use-shooting-stars';

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseOpacity: number;
  twinkle: number;
  glowSize: number;
  isLarge: boolean;
}

interface CosmicBackgroundProps {
  density?: number;
  largeStarRatio?: number;
  mouseRadius?: number;
  mouseStrength?: number;
}

export function CosmicBackground({
  density = 0.0004,
  largeStarRatio = 0.06,
  mouseRadius = 160,
  mouseStrength = 0.8,
}: CosmicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shootingCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const starsRef = useRef<Star[]>([]);
  const rafRef = useRef<number | null>(null);
  const tweensRef = useRef<gsap.core.Tween[]>([]);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (!canvas) return;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

      const shootingCanvas = shootingCanvasRef.current;
      if (shootingCanvas) {
        shootingCanvas.width = width * dpr;
        shootingCanvas.height = height * dpr;
        shootingCanvas.style.width = `${width}px`;
        shootingCanvas.style.height = `${height}px`;
        shootingCanvas.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      generateStars();
    }

    function generateStars() {
      const count = Math.floor(width * height * density);
      const stars: Star[] = [];
      for (let i = 0; i < count; i += 1) {
        const isLarge = Math.random() < largeStarRatio;
        const radius = isLarge ? Math.random() * 2.4 + 1.4 : Math.random() * 1.2 + 0.3;
        const baseOpacity = isLarge ? Math.random() * 0.4 + 0.6 : Math.random() * 0.6 + 0.2;
        const glowSize = isLarge ? radius * 8 + Math.random() * 6 : 0;
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.08,
          vy: (Math.random() - 0.5) * 0.08,
          radius,
          baseOpacity,
          twinkle: baseOpacity,
          glowSize,
          isLarge,
        });
      }
      starsRef.current = stars;

      tweensRef.current.forEach((tween) => tween.kill());
      tweensRef.current = [];

      if (reduceMotion) return;

      stars.forEach((star) => {
        const tween = gsap.to(star, {
          twinkle: star.baseOpacity * (star.isLarge ? 0.35 : 0.1),
          duration: 1.4 + Math.random() * 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: Math.random() * 2.5,
        });
        tweensRef.current.push(tween);
      });
    }

    function step() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);
      const mouse = mouseRef.current;
      const stars = starsRef.current;

      for (let i = 0; i < stars.length; i += 1) {
        const s = stars[i];

        s.x += s.vx;
        s.y += s.vy;

        if (mouse.active) {
          const dx = s.x - mouse.x;
          const dy = s.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < mouseRadius * mouseRadius && distSq > 0.0001) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / mouseRadius) * mouseStrength;
            s.x += (dx / dist) * force;
            s.y += (dy / dist) * force;
          }
        }

        if (s.x < -20) s.x = width + 20;
        else if (s.x > width + 20) s.x = -20;
        if (s.y < -20) s.y = height + 20;
        else if (s.y > height + 20) s.y = -20;

        if (s.isLarge && s.glowSize > 0) {
          const gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.glowSize);
          gradient.addColorStop(0, `rgba(255, 255, 255, ${s.twinkle * 0.5})`);
          gradient.addColorStop(0.4, `rgba(180, 200, 255, ${s.twinkle * 0.15})`);
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.glowSize, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${s.twinkle})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(step);
    }

    function handleMouseMove(event: MouseEvent) {
      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
      mouseRef.current.active = true;
    }

    function handleMouseLeave() {
      mouseRef.current.active = false;
    }

    resize();
    step();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      tweensRef.current.forEach((tween) => tween.kill());
      tweensRef.current = [];
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [density, largeStarRatio, mouseRadius, mouseStrength]);

  useShootingStars({
    canvasRef: shootingCanvasRef,
    enabled: true,
    minIntervalMs: 3500,
    maxIntervalMs: 9000,
    durationMs: 2000,
    color: '255, 255, 255',
  });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ background: '#000' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <canvas ref={shootingCanvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
