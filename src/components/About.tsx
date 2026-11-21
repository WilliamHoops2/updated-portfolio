import { about, path, profile, toolkit, tour } from "../data/content";
import { ScrollWords } from "./Hero";
import { Reveal } from "./Reveal";
import { Roll } from "./Roll";

export function About() {
  return (
    <section className="about" id="about" data-tour={tour.statement}>
      <p className="eyebrow mono">01 / About</p>

      <div className="about__grid">
        <Reveal as="figure" className="about__photo">
          <img
            src="/about/william.jpg"
            alt="William standing in front of the Apple Developer Academy sign"
            width={1200}
            height={1600}
            loading="lazy"
          />
          <figcaption className="about__tag mono">
            {profile.location} · {profile.timezoneLabel}
          </figcaption>
        </Reveal>

        <div className="about__copy">
          <ScrollWords />
          {about.map((paragraph, i) => (
            <Reveal as="p" key={paragraph} className={i === 0 ? "about__lead" : "about__more"} delay={i * 120}>
              {paragraph}
            </Reveal>
          ))}
          <Reveal className="about__go" delay={240}>
            <a className="btn btn--solid" href="#work">
              <Roll>See the work</Roll>
            </a>
            <a className="btn" href="#contact">
              <Roll>Get in touch</Roll>
            </a>
          </Reveal>
        </div>
      </div>

      <div className="about__lower">
        <Reveal>
          <h2 className="about__label mono">Path</h2>
          <ol className="path">
            {path.map((step) => (
              <li key={step.when + step.title}>
                <span className="path__when mono">{step.when}</span>
                <span className="path__title">{step.title}</span>
                <span className="path__text">{step.text}</span>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={120}>
          <h2 className="about__label mono">Toolkit</h2>
          <dl className="toolkit">
            {toolkit.map((group) => (
              <div key={group.label}>
                <dt className="mono">{group.label}</dt>
                <dd>
                  {group.items.map((item) => (
                    <span className="chip" key={item}>
                      {item}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
