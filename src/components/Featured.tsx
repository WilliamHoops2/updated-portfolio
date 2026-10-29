import { projects } from "../data/content";
import { Reveal } from "./Reveal";

interface FeaturedProps {
  onHover: () => void;
}

export function Featured({ onHover }: FeaturedProps) {
  const featured = projects.filter((p) => p.featured);

  return (
    <section className="featured">
      <Reveal className="section-head">
        <span className="mono">Selected work</span>
        <span className="mono">{String(featured.length).padStart(2, "0")}</span>
      </Reveal>

      <div className="featured__grid">
        {featured.map((project, i) => (
          <Reveal key={project.id} delay={i * 100}>
            <a
              className="card"
              href={project.href ?? `#${project.id}`}
              onMouseEnter={onHover}
              style={{
                ["--c1" as string]: project.colors[0],
                ["--c2" as string]: project.colors[1],
              }}
            >
              <div className="card__cover">
                <span className="card__index mono">{String(i + 1).padStart(2, "0")}</span>
                <span className="card__name">{project.title}</span>
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
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
