'use client';

import { useEffect } from 'react';
import gsap from 'gsap';

interface ShootingStar {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
  length: number;
  thickness: number;
  alive: boolean;
}

interface UseShootingStarsOptions {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  enabled: boolean;
  minIntervalMs?: number;
  maxIntervalMs?: number;
  durationMs?: number;
  color?: string;
}

export function useShootingStars({
  canvasRef,
  enabled,
  minIntervalMs = 5000,
  maxIntervalMs = 12000,
  durationMs = 1600,
  color = '255, 255, 255',
}: UseShootingStarsOptions) {
  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const stars: ShootingStar[] = [];
    let scheduleTimer: number | null = null;
    let rafId: number | null = null;

    function spawn() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const startX = Math.random() * width * 0.6;
      const startY = Math.random() * height * 0.4;
      const angle = (Math.random() * 25 + 20) * (Math.PI / 180);
      const distance = 280 + Math.random() * 220;
      const star: ShootingStar = {
        x: startX,
        y: startY,
        targetX: startX + Math.cos(angle) * distance,
        targetY: startY + Math.sin(angle) * distance,
        progress: 0,
        length: 100 + Math.random() * 80,
        thickness: 1.4 + Math.random() * 0.8,
        alive: true,
      };
      stars.push(star);

      gsap.to(star, {
        progress: 1,
        duration: durationMs / 1000,
        ease: 'power2.out',
        onComplete: () => {
          star.alive = false;
        },
      });
    }

    function scheduleNext() {
      const wait = minIntervalMs + Math.random() * (maxIntervalMs - minIntervalMs);
      scheduleTimer = window.setTimeout(() => {
        spawn();
        scheduleNext();
      }, wait);
    }

    function render() {
      if (!ctx) return;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = stars.length - 1; i >= 0; i -= 1) {
        const s = stars[i];
        if (!s.alive) {
          stars.splice(i, 1);
          continue;
        }

        const curX = s.x + (s.targetX - s.x) * s.progress;
        const curY = s.y + (s.targetY - s.y) * s.progress;
        const dx = s.targetX - s.x;
        const dy = s.targetY - s.y;
        const totalLen = Math.sqrt(dx * dx + dy * dy);
        const nx = dx / totalLen;
        const ny = dy / totalLen;

        const trailLen = Math.min(s.length, s.progress * totalLen);
        const tailX = curX - nx * trailLen;
        const tailY = curY - ny * trailLen;

        const fadeIn = Math.min(1, s.progress / 0.1);
        const fadeOut = s.progress < 0.75 ? 1 : 1 - (s.progress - 0.75) / 0.25;
        const alpha = fadeIn * fadeOut;

        const gradient = ctx.createLinearGradient(curX, curY, tailX, tailY);
        gradient.addColorStop(0, `rgba(${color}, ${0.4 * alpha})`);
        gradient.addColorStop(0.4, `rgba(${color}, ${0.18 * alpha})`);
        gradient.addColorStop(1, `rgba(${color}, 0)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = s.thickness;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(curX, curY);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        ctx.fillStyle = `rgba(${color}, ${0.55 * alpha})`;
        ctx.beginPath();
        ctx.arc(curX, curY, s.thickness * 1.1, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(render);
    }

    scheduleNext();
    render();

    return () => {
      if (scheduleTimer !== null) clearTimeout(scheduleTimer);
      if (rafId !== null) cancelAnimationFrame(rafId);
      stars.forEach((star) => gsap.killTweensOf(star));
      stars.length = 0;
    };
  }, [canvasRef, enabled, minIntervalMs, maxIntervalMs, durationMs, color]);
}
