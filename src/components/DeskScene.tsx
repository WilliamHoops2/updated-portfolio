import { useEffect, useRef } from "react";
import type { Desk, DeskId } from "../lib/buildDesk";

interface Props {
  selected: DeskId | null;
  onPick: (id: DeskId | null) => void;
}

/** The 3D table. three.js loads on demand, so it stays out of the main bundle. */
export function DeskScene({ selected, onPick }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const desk = useRef<Desk | null>(null);
  const latest = useRef({ selected, onPick });
  latest.current = { selected, onPick };

  useEffect(() => {
    let gone = false;
    import("../lib/buildDesk").then(({ createDesk }) => {
      if (gone || !host.current) return;
      try {
        desk.current = createDesk(host.current, (id) => latest.current.onPick(id));
        desk.current.focus(latest.current.selected);
      } catch {
        // No WebGL: the buttons under the scene still open every toy.
      }
    });
    return () => {
      gone = true;
      desk.current?.dispose();
      desk.current = null;
    };
  }, []);

  useEffect(() => desk.current?.focus(selected), [selected]);

  return <div ref={host} className="desk3d__canvas" aria-hidden="true" />;
}
