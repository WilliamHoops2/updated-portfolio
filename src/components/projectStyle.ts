import type { CSSProperties } from "react";
import type { Project } from "../data/content";
import { CREAM, INK } from "../lib/palette";

/** Picks dark or light text for a background colour, whichever has the better contrast. */
export function inkFor(hex: string): string {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const channel = (start: number) => {
    const v = parseInt(full.slice(start, start + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const luminance = 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
  return luminance > 0.179 ? INK : CREAM;
}

/** CSS variables a project's colours expose to its row, preview and case view. */
export function projectVars(project: Project): CSSProperties {
  return {
    "--c1": project.colors[0],
    "--c2": project.colors[1],
    "--ink": inkFor(project.colors[0]),
    /** Readable text colour on the lighter second colour. */
    "--ink2": inkFor(project.colors[1]),
  } as CSSProperties;
}
