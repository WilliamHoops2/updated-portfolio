import { useEffect } from "react";
import Lenis from "lenis";

/** Smooth, inertial page scroll. */
export function useSmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let frame = 0;
    const lenis = reduced ? null : new Lenis({ anchors: true });
    const loop = (time: number) => {
      lenis?.raf(time);
      frame = requestAnimationFrame(loop);
    };
    if (lenis) frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      lenis?.destroy();
    };
  }, []);
}
