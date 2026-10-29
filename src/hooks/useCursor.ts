import { useEffect, useState } from "react";

const pad = (n: number) => String(Math.max(0, Math.round(n))).padStart(4, "0");

/** Tracks the pointer and returns zero-padded X / Y strings, e.g. "0412". */
export function useCursor(): { x: string; y: string } {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setPos({ x: e.clientX, y: e.clientY }));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return { x: pad(pos.x), y: pad(pos.y) };
}
