import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { projects } from "../data/content";
import { PhoneMock, Screen } from "./ScreenArt";

interface ProjectModalProps {
  projectId: string | null;
  onClose: () => void;
  onNavigate: (id: string) => void;
}

const CLOSE_MS = 260;

export function ProjectModal({ projectId, onClose, onNavigate }: ProjectModalProps) {
  const [closing, setClosing] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const index = projects.findIndex((p) => p.id === projectId);
  const project = index >= 0 ? projects[index] : null;
  const isOpen = project !== null;

  const requestClose = useCallback(() => {
    window.clearTimeout(timer.current);
    setClosing(true);
    timer.current = window.setTimeout(() => {
      setClosing(false);
      onClose();
    }, CLOSE_MS);
  }, [onClose]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Lock page scroll and manage focus while open.
  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [isOpen]);

  // Back to the top whenever a different project is shown.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [projectId]);

  // Keyboard: Esc closes, arrows navigate, Tab stays inside the dialog.
  useEffect(() => {
    if (!isOpen) return;

    const go = (dir: 1 | -1) => {
      if (closing) return;
      const next = projects[(index + dir + projects.length) % projects.length];
      onNavigate(next.id);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        requestClose();
      } else if (e.key === "ArrowRight") {
        go(1);
      } else if (e.key === "ArrowLeft") {
        go(-1);
      } else if (e.key === "Tab") {
        const root = dialogRef.current;
        if (!root) return;
        const focusable = Array.from(
          root.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])'),
        ).filter((el) => !el.hasAttribute("disabled"));
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;

        if (!root.contains(active)) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, index, closing, onNavigate, requestClose]);

  if (!project) return null;

  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const count = String(projects.length).padStart(2, "0");

  return (
    <div
      className={`modal ${closing ? "is-closing" : ""}`.trim()}
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
    >
      <div
        ref={dialogRef}
        className="modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{ "--c1": project.colors[0], "--c2": project.colors[1] } as CSSProperties}
      >
        <button ref={closeRef} type="button" className="modal__close mono" onClick={requestClose}>
          Close ✕
        </button>

        <div ref={scrollRef} className="modal__scroll">
          <header className="modal__hero" key={`hero-${project.id}`}>
            <p className="mono modal__eyebrow">
              {String(index + 1).padStart(2, "0")} / {count} · {project.category}
            </p>
            <h2 id="modal-title" className="modal__title">
              {project.title}
            </h2>
            <p className="modal__blurb">{project.blurb}</p>
          </header>

          <div className="modal__body" key={`body-${project.id}`}>
            <dl className="modal__meta">
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

            <div className="modal__cols">
              <div>
                <h3 className="mono modal__label">Overview</h3>
                <p className="modal__overview">{project.overview}</p>
                {project.href && (
                  <a className="modal__link" href={project.href} target="_blank" rel="noreferrer">
                    Visit project ↗
                  </a>
                )}
              </div>
              <div>
                <h3 className="mono modal__label">Highlights</h3>
                <ol className="modal__highlights">
                  {project.highlights.map((text, i) => (
                    <li key={text}>
                      <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <section aria-label="Screens">
              <h3 className="mono modal__label">Screens</h3>
              <div className="modal__gallery">
                {project.gallery.map((item, i) => (
                  <figure className="shot" key={`${project.id}-${i}`} style={{ animationDelay: `${i * 90}ms` }}>
                    <PhoneMock>
                      <Screen item={item} colors={project.colors} title={project.title} />
                    </PhoneMock>
                    <figcaption className="mono">{item.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </section>
          </div>

          <nav className="modal__nav" aria-label="Other projects">
            <button type="button" onClick={() => onNavigate(prev.id)}>
              <span className="mono">← Previous</span>
              <strong>{prev.title}</strong>
            </button>
            <button type="button" onClick={() => onNavigate(next.id)}>
              <span className="mono">Next →</span>
              <strong>{next.title}</strong>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
