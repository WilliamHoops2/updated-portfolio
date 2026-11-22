import { facts, heroWords, profile } from "../data/content";
import { lazy, Suspense } from "react";
import { useClock } from "../hooks/useClock";
import { useMedia } from "../hooks/useMedia";
import { useBadge } from "../lib/badge";
import { AsciiWave } from "./fx/AsciiWave";
import { SignalType } from "./fx/SignalType";
import StarBorder from "./rb/StarBorder";

const Lanyard = lazy(() => import("./rb/Lanyard"));

export function Hero() {
  const time = useClock(profile.timezone);
  const badge = useBadge();
  const wide = useMedia("(min-width: 768px)"); // badge beside the text instead of below it
  const large = useMedia("(min-width: 1024px)");
  return (
    <section id="top" className="relative flex min-h-svh flex-col justify-center overflow-hidden px-6 pt-28 pb-16 md:pr-12 md:pl-12 dock:pl-28 lg:flex-row lg:items-center">
      <AsciiWave className="[mask-image:linear-gradient(to_bottom,#000_55%,transparent)] opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(15,22,18,0.75),transparent_65%)]" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 pointer-events-none lg:grid-cols-12 [&_a]:pointer-events-auto">
        <div className="[text-shadow:0_2px_14px_rgba(15,22,18,0.95)] lg:col-span-7">
          <p className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-xs tracking-widest text-cream/60 uppercase">
            <span>{profile.role}</span>
            <span>{profile.location}</span>
            <span className="text-signal">{time}</span>
          </p>
          <h1 className="font-display text-[clamp(4rem,13vw,10.5rem)] leading-[0.85] font-extrabold tracking-tight text-cream" aria-label={profile.display}>
            ItsJust<span className="text-signal">W</span>
          </h1>
          <p className="mt-6 font-display text-[clamp(1.5rem,3.4vw,2.8rem)] leading-tight font-semibold text-cream">
            I make <SignalType words={heroWords} className="text-signal" />
          </p>
          <p className="mt-5 max-w-[min(16rem,62vw)] text-base min-[480px]:max-w-md lg:max-w-xl leading-relaxed text-cream/65 md:text-lg">{profile.intro}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <StarBorder as="a" href="#work" theme="dark" color="#b9f27c" radius={999} className="font-mono text-sm tracking-wider uppercase">
              See the work
            </StarBorder>
            <a href="#contact" className="rounded-full border border-cream/25 px-6 py-3.5 font-mono text-sm tracking-wider text-cream uppercase transition hover:border-signal hover:text-signal">
              Get in touch
            </a>
          </div>
          <dl className="mt-10 hidden gap-8 font-mono text-xs tracking-wider text-cream/50 uppercase md:flex">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="text-signal/80">{f.label}</dt>
                <dd className="mt-1 max-w-[16ch] normal-case">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>

      </div>
      <div className="absolute top-0 right-0 h-[min(26rem,100vw)] w-[70%] md:inset-y-0 md:h-auto md:w-[58%] lg:w-[60%]">
        {badge && (
          <Suspense fallback={null}>
            <Lanyard frontImage={badge.front} backImage={badge.back} finish="holographic" anchor="right" size={large ? 0.5 : wide ? 0.4 : 0.65} strapColor="#4e6851" metal="silver" />
          </Suspense>
        )}
      </div>
    </section>
  );
}
