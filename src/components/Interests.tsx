import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { tour } from "../data/content";
import type { DeskId } from "../lib/buildDesk";
import { ChessPuzzle } from "./ChessPuzzle";
import { DeskScene } from "./DeskScene";
import { HoopGame } from "./HoopGame";
import { MangaPanels } from "./MangaPanels";
import { MarketChart } from "./MarketChart";
import { Reveal } from "./Reveal";

interface Interest {
  id: DeskId;
  title: string;
  line: string;
  toy: ReactNode;
}

const INTERESTS: Interest[] = [
  {
    id: "chess",
    title: "Chess",
    line: "It helps my brain think. Every move I try to see the board from the other side, and that habit follows me out of the game.",
    toy: <ChessPuzzle />,
  },
  {
    id: "hoops",
    title: "Basketball",
    line: "Because it's super fun. It also taught me how to learn a skill from zero and how to work with other people.",
    toy: <HoopGame />,
  },
  {
    id: "markets",
    title: "Crypto",
    line: "In since 2021. I love the tech underneath, the constant innovation and the impact it has.",
    toy: <MarketChart />,
  },
  {
    id: "manga",
    title: "Manga",
    line: "It takes me to another world, and sometimes it makes me more creative.",
    toy: <MangaPanels />,
  },
];

export function Interests() {
  const [selected, setSelected] = useState<DeskId | null>(null);
  const active = INTERESTS.find((i) => i.id === selected);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <section className="desk" id="interests" data-tour={tour.interests}>
      <Reveal as="h2" className="desk__heading">
        Off the clock
      </Reveal>

      <Reveal className="desk3d">
        <DeskScene selected={selected} onPick={setSelected} />
        {active ? (
          <aside className="desk3d__panel" role="dialog" aria-label={active.title}>
            <button type="button" className="pill desk3d__close" onClick={() => setSelected(null)}>
              Back to the table
            </button>
            <h3 className="desk3d__title">{active.title}</h3>
            <p className="desk3d__line">{active.line}</p>
            <div className="desk3d__toy">{active.toy}</div>
          </aside>
        ) : (
          <p className="desk3d__hint mono">Click something on the table</p>
        )}
      </Reveal>

      <ul className="desk__legend">
        {INTERESTS.map((i) => (
          <li key={i.id}>
            <button type="button" className="pill" aria-pressed={selected === i.id} onClick={() => setSelected(i.id)}>
              {i.title}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
