import { projects } from "../data/content";
import { Eyebrow } from "./Eyebrow";
import { ReelGallery } from "./fx/ReelGallery";
import { ScreenArt } from "./ScreenArt";

const frames = projects.flatMap((p) => p.gallery.slice(0, 2).map((g, i) => ({ p, g, i })));

/** Every screen from every project on one curved, draggable strip. */
export function Reel({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <section id="reel" className="overflow-hidden py-24 md:py-32">
      <div className="mx-auto mb-10 max-w-7xl px-6 md:px-12">
        <Eyebrow>04 / Reel</Eyebrow>
        <h2 className="font-display text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.95] font-extrabold tracking-tight text-cream">
          A few frames. <span className="text-signal">Drag to spin.</span>
        </h2>
      </div>
      <ReelGallery
        items={frames.map(({ p, g, i }) => ({
          key: `${p.id}-${i}`,
          label: p.title,
          onOpen: () => onOpen(p.id),
          node: (
            <div className="flex h-full flex-col">
              <div className="min-h-0 flex-1 overflow-hidden rounded-xl">
                {g.src ? (
                  <img src={g.src} alt={g.caption} className="h-full w-full object-cover object-top" draggable={false} />
                ) : (
                  <ScreenArt variant={g.variant} c1={p.colors[0]} c2={p.colors[1]} title={p.title} />
                )}
              </div>
              <p className="mt-3 flex items-baseline justify-between gap-2 font-mono text-[11px] tracking-wider text-cream/70 uppercase">
                <span className="truncate">{p.title}</span>
                <span className="shrink-0 text-signal">{String(i + 1).padStart(2, "0")}</span>
              </p>
            </div>
          ),
        }))}
      />
    </section>
  );
}
