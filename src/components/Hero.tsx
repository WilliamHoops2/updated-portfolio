import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { about, facts, heroWords, profile, statement, ticker, tour } from "../data/content";
import { useScrollProgress } from "../hooks/useScrollProgress";
import { useTickerVelocity } from "../hooks/useTickerVelocity";
import { useHeroParallax } from "../hooks/useHeroParallax";
import { useHeroPointer } from "../hooks/useHeroPointer";
import { HeroBackdrop } from "./HeroBackdrop";
import { Reveal } from "./Reveal";
import { Roll } from "./Roll";

const ROW_EM = 1.15;
const SWAP_MS = 2200;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** A line of words that roll upward one at a time, looping without a visible jump. */
function Swap({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [snap, setSnap] = useState(false);

  // The first word is repeated at the end so the last roll lands on it, then we snap back to the start.
  const loop = useMemo(() => [...words, words[0]], [words]);
  const widest = useMemo(() => words.reduce((a, b) => (b.length > a.length ? b : a), ""), [words]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = window.setInterval(() => setIndex((i) => (i >= words.length ? i : i + 1)), SWAP_MS);
    return () => window.clearInterval(id);
  }, [words.length]);

  useEffect(() => {
    if (index === words.length) {
      const id = window.setTimeout(() => {
        setSnap(true);
        setIndex(0);
      }, 750);
      return () => window.clearTimeout(id);
    }

    if (snap) {
      let inner = 0;
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => setSnap(false));
      });
      return () => {
        cancelAnimationFrame(outer);
        cancelAnimationFrame(inner);
      };
    }
    return;
  }, [index, snap, words.length]);

  return (
    <span className="swap" aria-hidden="true">
      <span className="swap__sizer">{widest}</span>
      <span
        className={`swap__track ${snap ? "is-snap" : ""}`.trim()}
        style={{ transform: `translateY(${index * -ROW_EM}em)` }}
      >
        {loop.map((word, i) => (
          <span className="swap__word" key={`${word}-${i}`}>
            {word}
          </span>
        ))}
      </span>
    </span>
  );
}

interface HeroProps {
  /** False while the loader is covering the page, so the entrance waits for it. */
  ready: boolean;
  onHover: () => void;
}

export function Hero({ ready, onHover }: HeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  useHeroPointer(sectionRef, titleRef);
  useHeroParallax(sectionRef);
  const tickerRef = useRef<HTMLDivElement | null>(null);
  useTickerVelocity(tickerRef);

  return (
    <section ref={sectionRef} className={`hero ${ready ? "is-go" : ""}`.trim()} id="top" data-tone="paper">
      <HeroBackdrop containerRef={sectionRef} />
      <dl className="hero__top mono">
        <div>
          <dt>Role</dt>
          <dd>{profile.role}</dd>
        </div>
        <div>
          <dt>Based in</dt>
          <dd>{profile.location}</dd>
        </div>
        <div>
          <dt>Now</dt>
          <dd>{facts[0].value}</dd>
        </div>
        <div>
          <dt>Index</dt>
          <dd>({profile.year})</dd>
        </div>
      </dl>

      <h1 ref={titleRef} className="hero__title" aria-label={profile.display}>
        <span className="hero__mask" aria-hidden="true">
          {Array.from(profile.display).map((ch, i) => (
            <span className="hero__char" key={i} style={{ "--i": i } as CSSProperties}>
              {ch}
            </span>
          ))}
        </span>
      </h1>

      <p className="hero__line2" aria-label={`I make ${heroWords.join(", ")}`}>
        <span aria-hidden="true">I make </span>
        <Swap words={heroWords} />
      </p>

      <div className="hero__go">
        <a className="btn btn--solid" href="#work" onMouseEnter={onHover}>
          <Roll>See the work</Roll>
        </a>
        <a className="btn" href="#contact" onMouseEnter={onHover}>
          <Roll>Get in touch</Roll>
        </a>
      </div>

      <div ref={tickerRef} className="ticker" aria-hidden="true">
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

/** The statement lights up word by word as it scrolls into view. */
function ScrollWords() {
  const ref = useRef<HTMLParagraphElement | null>(null);
  useScrollProgress(ref);

  const words = [
    ...statement.before.split(" ").map((w) => ({ w, em: false })),
    ...statement.highlight.split(" ").map((w) => ({ w, em: true })),
    ...statement.after.split(" ").map((w) => ({ w, em: false })),
  ];

  const lastEm = statement.before.split(" ").length + statement.highlight.split(" ").length - 1;

  return (
    <p ref={ref} className="statement__text scrollwords" style={{ "--n": words.length } as CSSProperties}>
      {words.map(({ w, em }, i) => {
        const word = (
          <span className={i === lastEm ? "sl sl--last" : "sl"} style={{ "--i": i } as CSSProperties}>
            {w}
          </span>
        );
        return (
          <span key={i}>
            {em ? <em>{word}</em> : word}
            {i < words.length - 1 && " "}
          </span>
        );
      })}
    </p>
  );
}

export function Statement() {
  return (
    <section className="statement" data-tone="orchid" data-tour={tour.statement}>
      <div className="statement__lead">
        <span className="statement__eyebrow">01 / About</span>
        <ScrollWords />
      </div>
      <div className="statement__about">
        {about.map((paragraph, i) => (
          <Reveal as="p" key={paragraph} className={i === 0 ? "statement__intro" : ""} delay={i * 120}>
            {paragraph}
          </Reveal>
        ))}
        <dl className="statement__facts">
          {facts.map(({ label, value }, i) => (
            <Reveal as="div" key={label} delay={240 + i * 100}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
