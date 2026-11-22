import { useMemo, useRef } from "react";
import type { ReactNode } from "react";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { cn } from "@/lib/utils";

const COLS = 12;
const ROWS = 8;
const SHADES = ["#16211b", "#1b2a22", "#22352a", "#2b4034", "#122019"];

/**
 * A sticky screen covered in tiles. Scrolling shrinks them away in a scatter that sweeps from the
 * top-left, uncovering `children` beneath. `cover` sits on the tiles and fades as they go.
 */
export function TileReveal({ children, cover, className }: { children: ReactNode; cover?: ReactNode; className?: string }) {
  const section = useRef<HTMLElement | null>(null);
  const tiles = useRef<(HTMLSpanElement | null)[]>([]);
  const coverEl = useRef<HTMLDivElement | null>(null);

  const spec = useMemo(
    () =>
      Array.from({ length: COLS * ROWS }, (_, i) => {
        const c = i % COLS;
        const r = Math.floor(i / COLS);
        const noise = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1; // fixed scatter, no re-roll on render
        return { start: ((c / COLS + r / ROWS) / 2) * 0.35 + noise * 0.4, shade: SHADES[i % SHADES.length] };
      }),
    [],
  );

  useSectionProgress(section, (p) => {
    spec.forEach((t, i) => {
      const k = Math.min(1, Math.max(0, (p * 1.2 - t.start) / 0.22));
      const el = tiles.current[i];
      if (el) {
        el.style.transform = `scale(${1 - k})`;
        el.style.opacity = k >= 1 ? "0" : "1";
      }
    });
    if (coverEl.current) coverEl.current.style.opacity = String(Math.max(0, 1 - p * 6));
  });

  return (
    <section ref={section} className={cn("relative h-[260vh]", className)}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0">{children}</div>
        <div className="pointer-events-none absolute inset-0 z-10 grid" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}>
          {spec.map((t, i) => (
            <span
              key={i}
              ref={(el) => {
                tiles.current[i] = el;
              }}
              className="border border-cream/[0.06] will-change-transform"
              style={{ background: t.shade }}
            />
          ))}
        </div>
        {cover && (
          <div ref={coverEl} className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            {cover}
          </div>
        )}
      </div>
    </section>
  );
}
