import { useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import { projects, tour } from "../data/content";
import type { Project } from "../data/content";
import { Reveal } from "./Reveal";
import { PhoneMock, Screen } from "./ScreenArt";

interface WorkListProps {
  openId: string | null;
  /** Bumps every time something asks to open a project, so we can scroll to it again. */
  scrollTick: number;
  onToggle: (id: string) => void;
  onClose: () => void;
  onHover: () => void;
}

export function WorkList({ openId, scrollTick, onToggle, onClose, onHover }: WorkListProps) {
  const [hovering, setHovering] = useState(false);
  const [shown, setShown] = useState<Project>(projects[0]);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const previousOpen = useRef<string | null>(null);

  // Bring the opened project into view. If another one was open, wait for it to fold up first.
  useEffect(() => {
    if (!openId) {
      previousOpen.current = null;
      return;
    }
    const delay = previousOpen.current && previousOpen.current !== openId ? 650 : 120;
    previousOpen.current = openId;

    const id = window.setTimeout(() => {
      document.getElementById(`work-${openId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, delay);
    return () => window.clearTimeout(id);
  }, [openId, scrollTick]);

  // Esc folds the open project back up.
  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId, onClose]);

  const handleMove = (e: MouseEvent) => {
    const el = previewRef.current;
    if (!el) return;
    el.style.transform = `translate3d(${e.clientX + 24}px, ${e.clientY - 90}px, 0)`;
  };

  const activate = (project: Project) => {
    setShown(project);
    setHovering(true);
  };

  return (
    <section
      className="work"
      id="work"
      data-tour={tour.work}
      onMouseMove={handleMove}
      onMouseLeave={() => setHovering(false)}
    >
      <Reveal className="section-head">
        <span className="mono">All work</span>
        <span className="mono">{projects.length} projects</span>
      </Reveal>

      <ul className="work__list">
        {projects.map((project) => {
          const open = openId === project.id;
          return (
            <li
              key={project.id}
              id={`work-${project.id}`}
              className={`work__item ${open ? "is-open" : ""}`.trim()}
              style={{ "--c1": project.colors[0], "--c2": project.colors[1] } as CSSProperties}
            >
              <button
                type="button"
                className="work__row"
                aria-expanded={open}
                aria-controls={`panel-${project.id}`}
                onClick={() => onToggle(project.id)}
                onMouseEnter={() => {
                  activate(project);
                  onHover();
                }}
                onMouseLeave={() => setHovering(false)}
                onFocus={() => activate(project)}
                onBlur={() => setHovering(false)}
              >
                <span className="work__cat mono">{project.category}</span>
                <span className="work__title">{project.title}</span>
                <span className="work__year mono">{project.year}</span>
                <span className="work__icon" aria-hidden="true" />
              </button>

              <div
                className="panel"
                id={`panel-${project.id}`}
                role="region"
                aria-label={`${project.title} details`}
                inert={!open}
              >
                <div className="panel__inner">
                  <div className="panel__content">
                    <div className="panel__grid">
                      <div>
                        <p className="panel__blurb">{project.blurb}</p>
                        <p className="panel__overview">{project.overview}</p>

                        <dl className="panel__meta">
                          <div>
                            <dt className="mono">Role</dt>
                            <dd>{project.role}</dd>
                          </div>
                          <div>
                            <dt className="mono">Platform</dt>
                            <dd>{project.platform}</dd>
                          </div>
                          <div>
                            <dt className="mono">Year</dt>
                            <dd>{project.year}</dd>
                          </div>
                          <div>
                            <dt className="mono">Built with</dt>
                            <dd>{project.tags.join(", ")}</dd>
                          </div>
                        </dl>

                        {project.href && (
                          <a className="btn btn--solid panel__link" href={project.href} target="_blank" rel="noreferrer">
                            Visit project ↗
                          </a>
                        )}
                      </div>

                      <div>
                        <h3 className="mono panel__label">Highlights</h3>
                        <ol className="panel__highlights">
                          {project.highlights.map((text, i) => (
                            <li key={text}>
                              <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                              <span>{text}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>

                    <div className="panel__gallery">
                      <div className="panel__shots">
                        {project.gallery.map((item, i) => (
                          <figure className="shot" key={`${project.id}-${i}`}>
                            <PhoneMock>
                              <Screen item={item} colors={project.colors} title={project.title} />
                            </PhoneMock>
                            <figcaption className="mono">{item.caption}</figcaption>
                          </figure>
                        ))}
                      </div>
                    </div>

                    <button type="button" className="panel__close mono" onClick={onClose}>
                      Close ↑
                    </button>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div
        ref={previewRef}
        className={`preview ${hovering ? "is-active" : ""}`.trim()}
        aria-hidden="true"
        style={{ "--c1": shown.colors[0], "--c2": shown.colors[1] } as CSSProperties}
      >
        <span className="preview__title">{shown.title}</span>
        <div className="preview__phone">
          <PhoneMock>
            <Screen item={shown.gallery[0]} colors={shown.colors} title={shown.title} />
          </PhoneMock>
        </div>
      </div>
    </section>
  );
}
