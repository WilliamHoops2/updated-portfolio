import { profile } from "../data/content";

export function Footer({ inert }: { inert?: boolean }) {
  return (
    <footer inert={inert} className="border-t border-cream/10 px-6 py-6 md:px-12">
      <div className="mx-auto flex max-w-7xl items-center justify-between font-mono text-xs tracking-wider text-cream/50 uppercase">
        <span>
          © {profile.year} {profile.name} · {profile.place.join(", ")}
        </span>
        <a href="#top" className="transition hover:text-signal">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
