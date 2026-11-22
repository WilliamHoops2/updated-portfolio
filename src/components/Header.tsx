import { useEffect, useState, type PointerEvent, type FocusEvent } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Briefcase01Icon, Film01Icon, GameController01Icon, Mail01Icon, UserIcon, Layers01Icon } from "@hugeicons/core-free-icons";
import { profile } from "../data/content";
import GlassIcons from "./rb/GlassIcons";

const LINKS = [
  ["About", "#about", UserIcon],
  ["Work", "#work", Briefcase01Icon],
  ["Reel", "#reel", Film01Icon],
  ["Services", "#services", Layers01Icon],
  ["Play", "#interests", GameController01Icon],
] as const;

const CREAM = "#e9dcc0";
const SIGNAL = "#b9f27c";
const MAIL = "Say hi";

/** Glass dock nav: a logo bubble plus glass icon tiles, vertical on desktop and a row along the bottom on phones. */
export function Header({ inert }: { inert?: boolean }) {
  const [copied, setCopied] = useState(false);
  const [active, setActive] = useState("");
  const [tip, setTip] = useState({ label: "", x: 0, y: 0, show: false });
  const [wide, setWide] = useState(() => window.matchMedia("(min-width: 768px) and (min-height: 520px)").matches);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (min-height: 520px)");
    const on = () => setWide(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

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

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  // Glass bubble over the hovered tile: found by event delegation, since GlassIcons owns the tiles.
  const point = (e: PointerEvent | FocusEvent) => {
    if ("pointerType" in e && e.pointerType === "touch") return;
    const tile = (e.target as HTMLElement).closest<HTMLElement>("[data-glass-icon]");
    if (!tile) return;
    const r = tile.getBoundingClientRect();
    setTip({ label: tile.getAttribute("aria-label") ?? "", x: wide ? r.right + 12 : r.left + r.width / 2, y: wide ? r.top + r.height / 2 : r.top - 12, show: true });
  };
  const leave = () => setTip((t) => ({ ...t, show: false }));

  const items = [
    ...LINKS.map(([label, href, icon]) => ({
      label,
      href,
      icon: <HugeiconsIcon icon={icon} color={active === href ? SIGNAL : CREAM} />,
    })),
    { icon: <HugeiconsIcon icon={Mail01Icon} color={copied ? SIGNAL : CREAM} />, label: MAIL, onClick: copy },
  ];

  return (
    <header inert={inert} className="pointer-events-none fixed inset-0 z-50">
      <a
        href="#top"
        aria-label={profile.display}
        className="pointer-events-auto absolute top-4 left-4 group relative isolate block size-12 overflow-hidden rounded-full [-webkit-mask-image:-webkit-radial-gradient(white,black)] bg-cream shadow-[0_8px_20px_-8px_rgba(0,0,0,0.6)] transition duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-rotate-12 hover:scale-110"
      >
        <img src={`${import.meta.env.BASE_URL}about/logo.jpg`} alt="" className="size-full rounded-full object-cover" />
        <img src={`${import.meta.env.BASE_URL}about/logo-hover.jpg`} alt="" className="absolute inset-0 size-full rounded-full object-cover opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100" />
      </a>
      <nav
        aria-label="Primary"
        onPointerOver={point}
        onPointerOut={leave}
        onFocus={point}
        onBlur={leave}
        className="pointer-events-auto absolute bottom-4 left-1/2 w-max max-w-[calc(100vw-1rem)] -translate-x-1/2 dock:top-1/2 dock:bottom-auto dock:left-4 dock:translate-x-0 dock:-translate-y-1/2"
      >
        <GlassIcons
          items={items}
          size={wide ? 56 : 40}
          gap={wide ? 16 : 10}
          columns={wide ? 1 : items.length}
          roundness={0.6}
          refraction={0.8}
          bevel={0.6}
          dispersion={0}
          frost={0.2}
          shine={0.85}
          tint="#dfdfdf"
          tintOpacity={0.2}
          iconColor={CREAM}
          plate="none"
          hover="press"
          parallax={1}
          labels="none"
          intro
          theme="dark"
        />
      </nav>
      <span
        aria-hidden
        style={{ left: tip.x, top: tip.y, translate: wide ? "0 -50%" : "-50% -100%" }}
        className={`absolute rounded-full bg-cream/10 px-3.5 py-1.5 font-mono text-[11px] tracking-wider whitespace-nowrap text-cream uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_8px_20px_-8px_rgba(0,0,0,0.6)] ring-1 ring-cream/15 backdrop-blur-2xl backdrop-saturate-[1.8] transition duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${wide ? "origin-left" : "origin-bottom"} ${tip.show ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}
      >
        {tip.label === MAIL && copied ? "Copied ✓" : tip.label}
      </span>
    </header>
  );
}
