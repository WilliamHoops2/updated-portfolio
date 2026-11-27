import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { Project } from "../data/content";
import { kindOf, orderedProjects as ordered } from "../data/order";
import { Eyebrow } from "./Eyebrow";
import { Media } from "./Media";
import { ASPECT } from "./mediaShape";
import { projectVars } from "./projectStyle";
import SpotlightCard from "./rb/SpotlightCard";
import StarBorder from "./rb/StarBorder";

interface CaseViewProps {
  project: Project;
  onClose: () => void;
  onGo: (id: string) => void;
}

const two = (n: number) => String(n).padStart(2, "0");
const pill =
  "rounded-full px-4 py-2 font-mono text-xs tracking-wider text-cream/80 uppercase ring-1 ring-cream/15 transition hover:bg-cream hover:text-ink focus-visible:outline-2 focus-visible:outline-signal";
/** Sections land one after another; skipped entirely under reduced motion. */
const rise = (i: number): CSSProperties => ({ animationDelay: `${i * 80}ms` });
const RISE = "motion-safe:animate-pop";

/** Full-screen view of one project, in the same ink / cream / signal look as the rest of the site. */
export function CaseView({ project, onClose, onGo }: CaseViewProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const position = ordered.indexOf(project);
  const prev = ordered[(position - 1 + ordered.length) % ordered.length];
  const next = ordered[(position + 1) % ordered.length];
  const kind = kindOf(project);

  // Move focus in on open, and hand it back to whatever opened the view when it closes.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => opener?.focus?.();
  }, []);

  // Each project starts at the top.
  useEffect(() => {
    rootRef.current?.scrollTo({ top: 0 });
  }, [project.id]);

  // Keep the page still underneath. Esc closes, arrow keys move between projects.
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onGo(next.id);
      if (e.key === "ArrowLeft") onGo(prev.id);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, onGo, next.id, prev.id]);

  const facts: [string, ReactNode][] = [
    ["Role", project.role],
    ["Platform", project.platform],
    ["Year", project.year],
    [
      "Built with",
      <span className="flex flex-wrap gap-1.5">
        {project.tags.map((t) => (
          <span key={t} className="rounded-full border border-cream/20 px-2.5 py-0.5 font-mono text-[11px] tracking-wider text-cream/80 uppercase">
            {t}
          </span>
        ))}
      </span>,
    ],
  ];

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-60 overflow-y-auto overscroll-contain bg-ink text-cream motion-safe:animate-fade"
      role="dialog"
      data-lenis-prevent
      aria-modal="true"
      aria-label={`${project.title}, project details`}
      style={projectVars(project)}
    >
      <div className="sticky top-0 z-10 border-b border-cream/10 bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-6 py-3 md:px-12">
          <nav className="flex items-center gap-2" aria-label="Projects">
            <button type="button" className={pill} onClick={() => onGo(prev.id)} aria-label={`Previous project: ${prev.title}`}>
              ← Prev
            </button>
            <span className="px-1 font-mono text-xs tracking-wider text-cream/50 tabular-nums">
              {two(position + 1)} / {two(ordered.length)}
            </span>
            <button type="button" className={pill} onClick={() => onGo(next.id)} aria-label={`Next project: ${next.title}`}>
              Next →
            </button>
          </nav>
          <button type="button" ref={closeRef} className={pill} onClick={onClose}>
            Close ✕
          </button>
        </div>
      </div>

      <article key={project.id} className="mx-auto max-w-7xl px-6 pt-10 pb-16 md:px-12 md:pt-16 md:pb-24">
        <header className={RISE} style={rise(0)}>
          <Eyebrow>{`${project.category} · ${project.year}`}</Eyebrow>
          <h2 className="font-display text-[clamp(3rem,9vw,7.5rem)] leading-[0.9] font-extrabold tracking-tight [overflow-wrap:anywhere]">
            {project.title}
            <span className="text-signal">.</span>
          </h2>
        </header>

        <div className={`${RISE} mt-10 grid gap-8 lg:mt-14 lg:grid-cols-12 lg:gap-16`} style={rise(1)}>
          <div className="lg:col-span-7">
            <p className="text-[clamp(1.35rem,2.2vw,1.9rem)] leading-snug font-medium text-cream">{project.blurb}</p>
            <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-cream/70 md:text-lg">{project.overview}</p>
          </div>

          <SpotlightCard theme="dark" spotlightColor="rgba(185, 242, 124, 0.18)" className="self-start p-6! lg:col-span-5">
            <dl className="divide-y divide-cream/10">
              {facts.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[6.5rem_1fr] items-baseline gap-4 py-3 first:pt-0 last:pb-0">
                  <dt className="font-mono text-[11px] tracking-widest text-cream/50 uppercase">{label}</dt>
                  <dd className="text-sm text-cream md:text-base">{value}</dd>
                </div>
              ))}
            </dl>
            {project.href && (
              <StarBorder
                as="a"
                href={project.href}
                target="_blank"
                rel="noreferrer"
                theme="dark"
                color="#b9f27c"
                radius={999}
                className="mt-6 w-full font-mono text-xs tracking-wider uppercase"
              >
                Visit project ↗
              </StarBorder>
            )}
          </SpotlightCard>
        </div>

        <section aria-label="Screens" className={`${RISE} mt-14 md:mt-20`} style={rise(2)}>
          <div
            className={`rounded-[24px] border border-cream/10 bg-[radial-gradient(ellipse_at_50%_100%,rgba(78,104,81,0.45),transparent_70%)] p-4 sm:p-8 md:p-12 [&_.media--empty>span]:hidden ${
              kind === "app" ? "flex flex-wrap justify-center gap-4 sm:gap-8" : "grid gap-6 md:grid-cols-2"
            }`}
          >
            {project.gallery.map((item, i) => (
              <figure key={`${project.id}-${i}`} className={kind === "app" ? "w-[calc(50%-0.5rem)] sm:w-56 lg:w-64" : ""}>
                <Media
                  item={item}
                  projectId={project.id}
                  aspect={ASPECT[kind]}
                  className={`border border-cream/15 shadow-2xl shadow-black/40 ${kind === "app" ? "rounded-[22px]!" : "rounded-2xl!"}`}
                />
                <figcaption className="mt-3 flex gap-2 font-mono text-[11px] tracking-wider uppercase">
                  <span className="text-signal">{two(i + 1)}</span>
                  <span className="text-cream/70">{item.caption}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className={`${RISE} mt-14 md:mt-20`} aria-label="Highlights" style={rise(3)}>
          <Eyebrow>Highlights</Eyebrow>
          <ol className="grid gap-px overflow-hidden rounded-2xl border border-cream/15 bg-cream/15 md:auto-cols-fr md:grid-flow-col">
            {project.highlights.map((text, i) => (
              <li key={text} className="bg-ink p-6">
                <p className="font-mono text-xs tracking-widest text-signal">{two(i + 1)}</p>
                <p className="mt-3 text-base leading-relaxed text-cream/85 md:text-lg">{text}</p>
              </li>
            ))}
          </ol>
        </section>

        <button
          type="button"
          onClick={() => onGo(next.id)}
          className="group mt-16 flex w-full items-center justify-between gap-6 rounded-[24px] border border-cream/10 p-6 text-left transition hover:border-signal/60 focus-visible:outline-2 focus-visible:outline-signal md:mt-24 md:p-10"
        >
          <span className="min-w-0">
            <span className="block font-mono text-xs tracking-widest text-cream/50 uppercase">Next project · {next.category}</span>
            <span className="mt-2 block truncate font-display text-[clamp(2rem,6vw,4.5rem)] leading-none font-extrabold tracking-tight transition group-hover:text-signal">
              {next.title}
            </span>
          </span>
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-signal text-xl text-ink transition group-hover:translate-x-1 md:size-16">→</span>
        </button>
      </article>
    </div>
  );
}
