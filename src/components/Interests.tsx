import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { useInView } from "../hooks/useInView";
import { tour } from "../data/content";
import { ChessPuzzle } from "./ChessPuzzle";
import { HoopGame } from "./HoopGame";
import { MangaPanels } from "./MangaPanels";
import { MarketChart } from "./MarketChart";
import { Reveal } from "./Reveal";
import { SplitText } from "./SplitText";

type DeskId = "chess" | "hoops" | "markets" | "manga";

interface Interest {
  id: DeskId;
  /** Big faded mark on the card. */
  glyph: string;
  title: string;
  /** What opens when you pick it. */
  kind: string;
  line: string;
  toy: ReactNode;
}

const SLIDE_MS = 5000;

const INTERESTS: Interest[] = [
  {
    id: "chess",
    glyph: "♞",
    title: "Chess",
    kind: "Puzzle",
    line: "It helps my brain think. Every move I try to see the board from the other side, and that habit follows me out of the game.",
    toy: <ChessPuzzle />,
  },
  {
    id: "hoops",
    glyph: "◉",
    title: "Basketball",
    kind: "Mini game",
    line: "Because it's super fun. It also taught me how to learn a skill from zero and how to work with other people.",
    toy: <HoopGame />,
  },
  {
    id: "markets",
    glyph: "₿",
    title: "Crypto",
    kind: "Chart",
    line: "In since 2021. I love the tech underneath, the constant innovation and the impact it has.",
    toy: <MarketChart />,
  },
  {
    id: "manga",
    glyph: "漫",
    title: "Manga",
    kind: "Panels",
    line: "It takes me to another world, and sometimes it makes me more creative.",
    toy: <MangaPanels />,
  },
];

/** Tilt toward the pointer; the CSS reads --rx/--ry for the card and --mx/--my for glare and the glyph. */
function tilt(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  el.style.setProperty("--mx", String(x));
  el.style.setProperty("--my", String(y));
  el.style.setProperty("--rx", `${(0.5 - y) * 10}deg`);
  el.style.setProperty("--ry", `${(x - 0.5) * 12}deg`);
}

function untilt(e: PointerEvent<HTMLElement>) {
  for (const k of ["--mx", "--my", "--rx", "--ry"]) e.currentTarget.style.removeProperty(k);
}

export function Interests() {
  const [selected, setSelected] = useState<DeskId | null>(null);
  const { ref: deckRef, inView } = useInView<HTMLUListElement>(0.2);
  const [dealt, setDealt] = useState(false);
  useEffect(() => {
    if (inView) setDealt(true); // deal once, don't replay on scroll
  }, [inView]);

  const [index, setIndex] = useState(0);
  const [hover, setHover] = useState(false);
  const indexRef = useRef(0);
  const reduce = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const playing = inView && !hover && !selected && !reduce;

  const goTo = (i: number) => {
    const deck = deckRef.current;
    const li = deck?.children[(i + INTERESTS.length) % INTERESTS.length] as HTMLElement | undefined;
    if (deck && li) deck.scrollTo({ left: li.offsetLeft, behavior: reduce ? "auto" : "smooth" });
  };

  // Follow the scroll (swipe, buttons or auto) so the dots always match.
  const onScroll = () => {
    const deck = deckRef.current;
    if (!deck) return;
    const step = (deck.children[1] as HTMLElement).offsetLeft - (deck.children[0] as HTMLElement).offsetLeft;
    const i = Math.min(INTERESTS.length - 1, Math.max(0, Math.round(deck.scrollLeft / step)));
    indexRef.current = i;
    setIndex(i);
  };

  // Slide to the next card every few seconds and wrap round; paused on hover, when a toy is open or off-screen.
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => goTo(indexRef.current + 1), SLIDE_MS);
    return () => clearInterval(t);
  }, [playing, index]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  // Four cards in a 2x2 grid; the open one grows to fill the row so its toy has room.
  return (
    <section className="desk" id="interests" data-tour={tour.interests}>
      <div className="desk__head">
        <p className="eyebrow mono">04 / Interests</p>
        <Reveal as="h2" className="desk__heading reveal--split">
          <SplitText text="Four things I keep coming back to" />
        </Reveal>
        <p className="desk__intro">Pick a card and it opens something to play with.</p>
      </div>

      <div className="deckwrap" onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
        <ul ref={deckRef} onScroll={onScroll} className={`deck${dealt ? " is-dealt" : ""}`}>
          {INTERESTS.map((item, i) => {
            const open = selected === item.id;
            return (
              <li
                key={item.id}
                className={`tcard tcard--${i}${open ? " is-open" : ""}`}
                style={{ "--i": i } as CSSProperties}
                onPointerMove={tilt}
                onPointerLeave={untilt}
              >
                <button
                  type="button"
                  className="tcard__face"
                  aria-expanded={open}
                  onClick={() => setSelected(open ? null : item.id)}
                >
                  <span className="tcard__top mono">
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <span>{open ? "Close" : item.kind}</span>
                  </span>
                  <span className="tcard__glyph" aria-hidden="true">{item.glyph}</span>
                  <span className="tcard__title">{item.title}</span>
                  <span className="tcard__line">{item.line}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="deck__nav">
          <button type="button" className="deck__btn" aria-label="Previous" onClick={() => goTo(index - 1)}>←</button>
          <div className="deck__dots">
            {INTERESTS.map((item, i) => (
              <button
                key={item.id}
                type="button"
                aria-label={item.title}
                aria-current={i === index}
                className={`deck__dot${i === index ? " is-on" : ""}${playing ? " is-playing" : ""}`}
                style={{ "--ms": `${SLIDE_MS}ms` } as CSSProperties}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
          <button type="button" className="deck__btn" aria-label="Next" onClick={() => goTo(index + 1)}>→</button>
        </div>
      </div>

      {INTERESTS.map((item) => selected === item.id && <div key={item.id} className="tcard__toy">{item.toy}</div>)}
    </section>
  );
}
