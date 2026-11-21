import { useEffect, useRef, useState, type ReactNode } from "react";
import { profile } from "../data/content";

const svg = (d: ReactNode) => (
  <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);

const LINKS = [
  ["About", "#about", svg(<><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 0 0-16 0" /></>)],
  ["Work", "#work", svg(<><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></>)],
  ["Reel", "#reel", svg(<><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 3v18M17 3v18M3 12h18" /></>)],
  ["Services", "#services", svg(<><path d="M12 2 2 7l10 5 10-5-10-5Z" /><path d="m2 17 10 5 10-5M2 12l10 5 10-5" /></>)],
  ["Play", "#interests", svg(<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z" />)],
] as const;

const MAIL = svg(<><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 7L2 7" /></>);

const TILE =
  "group relative grid size-11 place-items-center rounded-2xl bg-cream/[0.07] text-cream/70 ring-1 ring-cream/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_8px_20px_-8px_rgba(0,0,0,0.6)] backdrop-blur-2xl backdrop-saturate-[1.8] transition-[transform,background-color,color] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] [transform:scale(var(--s,1))] hover:text-cream";
const TIP =
  "pointer-events-none absolute left-full ml-3 hidden origin-left scale-75 rounded-full bg-cream px-3 py-1 font-mono text-[11px] tracking-wider whitespace-nowrap text-ink uppercase opacity-0 transition duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 md:block";

/** Dock-style glass nav: a logo bubble plus icon tiles that swell toward the pointer. */
export function Header({ inert }: { inert?: boolean }) {
  const [copied, setCopied] = useState(false);
  const [active, setActive] = useState("");
  const dock = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = LINKS.map(([, h]) => document.querySelector(h)).filter((e): e is Element => !!e);
    // A section counts as current while it crosses the middle band of the viewport.
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Swell each tile by its distance to the pointer (works for the vertical and the mobile horizontal layout).
  const swell = (e: React.PointerEvent) => {
    dock.current?.querySelectorAll<HTMLElement>("[data-tile]").forEach((t) => {
      const r = t.getBoundingClientRect();
      const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
      t.style.setProperty("--s", String(1 + 0.45 * Math.max(0, 1 - d / 110)));
    });
  };
  const rest = () => dock.current?.querySelectorAll<HTMLElement>("[data-tile]").forEach((t) => t.style.removeProperty("--s"));

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <header inert={inert} className="pointer-events-none fixed inset-0 z-50">
      <a
        href="#top"
        aria-label={profile.display}
        className="pointer-events-auto absolute top-4 left-4 grid size-11 place-items-center rounded-full bg-cream font-display text-lg font-bold text-ink shadow-[0_8px_20px_-8px_rgba(0,0,0,0.6)] transition duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-rotate-12 hover:scale-110"
      >
        {profile.display[0]}
      </a>
      <nav
        ref={dock}
        aria-label="Primary"
        onPointerMove={swell}
        onPointerLeave={rest}
        className="pointer-events-auto absolute bottom-4 left-1/2 flex -translate-x-1/2 flex-row gap-2.5 md:top-1/2 md:bottom-auto md:left-4 md:translate-x-0 md:-translate-y-1/2 md:flex-col"
      >
        {LINKS.map(([label, href, icon], i) => (
          <a
            key={href}
            href={href}
            data-tile
            aria-label={label}
            aria-current={active === href ? "true" : undefined}
            className={`${TILE} aria-[current]:bg-signal aria-[current]:text-ink ${i % 2 ? "hover:rotate-6" : "hover:-rotate-6"}`}
          >
            {icon}
            <span className={TIP}>{label}</span>
          </a>
        ))}
        <button type="button" data-tile onClick={copy} aria-label="Copy email" className={`${TILE} hover:rotate-6`}>
          {MAIL}
          <span className={TIP}>{copied ? "Copied ✓" : "Say hi 👋"}</span>
        </button>
      </nav>
    </header>
  );
}
