import { services, steps } from "../data/content";
import { Reveal } from "./Reveal";
import { Roll } from "./Roll";
import { SplitText } from "./SplitText";

export function Services() {
  return (
    <section className="services" id="services">
      <p className="eyebrow mono">03 / Services</p>
      <Reveal as="h2" className="services__heading reveal--split">
        <SplitText text="How I can help" />
      </Reveal>

      <ul className="services__list">
        {services.map((service, i) => (
          <Reveal as="li" key={service.title} delay={i * 100} className="service">
            <span className="service__num mono">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="service__title">{service.title}</h3>
            <p className="service__text">{service.text}</p>
            <span className="service__tags mono">{service.tags.join(" · ")}</span>
          </Reveal>
        ))}
      </ul>

      <h3 className="services__sub mono">How I work</h3>
      <ol className="how">
        {steps.map((step, i) => (
          <Reveal as="li" key={step.n} delay={i * 100} className="how__step">
            <span className="mono">
              {step.n} · {step.aside}
            </span>
            <strong>{step.title}</strong>
            <p>{step.text}</p>
          </Reveal>
        ))}
      </ol>

      <a className="btn btn--solid services__cta" href="#contact">
        <Roll>Start a project</Roll>
        <span aria-hidden="true">→</span>
      </a>
    </section>
  );
}
