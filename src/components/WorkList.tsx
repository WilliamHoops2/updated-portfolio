import { useRef, useState } from "react";
import type { MouseEvent } from "react";
import { projects } from "../data/content";
import type { Project } from "../data/content";
import { Reveal } from "./Reveal";

interface WorkListProps {
  onHover: () => void;
}

export function WorkList({ onHover }: WorkListProps) {
  const [active, setActive] = useState<Project | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  const handleMove = (e: MouseEvent) => {
    const el = previewRef.current;
    if (!el) return;
    el.style.transform = `translate3d(${e.clientX + 24}px, ${e.clientY - 90}px, 0)`;
  };

  return (
    <section className="work" id="work" onMouseMove={handleMove} onMouseLeave={() => setActive(null)}>
      <Reveal className="section-head">
        <span className="mono">All work</span>
        <span className="mono">{String(projects.length).padStart(2, "0")}</span>
      </Reveal>

      <ul className="work__list">
        {projects.map((project) => (
          <li key={project.id} id={project.id}>
            <a
              className="work__row"
              href={project.href ?? `#${project.id}`}
              onMouseEnter={() => {
                setActive(project);
                onHover();
              }}
              onFocus={() => setActive(project)}
              onBlur={() => setActive(null)}
            >
              <span className="work__cat mono">{project.category}</span>
              <span className="work__title">{project.title}</span>
              <span className="work__year mono">{project.year}</span>
            </a>
          </li>
        ))}
      </ul>

      <div
        ref={previewRef}
        className={`preview ${active ? "is-active" : ""}`}
        aria-hidden="true"
        style={{
          ["--c1" as string]: active?.colors[0] ?? "#2261e9",
          ["--c2" as string]: active?.colors[1] ?? "#7aa2ff",
        }}
      >
        <span>{active?.title}</span>
      </div>
    </section>
  );
}
