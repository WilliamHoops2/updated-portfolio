import type { ReactNode } from "react";
import { steps, tour } from "../data/content";
import { Reveal } from "./Reveal";
import { Roll } from "./Roll";

const icons: ReactNode[] = [
  // Pencil
  <svg key="sketch" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19l-4 1z" />
    <path d="M14.5 6.5l3 3" />
  </svg>,
  // Code brackets
  <svg key="build" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 7l-5 5 5 5" />
    <path d="M16 7l5 5-5 5" />
    <path d="M14 4l-4 16" />
  </svg>,
  // Rocket
  <svg key="ship" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 4c3.5 0 6 2.5 6 6-3 3.2-6 5.2-9 6l-3-3c.8-3 2.8-6 6-9z" />
    <circle cx="15" cy="9" r="1.4" />
    <path d="M7.5 15.5L4 20l4.5-3.5" />
    <path d="M8 8.5L5 9.5" />
    <path d="M14.5 16L13.5 19" />
  </svg>,
];

export function Process() {
  return (
    <section className="process" id="process" data-tour={tour.process}>
      <Reveal className="section-head">
        <span className="mono">Process</span>
        <span className="mono">03</span>
      </Reveal>

      <Reveal as="h2" className="process__title">
        Sketch. <em>Build.</em> Ship.
      </Reveal>

      <div className="process__grid">
        {steps.map((step, i) => (
          <Reveal key={step.n} delay={i * 120} className="step">
            <div className="step__top">
              <span className="step__n mono">
                {step.n} · {step.aside}
              </span>
              <span className="step__icon" aria-hidden="true">
                {icons[i]}
              </span>
            </div>
            <h3 className="step__title">{step.title}</h3>
            <p>{step.text}</p>
          </Reveal>
        ))}
      </div>

      <Reveal className="process__cta">
        <a className="btn btn--light" href="#contact">
          <Roll>Start a project</Roll>
          <span aria-hidden="true">→</span>
        </a>
      </Reveal>
    </section>
  );
}
