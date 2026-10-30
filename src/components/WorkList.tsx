import { useRef, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import { projects } from "../data/content";
import type { Project } from "../data/content";
import { Reveal } from "./Reveal";
import { PhoneMock, Screen } from "./ScreenArt";

interface WorkListProps {
  onOpen: (id: string) => void;
  onHover: () => void;
}

export function WorkList({ onOpen, onHover }: WorkListProps) {
  const [hovering, setHovering] = useState(false);
  const [shown, setShown] = useState<Project>(projects[0]);
  const previewRef = useRef<HTMLDivElement | null>(null);

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
    <section className="work" id="work" onMouseMove={handleMove} onMouseLeave={() => setHovering(false)}>
      <Reveal className="section-head">
        <span className="mono">All work</span>
        <span className="mono">{String(projects.length).padStart(2, "0")}</span>
      </Reveal>

      <ul className="work__list">
        {projects.map((project) => (
          <li key={project.id}>
            <button
              type="button"
              className="work__row"
              onClick={() => onOpen(project.id)}
              onMouseEnter={() => {
                activate(project);
                onHover();
              }}
              onFocus={() => activate(project)}
              onBlur={() => setHovering(false)}
            >
              <span className="work__cat mono">{project.category}</span>
              <span className="work__title">{project.title}</span>
              <span className="work__year mono">{project.year}</span>
            </button>
          </li>
        ))}
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
