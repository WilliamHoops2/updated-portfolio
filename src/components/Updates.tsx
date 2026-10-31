import { tour, updates } from "../data/content";
import { Reveal } from "./Reveal";

export function Updates() {
  return (
    <section className="updates" id="updates" data-tour={tour.updates}>
      <Reveal className="section-head">
        <span className="mono">Updates</span>
        <span className="mono">{String(updates.length).padStart(2, "0")}</span>
      </Reveal>

      <Reveal as="h2" className="updates__title">
        Latest from me
      </Reveal>

      <div className="updates__grid">
        {updates.map((item, i) => {
          const inner = (
            <>
              <div className="update__top">
                <span className="mono">{item.date}</span>
                <span className="pill mono">{item.tag}</span>
              </div>
              <h3 className="update__title">{item.title}</h3>
              <span className="update__arrow" aria-hidden="true">
                →
              </span>
            </>
          );

          return (
            <Reveal key={item.title} delay={i * 100}>
              {item.href ? (
                <a className="update" href={item.href}>
                  {inner}
                </a>
              ) : (
                <div className="update">{inner}</div>
              )}
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
