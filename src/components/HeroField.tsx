import { useEffect, useRef } from "react";
import type { RefObject } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

interface Ripple {
  x: number;
  y: number;
  born: number;
}

interface HeroFieldProps {
  containerRef: RefObject<HTMLElement | null>;
}

const LINK_DIST = 120;
const POINTER_REACH = 190;
const BURST_REACH = 280;
const RIPPLE_MS = 900;

/**
 * A field of drifting dots that link up, shy away from the cursor,
 * and scatter with a ripple when you click.
 */
export function HeroField({ containerRef }: HeroFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let particles: Particle[] = [];
    let ripples: Ripple[] = [];
    let raf = 0;
    let running = false;
    let inView = true;
    let accent = "#2261e9";
    let ink = "#0a0e11";
    const pointer = { x: -9999, y: -9999, active: false };

    const readColors = () => {
      const styles = getComputedStyle(document.documentElement);
      accent = styles.getPropertyValue("--accent").trim() || accent;
      ink = styles.getPropertyValue("--fg").trim() || ink;
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(110, Math.round((w * h) / 14000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 1 + Math.random() * 1.8,
      }));
      if (reduceMotion) draw(performance.now());
    };

    const step = () => {
      for (const p of particles) {
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < POINTER_REACH * POINTER_REACH && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const force = (1 - d / POINTER_REACH) * 0.09;
            p.vx += (dx / d) * force;
            p.vy += (dy / d) * force;
          }
        }

        p.vx += (Math.random() - 0.5) * 0.015;
        p.vy += (Math.random() - 0.5) * 0.015;
        p.vx *= 0.99;
        p.vy *= 0.99;

        const speed = Math.hypot(p.vx, p.vy);
        if (speed > 4) {
          p.vx = (p.vx / speed) * 4;
          p.vy = (p.vy / speed) * 4;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = w + 10;
        else if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        else if (p.y > h + 10) p.y = -10;
      }
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;

      // Links between nearby dots.
      ctx.strokeStyle = ink;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK_DIST) {
            ctx.globalAlpha = (1 - d / LINK_DIST) * 0.22;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Links from the cursor to nearby dots.
      if (pointer.active) {
        ctx.strokeStyle = accent;
        for (const p of particles) {
          const d = Math.hypot(p.x - pointer.x, p.y - pointer.y);
          if (d < POINTER_REACH) {
            ctx.globalAlpha = (1 - d / POINTER_REACH) * 0.7;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }
      }

      // Dots.
      for (const p of particles) {
        const near = pointer.active && Math.hypot(p.x - pointer.x, p.y - pointer.y) < POINTER_REACH * 0.6;
        ctx.globalAlpha = near ? 0.95 : 0.5;
        ctx.fillStyle = near ? accent : ink;
        ctx.beginPath();
        ctx.arc(p.x, p.y, near ? p.r + 0.8 : p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Click ripples.
      ripples = ripples.filter((r) => now - r.born < RIPPLE_MS);
      ctx.strokeStyle = accent;
      for (const r of ripples) {
        const t = (now - r.born) / RIPPLE_MS;
        ctx.globalAlpha = (1 - t) * 0.6;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 8 + t * BURST_REACH, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      step();
      draw(now);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduceMotion || !inView || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const toLocal = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onMove = (e: PointerEvent) => {
      const { x, y } = toLocal(e);
      pointer.x = x;
      pointer.y = y;
      pointer.active = true;
    };

    const onLeave = () => {
      pointer.active = false;
    };

    const onDown = (e: PointerEvent) => {
      if (reduceMotion) return;
      if ((e.target as HTMLElement).closest("button, a")) return;
      const { x, y } = toLocal(e);
      for (const p of particles) {
        const dx = p.x - x;
        const dy = p.y - y;
        const d = Math.hypot(dx, dy);
        if (d < BURST_REACH && d > 0.01) {
          const force = (1 - d / BURST_REACH) * 6;
          p.vx += (dx / d) * force;
          p.vy += (dy / d) * force;
        }
      }
      ripples.push({ x, y, born: performance.now() });
    };

    readColors();
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const intersection = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    });
    intersection.observe(container);

    const themeObserver = new MutationObserver(() => {
      readColors();
      if (reduceMotion) draw(performance.now());
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    container.addEventListener("pointermove", onMove);
    container.addEventListener("pointerleave", onLeave);
    container.addEventListener("pointerdown", onDown);

    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersection.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerleave", onLeave);
      container.removeEventListener("pointerdown", onDown);
    };
  }, [containerRef]);

  return <canvas ref={canvasRef} className="hero__field" aria-hidden="true" />;
}
