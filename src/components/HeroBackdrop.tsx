import { useEffect, useRef } from "react";
import type { RefObject } from "react";

interface Mark {
  x: number;
  y: number;
  born: number;
  r: number;
}

const TRAIL_MS = 1400;
const SPLAT_MS = 1600;
const REACH = 170;

const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

/**
 * Hero backdrop: a halftone grid that swells around the cursor like a lens, plus an ink trail.
 * Dots also swell and turn pink wherever ink has been, fading as the ink fades. Click to splat.
 */
export function HeroBackdrop({ containerRef }: { containerRef: RefObject<HTMLElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !container || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Touch screens have no hover, so draw at half rate and let a finger-drag do the rest.
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let w = 0;
    let h = 0;
    let cell = 26;
    let cols = 0;
    let rows = 0;
    let heat = new Float32Array(0); // per-cell ink influence, rebuilt every frame
    let raf = 0;
    let lastFrame = 0;
    let inView = true;
    let fg = "#14121a";
    let ORCHID = "#ff3ea5";
    const pointer = { x: -9999, y: -9999, active: false };
    const eased = { x: 0, y: 0, k: 0 };
    const trail: Mark[] = [];
    const splats: Mark[] = [];
    let last = { x: 0, y: 0 };

    const readTheme = () => {
      // Read the live tokens so every ?palette= is respected.
      const cs = getComputedStyle(document.documentElement);
      fg = cs.getPropertyValue(document.documentElement.dataset.theme === "dark" ? "--p-cream" : "--p-ink").trim() || fg;
      ORCHID = cs.getPropertyValue("--p-orchid").trim() || ORCHID;
    };

    const resize = () => {
      const r = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cell = w < 640 ? 34 : 26; // fewer dots on phones
      cols = Math.ceil(w / cell);
      rows = Math.ceil(h / cell);
      heat = new Float32Array(cols * rows);
      eased.x = w * 0.7;
      eased.y = h * 0.4;
    };

    const addHeat = (x: number, y: number, radius: number, amount: number) => {
      const c0 = Math.max(0, Math.floor((x - radius) / cell));
      const c1 = Math.min(cols - 1, Math.floor((x + radius) / cell));
      const r0 = Math.max(0, Math.floor((y - radius) / cell));
      const r1 = Math.min(rows - 1, Math.floor((y + radius) / cell));
      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          const d = Math.hypot((c + 0.5) * cell - x, (r + 0.5) * cell - y);
          if (d >= radius) continue;
          const v = amount * (1 - d / radius);
          const i = r * cols + c;
          if (v > heat[i]) heat[i] = v;
        }
      }
    };

    const frame = (t: number) => {
      eased.x += ((pointer.active ? pointer.x : eased.x) - eased.x) * 0.08;
      eased.y += ((pointer.active ? pointer.y : eased.y) - eased.y) * 0.08;
      eased.k += ((pointer.active ? 1 : 0) - eased.k) * 0.08;

      if (pointer.active) {
        const speed = Math.hypot(pointer.x - last.x, pointer.y - last.y);
        if (speed > 1) trail.push({ x: pointer.x, y: pointer.y, born: t, r: Math.min(2 + speed * 0.5, 16) });
        last = { x: pointer.x, y: pointer.y };
      }
      while (trail.length && t - trail[0].born > TRAIL_MS) trail.shift();
      while (splats.length && t - splats[0].born > SPLAT_MS) splats.shift();

      heat.fill(0);
      for (let i = 0; i < trail.length; i += 2) addHeat(trail[i].x, trail[i].y, 64, 1 - (t - trail[i].born) / TRAIL_MS);
      for (const s of splats) addHeat(s.x, s.y, 36 + s.r * 3, 1 - (t - s.born) / SPLAT_MS);

      ctx.clearRect(0, 0, w, h);

      // Quiet dots share three batched paths (one fill each); only dots near the cursor or ink are drawn one by one.
      const quiet = [new Path2D(), new Path2D(), new Path2D()];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const gx = (c + 0.5) * cell;
          const gy = (r + 0.5) * cell;
          const ink = heat[r * cols + c];
          const dx = gx - eased.x;
          const dy = gy - eased.y;
          const d = Math.hypot(dx, dy);
          const pull = eased.k * Math.max(0, 1 - d / REACH);
          const wave = 0.5 + 0.5 * Math.sin(gx * 0.012 + gy * 0.009 + t * 0.0008);

          if (pull < 0.02 && ink < 0.02) {
            const radius = 0.9 + wave * 0.8;
            quiet[Math.min(2, Math.floor(wave * 3))].moveTo(gx + radius, gy);
            quiet[Math.min(2, Math.floor(wave * 3))].arc(gx, gy, radius, 0, Math.PI * 2);
            continue;
          }

          let x = gx;
          let y = gy;
          if (pull > 0 && d > 0.1) {
            x += (dx / d) * pull * 14;
            y += (dy / d) * pull * 14;
          }
          const heatNow = Math.max(pull, ink);
          ctx.fillStyle = heatNow > 0.4 ? rgba(ORCHID, 0.55 + heatNow * 0.45) : rgba(fg, 0.12 + wave * 0.1 + heatNow * 0.5);
          ctx.beginPath();
          ctx.arc(x, y, 0.9 + wave * 0.8 + pull * 8 + ink * 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      for (let b = 0; b < 3; b++) {
        ctx.fillStyle = rgba(fg, 0.12 + (b / 2) * 0.1 + 0.05);
        ctx.fill(quiet[b]);
      }

      // The ink itself, softer than the dots it stirs up.
      ctx.lineCap = "round";
      for (let i = 1; i < trail.length; i++) {
        const a = trail[i - 1];
        const b = trail[i];
        const life = 1 - (t - b.born) / TRAIL_MS;
        if (Math.hypot(a.x - b.x, a.y - b.y) > 120) continue; // a jump (re-entered the hero), not a stroke
        ctx.strokeStyle = rgba(life > 0.55 ? ORCHID : fg, life * 0.5);
        ctx.lineWidth = b.r * (0.4 + life * 0.6);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      for (const s of splats) {
        const life = 1 - (t - s.born) / SPLAT_MS;
        ctx.fillStyle = rgba(ORCHID, life * 0.8);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * (1.3 - life * 0.3), 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (coarse && t - lastFrame < 33) return;
      lastFrame = t;
      frame(t);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      if (reduce) return frame(performance.now());
      if (inView && !document.hidden) raf = requestAnimationFrame(loop);
    };

    const toLocal = (e: PointerEvent) => {
      const r = container.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMove = (e: PointerEvent) => Object.assign(pointer, toLocal(e), { active: true });
    const onLeave = () => (pointer.active = false);
    const onDown = (e: PointerEvent) => {
      if (reduce || (e.target as HTMLElement).closest("button, a")) return;
      const { x, y } = toLocal(e);
      const t = performance.now();
      for (let i = 0; i < 14; i++) {
        const a = Math.random() * Math.PI * 2;
        const d = Math.random() * 46;
        splats.push({ x: x + Math.cos(a) * d, y: y + Math.sin(a) * d, born: t, r: 2 + Math.random() * 9 });
      }
    };

    readTheme();
    resize();
    start();

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) frame(performance.now());
    });
    ro.observe(container);
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      start();
    });
    io.observe(container);
    const themeObs = new MutationObserver(() => {
      readTheme();
      if (reduce) frame(performance.now());
    });
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    document.addEventListener("visibilitychange", start);
    container.addEventListener("pointermove", onMove);
    container.addEventListener("pointerleave", onLeave);
    container.addEventListener("pointerdown", onDown);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      themeObs.disconnect();
      document.removeEventListener("visibilitychange", start);
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerleave", onLeave);
      container.removeEventListener("pointerdown", onDown);
    };
  }, [containerRef]);

  return <canvas ref={canvasRef} className="hero__field" aria-hidden="true" />;
}
