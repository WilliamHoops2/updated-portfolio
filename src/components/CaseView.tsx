import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import type { Project } from "../data/content";
import { Media } from "./Media";
import { ASPECT, kindOf, ordered } from "./mediaShape";
import { projectVars } from "./projectStyle";
import { Roll } from "./Roll";

interface CaseViewProps {
  project: Project;
  onClose: () => void;
  onGo: (id: string) => void;
}

/** Full-screen view of one project, in that project's own colour. */
export function CaseView({ project, onClose, onGo }: CaseViewProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const position = ordered.indexOf(project);
  const prev = ordered[(position - 1 + ordered.length) % ordered.length];
  const next = ordered[(position + 1) % ordered.length];
  const kind = kindOf(project);

  // Move focus in on open, and hand it back to whatever opened the view when it closes.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => opener?.focus?.();
  }, []);

  // Each project starts at the top.
  useEffect(() => {
    rootRef.current?.scrollTo({ top: 0 });
  }, [project.id]);

  // Keep the page still underneath. Esc closes, arrow keys move between projects.
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onGo(next.id);
      if (e.key === "ArrowLeft") onGo(prev.id);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, onGo, next.id, prev.id]);

  return (
    <div
      ref={rootRef}
      className="case"
      role="dialog"
      data-lenis-prevent
      aria-modal="true"
      aria-label={`${project.title}, project details`}
      style={projectVars(project)}
    >
      <div className="case__bar mono">
        <div className="case__nav">
          <button type="button" onClick={() => onGo(prev.id)}>
            <Roll>← Prev</Roll>
          </button>
          <button type="button" onClick={() => onGo(next.id)}>
            <Roll>Next →</Roll>
          </button>
        </div>
        <button type="button" ref={closeRef} onClick={onClose}>
          <Roll>Close ✕</Roll>
        </button>
      </div>

      <div className="case__body" key={project.id}>
        <p className="case__kicker mono">
          {project.category} · {project.year}
        </p>
        <h2 className="case__title" style={{ "--len": Math.max(project.title.length, 6) } as CSSProperties}>
          {project.title}
        </h2>

        <div className="case__intro">
          <p className="case__blurb">{project.blurb}</p>
          <div>
            <p className="case__overview">{project.overview}</p>
            <p className="case__meta">
              {[...new Set([project.role, project.platform, ...project.tags])].join(" · ")}
            </p>
            {project.href && (
              <a className="btn case__link" href={project.href} target="_blank" rel="noreferrer">
                <Roll>Visit project ↗</Roll>
              </a>
            )}
          </div>
        </div>

        <div className={`case__media case__media--${kind}`}>
          {project.gallery.map((item, i) => (
            <figure className="case__shot" key={`${project.id}-${i}`}>
              <Media item={item} projectId={project.id} aspect={ASPECT[kind]} />
              <figcaption className="mono">{item.caption}</figcaption>
            </figure>
          ))}
        </div>

        <p className="case__label mono">Highlights</p>
        <ul className="case__highlights">
          {project.highlights.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>

        <button type="button" className="case__next" onClick={() => onGo(next.id)}>
          <span className="mono">Next project</span>
          <span className="case__next-title">{next.title} →</span>
        </button>
      </div>
    </div>
  );
}
