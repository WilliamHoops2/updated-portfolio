import { toolkit, heroWords, ticker } from "../data/content";
import { TypeWall } from "./fx/TypeWall";

const WORDS = [...new Set([...toolkit.flatMap((g) => g.items), ...ticker.map((t) => t.label), ...heroWords])];
const rows = [0, 1, 2].map((r) => WORDS.filter((_, i) => i % 3 === r));

/** The toolkit as a wall of type. */
export function Toolkit() {
  return (
    <section id="toolkit" className="relative overflow-hidden py-24 md:py-32">
      <p className="sr-only">Toolkit: {WORDS.join(", ")}</p>
      <TypeWall rows={rows} className="[mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]" />
    </section>
  );
}
