import { projects } from "./content";
import type { Project, ProjectKind } from "./content";

export const kindOf = (project: Project): ProjectKind => project.kind ?? "app";

export const GROUPS: { kind: ProjectKind; label: string }[] = [
  { kind: "app", label: "Apps" },
  { kind: "game", label: "Games" },
  { kind: "research", label: "Research" },
];

/** Projects in the order the index shows them (grouped by kind). Numbering and "next" follow this. */
export const orderedProjects: Project[] = GROUPS.flatMap((group) =>
  projects.filter((project) => kindOf(project) === group.kind),
);
