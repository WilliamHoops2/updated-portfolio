import type { CSSProperties } from "react";
import { projects } from "../data/content";
import { Reveal } from "./Reveal";
import { PhoneMock, Screen } from "./ScreenArt";

interface FeaturedProps {
  onOpen: (id: string) => void;
  onHover: () => void;
}

/** Three featured projects as cards. Clicking one opens it in the "All work" list below. */
export function Featured({ onOpen, onHover }: FeaturedProps) {
  const featured = projects.filter((p) => p.featured);

  return (
    <section className="featured" aria-label="Selected work">
      <Reveal className="section-head">
        <span className="mono">Selected work</span>
        <span className="mono">{String(featured.length).padStart(2, "0")}</span>
      </Reveal>

      <div className="featured__grid">
        {featured.map((project, i) => (
          <Reveal key={project.id} delay={i * 100}>
            <article
              className="card"
              onMouseEnter={onHover}
              style={{ "--c1": project.colors[0], "--c2": project.colors[1] } as CSSProperties}
            >
              <button
                type="button"
                className="card__hit"
                aria-label={`Open ${project.title}`}
                onClick={() => onOpen(project.id)}
              />
              <div className="card__cover">
                <span className="card__index mono">{String(i + 1).padStart(2, "0")}</span>
                <span className="card__name">{project.title}</span>
                <div className="card__phone">
                  <PhoneMock>
                    <Screen item={project.gallery[0]} colors={project.colors} title={project.title} />
                  </PhoneMock>
                </div>
              </div>
              <div className="card__body">
                <div className="card__row">
                  <h3>{project.title}</h3>
                  <span className="mono">{project.year}</span>
                </div>
                <p>{project.blurb}</p>
                <ul className="tags">
                  {project.tags.map((tag) => (
                    <li key={tag} className="mono">
                      {tag}
                    </li>
                  ))}
                </ul>
                <span className="card__cta mono">
                  View project <i>↓</i>
                </span>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
