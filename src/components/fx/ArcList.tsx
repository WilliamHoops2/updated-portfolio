import { cn } from "@/lib/utils";

interface ArcListProps {
  items: { id: string; label: string; meta: string }[];
  /** Continuous position: 2.4 means item 2 is 40% of the way to item 3. */
  pos: number;
  onPick: (index: number) => void;
}

/** Titles laid along a circle. The item at `pos` sits furthest out; the rest curve away and fade. */
export function ArcList({ items, pos, onPick }: ArcListProps) {
  const R = 460;
  const STEP = 0.19;
  const active = Math.round(pos);
  return (
    <ul className="relative h-full w-full [mask-image:linear-gradient(to_bottom,transparent,#000_18%,#000_82%,transparent)]" aria-label="Projects">
      {items.map((item, i) => {
        const o = i - pos;
        if (Math.abs(o) > 4.5) return null;
        const a = o * STEP;
        const x = (Math.cos(a) - 1) * R;
        const y = Math.sin(a) * R;
        const on = i === active;
        return (
          <li
            key={item.id}
            className="absolute top-[22%] right-0 left-10 will-change-transform lg:left-32"
            style={{
              transform: `translate3d(${x}px, calc(${y}px - 50%), 0) rotate(${a * 0.35}rad)`,
              opacity: Math.max(0, 1 - Math.abs(o) * 0.24),
              transformOrigin: "left center",
            }}
          >
            <button
              type="button"
              onClick={() => onPick(i)}
              aria-current={on}
              className={cn(
                "group flex w-full items-baseline gap-4 text-left transition-colors",
                on ? "text-signal" : "text-cream/55 hover:text-cream",
              )}
            >
              <span className="w-8 shrink-0 font-mono text-xs tracking-wider">{String(i + 1).padStart(2, "0")}</span>
              <span className="truncate font-display text-[clamp(1.6rem,3.6vw,3.4rem)] leading-none font-bold tracking-tight">
                {item.label}
              </span>
              <span className="hidden font-mono text-[10px] tracking-widest uppercase opacity-60 xl:inline">{item.meta}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
