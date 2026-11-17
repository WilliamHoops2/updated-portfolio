import { useEffect, useRef, useState } from "react";
import type { FocusEvent, MouseEvent } from "react";
import type { Project } from "../data/content";
import { Media } from "./Media";
import { ASPECT, KINDS, KIND_LABEL, kindOf, ordered } from "./mediaShape";
import { projectVars } from "./projectStyle";
import { Reveal } from "./Reveal";
import { Roll } from "./Roll";

interface WorkListProps {
  onOpen: (id: string) => void;
  onHover: () => void;
}

export function WorkList({ onOpen, onHover }: WorkListProps) {
  const [hovering, setHovering] = useState(false);
  const [shown, setShown] = useState<Project>(ordered[0]);
  const peekRef = useRef<HTMLDivElement | null>(null);

  // The preview chases the pointer with a little lag.
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!hovering) return;
    const el = peekRef.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ease = reduce ? 1 : 0.16;
    let frame = 0;

    const tick = () => {
      const c = current.current;
      const t = target.current;
      c.x += (t.x - c.x) * ease;
      c.y += (t.y - c.y) * ease;
      el.style.transform = `translate3d(${c.x}px, ${c.y}px, 0)`;
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [hovering]);

  const handleMove = (e: MouseEvent) => {
    target.current = { x: e.clientX + 28, y: e.clientY - 150 };
    if (!hovering) current.current = { ...target.current };
  };

  const activate = (project: Project) => {
    setShown(project);
    setHovering(true);
  };

  const onRowFocus = (project: Project, e: FocusEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    target.current = { x: r.right - 340, y: r.top - 40 };
    current.current = { ...target.current };
    activate(project);
  };

  const shownKind = kindOf(shown);
  // Featured projects get big cards up top; the list below holds the rest.
  const picks = ordered.filter((p) => p.featured);
  const rest = ordered.filter((p) => !p.featured);

  return (
    <section className="work" id="work" onMouseMove={handleMove} onMouseLeave={() => setHovering(false)}>
      <Reveal as="h2" className="work__heading">
        Things I've built
      </Reveal>

      <ul className="picks">
        {picks.map((project) => (
          <li key={project.id} style={projectVars(project)}>
            <button type="button" className="pick" onClick={() => onOpen(project.id)} onMouseEnter={onHover}>
              <span className="pick__meta">
                {project.category} · {project.year}
              </span>
              <span className="pick__title">{project.title}</span>
              <span className="pick__blurb">{project.blurb}</span>
              <Media
                item={project.gallery[0]}
                projectId={project.id}
                aspect={ASPECT[kindOf(project)]}
                className="pick__media"
              />
            </button>
          </li>
        ))}
      </ul>

      <div className="work__groups">
        {KINDS.map((kind) => {
          const items = rest.filter((p) => kindOf(p) === kind);
          if (items.length === 0) return null;
          return (
            <div className="work__group" key={kind}>
              <h3 className="work__group-head">{kind === "app" && picks.length > 0 ? "More apps" : KIND_LABEL[kind]}</h3>

              <ul className="work__list">
                {items.map((project) => (
                  <li key={project.id} className="work__item" style={projectVars(project)}>
                    <button
                      type="button"
                      className="work__row"
                      onClick={() => onOpen(project.id)}
                      onMouseEnter={() => {
                        activate(project);
                        onHover();
                      }}
                      onMouseLeave={() => setHovering(false)}
                      onFocus={(e) => onRowFocus(project, e)}
                      onBlur={() => setHovering(false)}
                    >
                      <Media
                        item={{ ...project.gallery[0], video: undefined }}
                        projectId={project.id}
                        aspect="4 / 3"
                        className="work__thumb"
                      />
                      <span className="work__title">
                        <Roll>{project.title}</Roll>
                      </span>
                      <span className="work__cat mono">{project.platform}</span>
                      <span className="work__year mono">{project.year}</span>
                      <span className="work__arrow" aria-hidden="true">
                        ↗
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div
        ref={peekRef}
        className={`peek peek--${shownKind} ${hovering ? "is-active" : ""}`.trim()}
        aria-hidden="true"
        style={projectVars(shown)}
      >
        <Media item={shown.gallery[0]} projectId={shown.id} aspect={ASPECT[shownKind]} className="peek__media" />
      </div>
    </section>
  );
}
