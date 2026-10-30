import { useEffect } from "react";
import type { RefObject } from "react";

/**
 * While the pointer is over the hero:
 *  - sets --mx / --my (-1…1) on the section, used to tilt the phones
 *  - sets --lift (0…1) on each `.hero__char`, so letters near the cursor rise and turn accent-coloured
 */
export function useHeroPointer(
  sectionRef: RefObject<HTMLElement | null>,
  titleRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    if (!section || !title) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const chars = Array.from(title.querySelectorAll<HTMLElement>(".hero__char"));
    const reach = 190;
    let frame = 0;
    let px = 0;
    let py = 0;
    let active = false;

    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const nx = active ? ((px - rect.left) / rect.width) * 2 - 1 : 0;
      const ny = active ? ((py - rect.top) / rect.height) * 2 - 1 : 0;
      section.style.setProperty("--mx", nx.toFixed(3));
      section.style.setProperty("--my", ny.toFixed(3));

      for (const el of chars) {
        const r = el.getBoundingClientRect();
        const d = Math.hypot(px - (r.left + r.width / 2), py - (r.top + r.height / 2));
        const lift = active ? Math.max(0, 1 - d / reach) : 0;
        el.style.setProperty("--lift", lift.toFixed(3));
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      active = true;
      schedule();
    };

    const onLeave = () => {
      active = false;
      schedule();
    };

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, [sectionRef, titleRef]);
}
