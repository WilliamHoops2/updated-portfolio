import { projects } from "../data/content";
import type { Project, ProjectKind } from "../data/content";

/** Frame shape per kind of project: phones are tall, Godot games are wide, research is a sheet. */
export const ASPECT: Record<ProjectKind, string> = {
  app: "9 / 19.5",
  game: "2622 / 1206",
  research: "16 / 10",
};

export const KINDS: ProjectKind[] = ["app", "game", "research"];

export const KIND_LABEL: Record<ProjectKind, string> = {
  app: "Apps",
  game: "Games",
  research: "Research",
};

export const kindOf = (project: Project): ProjectKind => project.kind ?? "app";

/** Projects in the order the index shows them: grouped by kind, then as listed in content.ts. */
export const ordered: Project[] = KINDS.flatMap((kind) => projects.filter((p) => kindOf(p) === kind));

export const pad = (n: number) => String(n).padStart(3, "0");
