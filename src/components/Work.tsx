import { useCallback, useRef, useState } from "react";
import { useSectionProgress } from "../hooks/useSectionProgress";
import { orderedProjects } from "../data/order";
import { kindOf } from "../data/order";
import { Eyebrow } from "./Eyebrow";
import { ArcList } from "./fx/ArcList";
import { Media } from "./Media";
import { ASPECT } from "./mediaShape";
import { Screen } from "./ScreenArt";
import { projectVars } from "./projectStyle";

const items = orderedProjects.map((p) => ({ id: p.id, label: p.title, meta: p.category }));
const VH_PER_ITEM = 55;

/** Scroll turns an arc of project titles; the one at the front is shown on the right. */
export function Work({ onOpen }: { onOpen: (id: string) => void }) {
  const section = useRef<HTMLElement | null>(null);
  const [pos, setPos] = useState(0);
  const last = orderedProjects.length - 1;

  useSectionProgress(section, useCallback((p: number) => setPos(p * last), [last]));

  const pick = (i: number) => {
    const el = section.current;
    if (!el) return;
    const total = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: el.offsetTop + (i / last) * total, behavior: "smooth" });
  };

  const project = orderedProjects[Math.round(pos)];
  const kind = kindOf(project);

  return (
    <section ref={section} id="work" style={{ height: `${orderedProjects.length * VH_PER_ITEM + 100}vh` }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden px-6 pt-20 md:px-12">
        <div className="mx-auto w-full max-w-7xl">
          <Eyebrow>03 / Work</Eyebrow>
          <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-16">
            <div className="h-[42vh] overflow-hidden lg:h-[62vh]">
              <ArcList items={items} pos={pos} onPick={pick} />
            </div>

            <article key={project.id} className="animate-pop" style={projectVars(project)}>
              <div className="hidden h-[min(34vh,22rem)] items-center justify-center gap-4 overflow-hidden rounded-[20px] border border-cream/10 bg-[radial-gradient(ellipse_at_50%_100%,rgba(78,104,81,0.45),transparent_70%)] lg:flex">
                {kind === "app" ? (
                  project.gallery.slice(0, 3).map((g, i) => (
                    <div
                      key={i}
                      className="aspect-[200/410] h-[88%] overflow-hidden rounded-2xl border border-cream/15 bg-ink shadow-xl"
                      style={{ transform: `translateY(${i === 1 ? -8 : 10}px) rotate(${(i - 1) * 4}deg)` }}
                    >
                      <Screen item={g} colors={project.colors} title={project.title} />
                    </div>
                  ))
                ) : (
                  <Media item={project.gallery[0]} projectId={project.id} aspect={ASPECT[kind]} className="h-auto! w-[88%]!" />
                )}
              </div>
              <p className="mt-4 font-mono text-xs tracking-widest text-signal uppercase">
                {project.category} · {project.year} · {project.platform}
              </p>
              <h3 className="mt-2 font-display text-3xl font-bold text-cream md:text-4xl">{project.title}</h3>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-cream/70 md:text-base">{project.blurb}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {project.tags.slice(0, 4).map((t) => (
                  <span key={t} className="rounded-full border border-cream/20 px-3 py-1 font-mono text-[11px] tracking-wider text-cream/70 uppercase">
                    {t}
                  </span>
                ))}
                <button
                  type="button"
                  onClick={() => onOpen(project.id)}
                  className="ml-auto rounded-full bg-signal px-5 py-2.5 font-mono text-xs font-medium tracking-wider text-ink uppercase transition hover:bg-cream"
                >
                  Open project →
                </button>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
