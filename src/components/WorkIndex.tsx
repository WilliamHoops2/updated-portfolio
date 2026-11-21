import { useRef, useState } from "react";
import type { PointerEvent } from "react";
import { useScrollProgress } from "../hooks/useScrollProgress";
import { useInView } from "../hooks/useInView";
import { Media } from "./Media";
import { ASPECT, KINDS, KIND_LABEL, kindOf, ordered } from "./mediaShape";
import { projectVars } from "./projectStyle";
import { Reveal } from "./Reveal";
import { Roll } from "./Roll";
import { SplitText } from "./SplitText";

interface WorkIndexProps {
  onOpen: (id: string) => void;
  onHover: () => void;
}

type Filter = "all" | (typeof KINDS)[number];

const two = (n: number) => String(n).padStart(2, "0");

/**
 * An index of every project beside one sticky stage. Hover or focus a row and the stage swaps to
 * that project; click opens it. On narrow screens the stage is hidden and each row shows a thumbnail.
 */
export function WorkIndex({ onOpen, onHover }: WorkIndexProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  useScrollProgress(sectionRef);
  const [filter, setFilter] = useState<Filter>("all");
  const [activeId, setActiveId] = useState(ordered[0].id);

  const list = filter === "all" ? ordered : ordered.filter((p) => kindOf(p) === filter);
  // The active project can fall out of the list when the filter changes; fall back to the first row.
  const active = list.find((p) => p.id === activeId) ?? list[0];
  const activeKind = kindOf(active);

  const { ref: stageRef, inView: stageLive } = useInView<HTMLElement>(0.1);
  const tiltStage = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--ry", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
    e.currentTarget.style.setProperty("--rx", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
  };
  const levelStage = (e: PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty("--rx", "0");
    e.currentTarget.style.setProperty("--ry", "0");
  };

  const counts = (kind: Filter) => (kind === "all" ? ordered.length : ordered.filter((p) => kindOf(p) === kind).length);

  return (
    <section ref={sectionRef} className="work wx" id="work">
      <p className="eyebrow mono">02 / Work</p>
      <Reveal as="h2" className="work__heading reveal--split">
        <SplitText text="Things I've built" />
      </Reveal>

      <div className="wx__filters mono" role="group" aria-label="Filter projects">
        {(["all", ...KINDS] as const).map((f) => (
          <button
            key={f}
            type="button"
            className={f === filter ? "is-on" : ""}
            aria-pressed={f === filter}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All" : KIND_LABEL[f]} <sup>{counts(f)}</sup>
          </button>
        ))}
      </div>

      <div className="wx__body">
        <ul className="wx__list">
          {list.map((project, i) => (
            <li key={project.id} style={projectVars(project)}>
              <button
                type="button"
                className={`wx__row ${project.id === active.id ? "is-active" : ""}`.trim()}
                onClick={() => onOpen(project.id)}
                onMouseEnter={() => {
                  setActiveId(project.id);
                  onHover();
                }}
                onFocus={() => setActiveId(project.id)}
              >
                <span className="wx__num mono">{two(i + 1)}</span>
                <Media
                  item={{ ...project.gallery[0], video: undefined }}
                  projectId={project.id}
                  aspect="4 / 3"
                  className="wx__thumb"
                />
                <span className="wx__title">
                  <Roll>{project.title}</Roll>
                </span>
                <span className="wx__meta mono">
                  {project.featured && <em>Selected</em>}
                  {project.platform} · {project.year}
                </span>
                <span className="wx__arrow" aria-hidden="true">
                  ↗
                </span>
              </button>
            </li>
          ))}
        </ul>

        <aside
          ref={stageRef}
          className={`wx__stage ${stageLive ? "is-live" : ""}`.trim()}
          style={projectVars(active)}
          aria-live="polite"
          onPointerMove={tiltStage}
          onPointerLeave={levelStage}
        >
          <div className="wx__wash" key={active.id}>
            <div className="wx__head">
              <h3 className="wx__name">{active.title}</h3>
              <span className="wx__year mono">({active.year})</span>
            </div>
            <div className={`wx__frame wx__frame--${activeKind}`}>
              <Media item={active.gallery[0]} projectId={active.id} aspect={ASPECT[activeKind]} />
            </div>
            <div className="wx__info">
              <dl className="wx__facts mono">
                <div>
                  <dt>Role</dt>
                  <dd>{active.role}</dd>
                </div>
                <div>
                  <dt>Platform</dt>
                  <dd>{active.platform}</dd>
                </div>
                <div>
                  <dt>Type</dt>
                  <dd>{active.category}</dd>
                </div>
              </dl>
              <p className="wx__blurb">{active.blurb}</p>
              <button type="button" className="btn btn--light" onClick={() => onOpen(active.id)}>
                <Roll>View project</Roll>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
