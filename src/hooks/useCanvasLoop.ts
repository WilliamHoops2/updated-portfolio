import { useEffect, useRef } from "react";

export interface Pointer {
  x: number;
  y: number;
  on: boolean;
}

interface Options {
  /** Runs on mount and on every resize, with the canvas size in CSS pixels. */
  setup?: (w: number, h: number) => void;
  frame: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, pointer: Pointer) => void;
  maxDpr?: number;
  /** Re-runs setup when these change. */
  deps?: unknown[];
}

/**
 * A 2D canvas that fills its box, redraws only while on screen, tracks the pointer in canvas
 * coordinates, and draws a single still frame when the visitor prefers reduced motion.
 */
export function useCanvasLoop({ setup, frame, maxDpr = 2, deps = [] }: Options) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const latest = useRef({ setup, frame });
  latest.current = { setup, frame };

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer: Pointer = { x: -1e4, y: -1e4, on: false };
    const start = performance.now();
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = false;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      latest.current.frame(ctx, w, h, (performance.now() - start) / 1000, pointer);
    };
    const loop = () => {
      raf = 0;
      draw();
      if (visible && !reduce) raf = requestAnimationFrame(loop);
    };
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      latest.current.setup?.(w, h);
      draw();
    };
    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.on = true;
    };
    const leave = () => {
      pointer.x = pointer.y = -1e4;
      pointer.on = false;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf && !reduce) raf = requestAnimationFrame(loop);
    });
    const ro = new ResizeObserver(resize);
    io.observe(canvas);
    ro.observe(canvas);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxDpr, ...deps]);

  return ref;
}
