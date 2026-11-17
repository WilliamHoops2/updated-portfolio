import { useEffect } from "react";
import type { RefObject } from "react";

/**
 * While the ticker is on screen, scrolling speeds up the marquee and slants its words
 * (--skew on the ticker). Both ease back to rest once scrolling stops.
 */
export function useTickerVelocity(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    const track = el?.querySelector<HTMLElement>(".ticker__track");
    if (!el || !track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let last = window.scrollY;
    let vel = 0;
    let raf = 0;

    const tick = () => {
      const y = window.scrollY;
      const delta = y - last;
      last = y;
      vel += (delta - vel) * 0.18;

      const resting = Math.abs(vel) < 0.03 && Math.abs(delta) < 0.5;
      if (resting) vel = 0;
      el.style.setProperty("--skew", `${Math.max(-8, Math.min(8, vel * -0.4)).toFixed(2)}deg`);
      const animation = track.getAnimations()[0];
      if (animation) animation.playbackRate = 1 + Math.min(Math.abs(vel) * 0.3, 7);

      raf = resting ? 0 : requestAnimationFrame(tick);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        last = window.scrollY;
        window.addEventListener("scroll", onScroll, { passive: true });
      } else {
        window.removeEventListener("scroll", onScroll);
      }
    });
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [ref]);
}
