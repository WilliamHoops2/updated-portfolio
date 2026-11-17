import { useEffect } from "react";

const TARGETS = ".btn, .header__cta";

/** Buttons lean toward the cursor while it's over them. Mouse only; one delegated listener. */
export function useMagnetic() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    let current: HTMLElement | null = null;
    const release = () => {
      if (current) current.style.translate = "";
      current = null;
    };

    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element).closest<HTMLElement>(TARGETS);
      if (el !== current) release();
      if (!el) return;
      current = el;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.translate = `${(dx * 0.22).toFixed(1)}px ${(dy * 0.3).toFixed(1)}px`;
    };

    document.addEventListener("pointermove", onMove);
    return () => {
      document.removeEventListener("pointermove", onMove);
      release();
    };
  }, []);
}
