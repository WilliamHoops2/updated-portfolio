import type { ProjectKind } from "../data/content";

/** Frame shape per kind of project: phones are tall, Godot games are wide, research is a sheet. */
export const ASPECT: Record<ProjectKind, string> = {
  app: "9 / 19.5",
  game: "2622 / 1206",
  research: "16 / 10",
};
