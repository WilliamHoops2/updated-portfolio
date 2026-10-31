import { useEffect, useRef, useState } from "react";
import { about, profile, statement, ticker, tour } from "../data/content";
import { useHeroPointer } from "../hooks/useHeroPointer";
import { HeroField } from "./HeroField";
import { HeroPhones } from "./HeroPhones";
import { Reveal } from "./Reveal";
import { Roll } from "./Roll";

const VISITED_KEY = "portfolio-visited";

/** First visit gets the intro; coming back gets the "oh hi, you're back" line. */
function useGreeting(): string {
  const [text] = useState(() => {
    let returning = false;
    try {
      returning = localStorage.getItem(VISITED_KEY) === "1";
    } catch {
      /* storage unavailable */
    }
    return returning ? profile.greetingReturn : `Hi, I'm ${profile.name}. ${profile.greeting}`;
  });

  useEffect(() => {
    try {
      localStorage.setItem(VISITED_KEY, "1");
    } catch {
      /* storage unavailable */
    }
  }, []);

  return text;
}

interface HeroProps {
  onOpen: (id: string) => void;
  onHover: () => void;
}

export function Hero({ onOpen, onHover }: HeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const [ready, setReady] = useState(false);
  const greeting = useGreeting();

  // Once the intro animation has played, let letters lift above their line.
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 1500);
    return () => window.clearTimeout(id);
  }, []);

  useHeroPointer(sectionRef, titleRef);

  return (
    <section
      ref={sectionRef}
      className={`hero ${ready ? "hero--ready" : ""}`.trim()}
      id="top"
      data-tour={greeting}
    >
      <HeroField containerRef={sectionRef} />
      <HeroPhones onOpen={onOpen} onHover={onHover} />

      <p className="hero__greeting mono">{greeting}</p>
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
        <div>
          <p className="hero__tagline">{profile.tagline}</p>
          <p className="hero__role mono">
            {profile.name} · {profile.role}
          </p>
        </div>
        <p className="hero__intro">{profile.intro}</p>
      </div>

      <div className="hero__cta">
        <a className="btn btn--solid" href="#contact" onMouseEnter={onHover}>
          <Roll>Get in touch</Roll>
        </a>
        <a className="btn" href="#work" onMouseEnter={onHover}>
          <Roll>See all work</Roll>
        </a>
      </div>

      <div className="ticker" aria-hidden="true">
        <div className="ticker__track">
          {[...ticker, ...ticker].map((item, i) => (
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
    <section className="statement" data-tour={tour.statement}>
      <span className="blob blob--a" aria-hidden="true" />
      <span className="blob blob--b" aria-hidden="true" />
      <Reveal as="p" className="statement__text">
        {statement.before} <em>{statement.highlight}</em> {statement.after}
      </Reveal>
      <div className="statement__about">
        {about.map((paragraph, i) => (
          <Reveal as="p" key={paragraph} delay={i * 120}>
            {paragraph}
          </Reveal>
        ))}
      </div>
    </section>
  );
}
