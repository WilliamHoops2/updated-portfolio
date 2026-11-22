import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ReelProps {
  items: { key: string; node: ReactNode; label: string; onOpen: () => void }[];
  className?: string;
}

const FRAME_W = 240;
const GAP = 28;
const STRIDE = FRAME_W + GAP;

/**
 * A film reel curved around an invisible drum. It drifts on its own, drags with the pointer,
 * and frames lean away from the centre. Click a frame to open it.
 */
export function ReelGallery({ items, className }: ReelProps) {
  const box = useRef<HTMLDivElement | null>(null);
  const frames = useRef<(HTMLButtonElement | null)[]>([]);
  const state = useRef({ x: 0, v: 0, drag: false, moved: 0, last: 0, visible: false });

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const s = state.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const total = items.length * STRIDE;
    let raf = 0;

    const render = () => {
      const w = el.clientWidth;
      frames.current.forEach((f, i) => {
        if (!f) return;
        const x = ((((i * STRIDE + s.x) % total) + total) % total) - STRIDE;
        const off = (x + FRAME_W / 2 - w / 2) / (w / 2); // -1 … 1 across the viewport
        f.style.transform = `translate3d(${x}px,0,${-Math.abs(off) * 160}px) rotateY(${off * -28}deg)`;
        f.style.opacity = String(Math.max(0.25, 1 - Math.abs(off) * 0.55));
      });
    };
    const tick = () => {
      raf = 0;
      if (!s.drag) {
        s.x += s.v - (reduce ? 0 : 0.55);
        s.v *= 0.93;
      }
      render();
      if (s.visible) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      s.visible = e.isIntersecting;
      if (s.visible && !raf) raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    render();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [items.length]);

  const down = (e: React.PointerEvent) => {
    const s = state.current;
    s.drag = true;
    s.moved = 0;
    s.last = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const move = (e: React.PointerEvent) => {
    const s = state.current;
    if (!s.drag) return;
    const dx = e.clientX - s.last;
    s.last = e.clientX;
    s.moved += Math.abs(dx);
    s.x += dx;
    s.v = dx;
  };
  const up = () => {
    state.current.drag = false;
  };

  return (
    <div
      ref={box}
      className={cn("relative h-[26rem] cursor-grab touch-pan-y overflow-hidden [perspective:1100px] active:cursor-grabbing", className)}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") state.current.v -= 18;
        if (e.key === "ArrowLeft") state.current.v += 18;
      }}
    >
      {items.map((item, i) => (
        <button
          key={item.key}
          ref={(el) => {
            frames.current[i] = el;
          }}
          type="button"
          aria-label={`Open ${item.label}`}
          onClick={() => state.current.moved < 6 && item.onOpen()}
          style={{ width: FRAME_W }}
          className="absolute top-0 left-0 h-full rounded-2xl border border-cream/15 bg-ink-2 p-3 text-left will-change-transform"
        >
          {item.node}
        </button>
      ))}
    </div>
  );
}
