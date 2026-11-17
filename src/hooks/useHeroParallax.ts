import { useEffect } from "react";
import type { RefObject } from "react";

/** Sets --sy (px scrolled past the hero top, clamped to the hero's height) so layers can drift at different speeds. */
export function useHeroParallax(sectionRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const sy = Math.min(Math.max(window.scrollY, 0), section.offsetHeight);
      section.style.setProperty("--sy", sy.toFixed(1));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [sectionRef]);
}
