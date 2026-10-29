import { profile, stack, statement } from "../data/content";
import { Reveal } from "./Reveal";

export function Hero() {
  return (
    <section className="hero" id="top">
      <p className="hero__greeting mono">
        Hi, I'm {profile.name}. {profile.greeting}
      </p>

      <h1 className="hero__title">
        {profile.titleLines.map((line, i) => (
          <span className="hero__line" key={line}>
            <span className="hero__line-inner" style={{ animationDelay: `${i * 120}ms` }}>
              {line}
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
      <Reveal as="p" className="statement__text">
        {statement.before} <em>{statement.highlight}</em> {statement.after}
      </Reveal>
    </section>
  );
}
