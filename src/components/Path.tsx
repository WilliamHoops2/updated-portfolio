import { useCallback, useEffect, useRef, useState } from "react";
import { path } from "../data/content";
import { useSectionProgress } from "../hooks/useSectionProgress";
import { Eyebrow } from "./Eyebrow";
import { pathArt } from "./pathArt";

/** A vertical timeline: the heading stays pinned while the chapters scroll past, and the line fills as you go. */
export function Path() {
  const list = useRef<HTMLOListElement | null>(null);
  const fill = useRef<HTMLDivElement | null>(null);
  const [now, setNow] = useState(0);

  useSectionProgress(list, useCallback((p: number) => void (fill.current!.style.transform = `scaleY(${p})`), []));

  useEffect(() => {
    const items = [...list.current!.children];
    // A chapter is current while it crosses the middle band of the viewport.
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setNow(items.indexOf(e.target))),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="path" className="relative px-6 py-24 md:pr-12 md:pl-28 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12">
        <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <Eyebrow>02 / Path</Eyebrow>
          <h2 className="font-display text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.95] font-extrabold tracking-tight text-cream">
            From the classroom to <span className="text-signal">SwiftUI</span>
          </h2>
        </div>
        <div className="relative lg:col-span-7">
          <div className="absolute top-2 bottom-2 left-2 w-px bg-cream/15" />
          <div ref={fill} className="absolute top-2 bottom-2 left-2 w-px origin-top scale-y-0 bg-signal" />
          <ol ref={list} className="relative space-y-10">
            {path.map((step, i) => (
              <li
                key={step.title}
                aria-current={i === now ? "step" : undefined}
                className="relative pl-10 opacity-40 transition duration-500 aria-[current]:opacity-100"
              >
                <span className="absolute top-1 left-0 size-4 rounded-full bg-signal ring-4 ring-ink" />
                <div className="relative overflow-hidden rounded-[20px] border border-cream/10 bg-ink-2/80 backdrop-blur-sm">
                  {/* The drawing shows until a photo exists in public/path/, which then covers it */}
                  <div className="relative aspect-video bg-[radial-gradient(ellipse_at_50%_100%,rgba(78,104,81,0.45),transparent_70%)]">
                    <svg viewBox="0 0 320 180" role="img" aria-label={step.alt} className="absolute inset-0 size-full">
                      {pathArt[i]}
                    </svg>
                    <img
                      src={step.image}
                      alt={step.alt}
                      loading="lazy"
                      onError={(e) => (e.currentTarget.hidden = true)}
                      className="absolute inset-0 size-full object-cover"
                    />
                  </div>
                  <div className="relative p-6">
                    <span aria-hidden className="pointer-events-none absolute -top-2 right-3 font-display text-7xl font-extrabold text-cream/[0.05]">
                      {step.when.slice(-4)}
                    </span>
                    <p className="font-mono text-xs tracking-widest text-signal uppercase">{step.when}</p>
                    <h3 className="mt-2 font-display text-2xl font-bold text-cream md:text-3xl">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-cream/70 md:text-base">{step.text}</p>
                    <ul className="mt-4 space-y-1.5 text-sm text-cream/80">
                      {step.points.map((t) => (
                        <li key={t} className="flex gap-2.5">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-signal" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
