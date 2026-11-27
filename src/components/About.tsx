import { about, statement } from "../data/content";
import { useMedia } from "../hooks/useMedia";
import { Eyebrow } from "./Eyebrow";
import { OrbitalType } from "./fx/OrbitalType";
import { TileReveal } from "./fx/TileReveal";
import HoloCard from "./rb/HoloCard";

export function About() {
  const xl = useMedia("(min-width: 1280px)");
  return (
    <div id="about">
      <TileReveal
        cover={
          <p className="font-display text-[clamp(3rem,10vw,9rem)] leading-none font-extrabold tracking-tight text-cream">
            Hello<span className="text-signal">.</span>
          </p>
        }
      >
        <div className="flex h-full items-center bg-ink px-6 md:pr-12 md:pl-12 dock:pl-28">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Eyebrow>01 / About</Eyebrow>
              <h2 className="font-display text-[clamp(2.6rem,6.4vw,6.4rem)] leading-[0.95] font-extrabold tracking-tight text-cream">
                {statement.before} <span className="text-signal">{statement.highlight}</span> {statement.after}
              </h2>
              <div className="mt-8 max-w-2xl space-y-5 text-base leading-relaxed text-cream/85 md:text-lg xl:text-xl">
                {about.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
            <div className="hidden justify-center lg:col-span-5 lg:flex">
              <OrbitalType text="Tilt it to catch the light ✦ Tilt it to catch the light ✦ " className="w-[min(40vw,32rem)]">
                <HoloCard image={`${import.meta.env.BASE_URL}about/about.jpg`} alt="William standing in front of a volcanic lake at sunrise." preset="shards" intensity={0.3} edgeSparkle={0.25} glare={0.3} width={xl ? 330 : 270} />
              </OrbitalType>
            </div>
          </div>
        </div>
      </TileReveal>
    </div>
  );
}
