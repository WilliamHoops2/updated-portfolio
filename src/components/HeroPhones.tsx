import { projects } from "../data/content";
import { PhoneMock, Screen } from "./ScreenArt";

interface HeroPhonesProps {
  onOpen: (id: string) => void;
  onHover: () => void;
}

/** Three floating phones that tilt with the cursor. Click one to open that project. */
export function HeroPhones({ onOpen, onHover }: HeroPhonesProps) {
  const picks = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <div className="hero__phones">
      {picks.map((project, i) => (
        <button
          key={project.id}
          type="button"
          className={`hphone hphone--${i + 1}`}
          aria-label={`Open ${project.title}`}
          onClick={() => onOpen(project.id)}
          onMouseEnter={onHover}
        >
          <PhoneMock>
            <Screen item={project.gallery[0]} colors={project.colors} title={project.title} />
          </PhoneMock>
          <span className="hphone__tag mono">{project.title} ↗</span>
        </button>
      ))}
    </div>
  );
}
