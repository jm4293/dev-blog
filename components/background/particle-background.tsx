'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { useShootingStars } from './use-shooting-stars';

const COSMIC_PATH_PREFIXES = ['/auth/login'];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseOpacity: number;
  twinkle: number;
}

interface ParticleBackgroundProps {
  density?: number;
  lightModeOpacity?: number;
  darkModeOpacity?: number;
  mouseRadius?: number;
  mouseStrength?: number;
}

export function ParticleBackground({
  density = 0.00015,
  lightModeOpacity = 0.7,
  darkModeOpacity = 1,
  mouseRadius = 140,
  mouseStrength = 0.6,
}: ParticleBackgroundProps) {
  const pathname = usePathname();
  const isCosmicPath = COSMIC_PATH_PREFIXES.some((prefix) => pathname?.startsWith(prefix));

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shootingCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const tweensRef = useRef<gsap.core.Tween[]>([]);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });

  useEffect(() => {
    if (isCosmicPath) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const isTouchDevice =
      'ontouchstart' in window || (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0);
    // Mobile browsers fire resize when the URL/tool bar shows/hides on scroll.
    // Lock the canvas height to the largest seen value so vertical-only changes do not retrigger resize work.
    let lockedHeight = height;
    let lastWidth = width;

    function isDarkMode() {
      return document.documentElement.classList.contains('dark');
    }

    function getParticleColor() {
      return isDarkMode() ? 'rgba(255, 255, 255, ' : 'rgba(77, 107, 251, ';
    }

    function getGlobalOpacity() {
      return isDarkMode() ? darkModeOpacity : lightModeOpacity;
    }

    function applyCanvasSize() {
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
    }

    let densityTimer: number | null = null;

    function resize() {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      const newDpr = Math.min(window.devicePixelRatio || 1, 2);

      const widthChanged = newWidth !== lastWidth;
      const dprChanged = newDpr !== dpr;
      const heightGrew = newHeight > lockedHeight;

      // On touch devices, ignore height-only shrinks triggered by URL bar show/hide on scroll.
      // Height growth (e.g. real window resize) must still pass through.
      if (isTouchDevice && !widthChanged && !dprChanged && !heightGrew) {
        return;
      }

      const prevWidth = width;
      const prevHeight = height;

      width = newWidth;
      lastWidth = newWidth;
      dpr = newDpr;
      // Keep the tallest height we've seen to avoid shrink-then-grow flicker.
      lockedHeight = Math.max(lockedHeight, newHeight);
      height = isTouchDevice ? lockedHeight : newHeight;

      applyCanvasSize();

      // Stretch existing particles with the viewport instead of reshuffling them —
      // re-randomizing on every resize event is visually jarring while dragging.
      const scaleX = width / prevWidth;
      const scaleY = height / prevHeight;
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i += 1) {
        particles[i].x *= scaleX;
        particles[i].y *= scaleY;
      }

      // Top up / trim particle count only after the resize settles.
      if (densityTimer !== null) window.clearTimeout(densityTimer);
      densityTimer = window.setTimeout(syncParticleDensity, 300);
    }

    function makeParticle(): Particle {
      const radius = Math.random() * 1.6 + 0.4;
      const baseOpacity = Math.random() * 0.6 + 0.3;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        radius,
        baseOpacity,
        twinkle: baseOpacity,
      };
    }

    function addTwinkleTween(particle: Particle) {
      if (reduceMotion) return;
      const tween = gsap.to(particle, {
        twinkle: particle.baseOpacity * 0.2,
        duration: 1.5 + Math.random() * 3.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 2,
      });
      tweensRef.current.push(tween);
    }

    // Match particle count to the current area: new ones spawn faded via their
    // twinkle tween, extras are dropped from the end. tweensRef stays index-aligned
    // with particlesRef (both only ever append / truncate).
    function syncParticleDensity() {
      const target = Math.floor(width * height * density);
      const particles = particlesRef.current;
      if (particles.length < target) {
        for (let i = particles.length; i < target; i += 1) {
          const particle = makeParticle();
          particles.push(particle);
          addTwinkleTween(particle);
        }
      } else if (particles.length > target) {
        tweensRef.current.splice(target).forEach((tween) => tween.kill());
        particles.length = target;
      }
    }

    function generateParticles() {
      tweensRef.current.forEach((tween) => tween.kill());
      tweensRef.current = [];
      particlesRef.current = [];

      const count = Math.floor(width * height * density);
      for (let i = 0; i < count; i += 1) {
        const particle = makeParticle();
        particlesRef.current.push(particle);
        addTwinkleTween(particle);
      }
    }

    function step() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);
      const colorPrefix = getParticleColor();
      const globalOpacity = getGlobalOpacity();
      const mouse = mouseRef.current;
      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < mouseRadius * mouseRadius && distSq > 0.0001) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / mouseRadius) * mouseStrength;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }

        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${colorPrefix}${p.twinkle * globalOpacity})`;
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

    applyCanvasSize();
    generateParticles();
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
      if (densityTimer !== null) window.clearTimeout(densityTimer);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [density, lightModeOpacity, darkModeOpacity, mouseRadius, mouseStrength, isCosmicPath]);

  useShootingStars({
    canvasRef: shootingCanvasRef,
    enabled: !isCosmicPath,
    minIntervalMs: 6000,
    maxIntervalMs: 14000,
    color: '180, 200, 255',
  });

  if (isCosmicPath) return null;

  return (
    <>
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 h-screen w-screen" />
      <canvas
        ref={shootingCanvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 h-screen w-screen"
      />
    </>
  );
}
