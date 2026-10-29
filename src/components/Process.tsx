import { steps } from "../data/content";
import { Reveal } from "./Reveal";

export function Process() {
  return (
    <section className="process">
      <Reveal className="section-head">
        <span className="mono">How I work</span>
        <span className="mono">03</span>
      </Reveal>

      <div className="process__grid">
        {steps.map((step, i) => (
          <Reveal key={step.n} delay={i * 120} className="step">
            <span className="step__n mono">{step.n}</span>
            <h3 className="step__title">{step.title}.</h3>
            <p>{step.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
