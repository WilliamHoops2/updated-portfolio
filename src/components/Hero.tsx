import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { about, heroWords, profile, statement, ticker, tour } from "../data/content";
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

  return (
    <section ref={sectionRef} className={`hero ${ready ? "is-go" : ""}`.trim()} id="top">
      <HeroBackdrop containerRef={sectionRef} />
      <div className="hero__top mono">
        <span>{profile.role}</span>
        <span>{profile.location}</span>
      </div>

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
