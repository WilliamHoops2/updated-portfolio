import { about, statement } from "../data/content";
import { useBadge } from "../lib/badge";
import { Eyebrow } from "./Eyebrow";
import { OrbitalType } from "./fx/OrbitalType";
import { TileReveal } from "./fx/TileReveal";
import HoloCard from "./rb/HoloCard";

export function About() {
  const badge = useBadge();
  return (
    <div id="about">
      <TileReveal
        cover={
          <p className="font-display text-[clamp(3rem,10vw,9rem)] leading-none font-extrabold tracking-tight text-cream">
            Hello<span className="text-signal">.</span>
          </p>
        }
      >
        <div className="flex h-full items-center bg-ink px-6 md:px-12">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Eyebrow>01 / About</Eyebrow>
              <h2 className="font-display text-[clamp(2.2rem,5.6vw,5.4rem)] leading-[0.95] font-extrabold tracking-tight text-cream">
                {statement.before} <span className="text-signal">{statement.highlight}</span> {statement.after}
              </h2>
              <div className="mt-6 max-w-xl space-y-4 text-sm leading-relaxed text-cream/70 md:text-base">
                {about.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
            <div className="hidden justify-center lg:col-span-5 lg:flex">
              <OrbitalType text="Tap the card to flip it ✦ Tilt it to catch the light ✦ " className="w-[min(30vw,24rem)]">
                {badge && (
                  <HoloCard image={badge.front} backImage={badge.back} alt="William's badge. Tap to flip." preset="shards" intensity={0.3} edgeSparkle={0.25} glare={0.3} width={250} />
                )}
              </OrbitalType>
            </div>
          </div>
        </div>
      </TileReveal>
    </div>
  );
}
