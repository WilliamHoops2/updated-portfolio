import { useEffect, useRef, useState } from "react";
import { profile, stack, statement } from "../data/content";
import { useHeroPointer } from "../hooks/useHeroPointer";
import { HeroField } from "./HeroField";
import { HeroPhones } from "./HeroPhones";
import { Reveal } from "./Reveal";

interface HeroProps {
  onOpen: (id: string) => void;
  onHover: () => void;
}

export function Hero({ onOpen, onHover }: HeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const [ready, setReady] = useState(false);

  // Once the intro animation has played, let letters lift above their line.
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 1500);
    return () => window.clearTimeout(id);
  }, []);

  useHeroPointer(sectionRef, titleRef);

  return (
    <section ref={sectionRef} className={`hero ${ready ? "hero--ready" : ""}`.trim()} id="top">
      <HeroField containerRef={sectionRef} />
      <HeroPhones onOpen={onOpen} onHover={onHover} />

      <p className="hero__greeting mono">
        Hi, I'm {profile.name}. {profile.greeting}
      </p>
      <p className="hero__hint mono">↳ {profile.hint}</p>

      <h1 ref={titleRef} className="hero__title" aria-label={profile.titleLines.join(" ")}>
        {profile.titleLines.map((line, i) => (
          <span className="hero__line" key={line} aria-hidden="true">
            <span className="hero__line-inner" style={{ animationDelay: `${i * 120}ms` }}>
              {Array.from(line).map((ch, j) => (
                <span className="hero__char" key={j}>
                  {ch === " " ? "\u00A0" : ch}
                </span>
              ))}
            </span>
          </span>
        ))}
      </h1>

      <div className="hero__meta">
        <p className="hero__tagline">{profile.tagline}</p>
        <p className="hero__intro">{profile.intro}</p>
      </div>

      <div className="ticker" aria-hidden="true">
        <div className="ticker__track">
          {[...stack, ...stack].map((item, i) => (
            <span className="ticker__item" key={`${item}-${i}`}>
              {item}
              <i />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Statement() {
  return (
    <section className="statement">
      <span className="blob blob--a" aria-hidden="true" />
      <span className="blob blob--b" aria-hidden="true" />
      <Reveal as="p" className="statement__text">
        {statement.before} <em>{statement.highlight}</em> {statement.after}
      </Reveal>
    </section>
  );
}
