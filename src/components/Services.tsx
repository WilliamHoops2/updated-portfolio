import { services, steps } from "../data/content";
import { Eyebrow } from "./Eyebrow";
import { CardSpread } from "./fx/CardSpread";
import Grainient from "./rb/Grainient";

export function Services() {
  return (
    <section id="services" className="relative overflow-hidden px-6 py-14 md:pr-12 md:pl-12 dock:pl-28 md:py-16">
      <Grainient className="pointer-events-none absolute inset-0 -z-0 opacity-30 [mask-image:linear-gradient(to_bottom,transparent,#000_25%,#000_75%,transparent)]" colors={["#0f1612", "#22352a", "#4e6851"]} speed={0.12} grainAmount={0.1} aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl">
        <Eyebrow>05 / Services</Eyebrow>
        <h2 className="mb-14 font-display text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.95] font-extrabold tracking-tight text-cream">
          How I can <span className="text-signal">help</span>
        </h2>

        <CardSpread
          cards={services.map((s, i) => (
            <div className="flex h-full flex-col">
              <p className="font-mono text-xs tracking-widest text-signal uppercase">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-3 font-display text-3xl font-bold text-cream">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-cream/70">{s.text}</p>
              <p className="mt-auto pt-6 font-mono text-[11px] tracking-wider text-cream/50 uppercase">{s.tags.join(" · ")}</p>
            </div>
          ))}
        />

        <ol className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-cream/15 bg-cream/15 md:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="bg-ink p-6">
              <p className="font-mono text-xs tracking-widest text-signal uppercase">
                {s.n} · {s.aside}
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold text-cream">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/65">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
