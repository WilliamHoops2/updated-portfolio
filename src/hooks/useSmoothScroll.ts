import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Smooth, inertial page scroll. Also sets <html data-tone> to the tone of the section crossing the
 * middle of the screen, which motion.css turns into the colour flood between sections.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let frame = 0;
    const lenis = reduced ? null : new Lenis({ anchors: true });
    const loop = (time: number) => {
      lenis?.raf(time);
      frame = requestAnimationFrame(loop);
    };
    if (lenis) frame = requestAnimationFrame(loop);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) root.dataset.tone = (e.target as HTMLElement).dataset.tone;
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    document.querySelectorAll("[data-tone]").forEach((el) => io.observe(el));

    return () => {
      cancelAnimationFrame(frame);
      lenis?.destroy();
      io.disconnect();
      delete root.dataset.tone;
    };
  }, []);
}
