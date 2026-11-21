import { path, toolkit, heroWords, ticker } from "../data/content";
import { Eyebrow } from "./Eyebrow";
import { TypeWall } from "./fx/TypeWall";
import SpotlightCard from "./rb/SpotlightCard";

const WORDS = [...new Set([...toolkit.flatMap((g) => g.items), ...ticker.map((t) => t.label), ...heroWords])];
const rows = [0, 1, 2].map((r) => WORDS.filter((_, i) => i % 3 === r));

/** The path as four cards, and the toolkit as a wall of type. */
export function Toolkit() {
  return (
    <section id="path" className="relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <Eyebrow>02 / Path</Eyebrow>
        <h2 className="mb-12 font-display text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.95] font-extrabold tracking-tight text-cream">
          From the web to <span className="text-signal">SwiftUI</span>
        </h2>
        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {path.map((step) => (
            <li key={step.title}>
              <SpotlightCard theme="dark" spotlightColor="rgba(185,242,124,0.22)" className="h-full">
                <p className="font-mono text-xs tracking-widest text-signal uppercase">{step.when}</p>
                <h3 className="mt-3 font-display text-2xl font-bold text-cream">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/65">{step.text}</p>
              </SpotlightCard>
            </li>
          ))}
        </ol>
      </div>
      <p className="sr-only">Toolkit: {WORDS.join(", ")}</p>
      <TypeWall rows={rows} className="mt-20 [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]" />
    </section>
  );
}
