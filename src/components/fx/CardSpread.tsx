import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import SpotlightCard from "@/components/rb/SpotlightCard";
import { cn } from "@/lib/utils";

/**
 * A stacked hand of cards that fans out when it scrolls into view. Hover a card to lift it.
 * Below the md breakpoint the cards just stack in a column.
 */
export function CardSpread({ cards }: { cards: ReactNode[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOpen(true), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const mid = (cards.length - 1) / 2;
  return (
    <div ref={ref} className="flex flex-col gap-4 md:relative md:block md:h-[27rem]" onPointerLeave={() => setHover(null)}>
      {cards.map((card, i) => {
        const o = i - mid;
        const lifted = hover === i;
        const transform = open
          ? `translateX(${o * 108}%) translateY(${Math.abs(o) * 22 + (lifted ? -26 : 0)}px) rotate(${lifted ? 0 : o * 7}deg) scale(${lifted ? 1.05 : 1})`
          : `translateX(0) translateY(${i * -4}px) rotate(${(i - mid) * 1.5}deg)`;
        return (
          <div
            key={i}
            onPointerEnter={() => setHover(i)}
            className="transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] md:absolute md:top-0 md:left-1/2 md:w-[min(26rem,34vw)] md:-translate-x-1/2"
            style={{ zIndex: lifted ? 20 : 10 - Math.abs(Math.round(o)) }}
          >
            <div className="hidden transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] md:block" style={{ transform }}>
              <SpotlightCard theme="dark" spotlightColor="rgba(185,242,124,0.28)" className={cn("h-[23rem] p-7!")}>
                {card}
              </SpotlightCard>
            </div>
            <SpotlightCard theme="dark" spotlightColor="rgba(185,242,124,0.28)" className="md:hidden">
              {card}
            </SpotlightCard>
          </div>
        );
      })}
    </div>
  );
}
