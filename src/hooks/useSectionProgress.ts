import { useEffect, useRef } from "react";
import type { RefObject } from "react";

/**
 * 0 → 1 while a tall section scrolls past a sticky child: 0 when its top reaches the viewport top,
 * 1 when its bottom reaches the viewport bottom. Calls back outside React's render so it stays cheap.
 */
export function useSectionProgress(ref: RefObject<HTMLElement | null>, onProgress: (p: number) => void) {
  const cb = useRef(onProgress);
  cb.current = onProgress;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const run = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      cb.current(total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0);
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(run);
    };
    run();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, [ref]);
}
