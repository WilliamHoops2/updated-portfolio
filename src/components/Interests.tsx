import type { ReactNode } from "react";
import { tour } from "../data/content";
import { ChessPuzzle } from "./ChessPuzzle";
import { CodeCard } from "./CodeCard";
import { EcosystemCard } from "./EcosystemCard";
import { HoopGame } from "./HoopGame";
import { MangaPanels } from "./MangaPanels";
import { MarketChart } from "./MarketChart";
import { Reveal } from "./Reveal";

interface CardProps {
  n: string;
  label: string;
  title: string;
  text: string;
  className: string;
  tourLine: string;
  delay?: number;
  children: ReactNode;
}

function Card({ n, label, title, text, className, tourLine, delay = 0, children }: CardProps) {
  return (
    <Reveal as="article" className={`bento__card ${className}`} delay={delay} tour={tourLine}>
      <header className="bento__head">
        <span className="eyebrow mono">
          {n} · {label}
        </span>
        <h3 className="bento__title">{title}</h3>
        <p className="bento__text">{text}</p>
      </header>
      <div className="bento__body">{children}</div>
    </Reveal>
  );
}

export function Interests() {
  return (
    <section className="interests" id="interests" data-tour={tour.interests}>
      <Reveal className="section-head">
        <span className="mono">Interests</span>
        <span className="mono">06</span>
      </Reveal>

      <Reveal as="h2" className="interests__title">
        Beyond <em>the code</em>
      </Reveal>
      <Reveal as="p" className="interests__lead" delay={100}>
        Code is the main thing, but it isn't the only thing. These are the other loops I like to get lost in. Most of
        them are playable.
      </Reveal>

      <div className="bento">
        <Card
          n="01"
          label="Coding"
          title="TypeScript → React → SwiftUI"
          text="I started on the web with TypeScript and React. Lately I've been going deep into SwiftUI, thanks to the Apple Developer Academy in Bali."
          className="bento__card--code"
          tourLine={tour.code}
        >
          <CodeCard />
        </Card>

        <Card
          n="02"
          label="iOS ecosystem"
          title="The whole Apple toolbox"
          text="I love how everything fits together: apps, widgets, Live Activities and on-device ML. Tap a framework to see where I've used it."
          className="bento__card--eco"
          tourLine={tour.ecosystem}
          delay={100}
        >
          <EcosystemCard />
        </Card>

        <Card
          n="03"
          label="Chess"
          title="Find the move"
          text="Spotting the best move is my favourite kind of puzzle. Click a piece, then a square."
          className="bento__card--chess"
          tourLine={tour.chess}
        >
          <ChessPuzzle />
        </Card>

        <Card
          n="04"
          label="Basketball"
          title="Hold. Release. Swish."
          text="Charge your shot and let go inside the green zone."
          className="bento__card--hoop"
          tourLine={tour.hoop}
          delay={100}
        >
          <HoopGame />
        </Card>

        <Card
          n="05"
          label="Finance"
          title="Stocks & crypto"
          text="I like following markets, for fun and for learning. This chart is made up, just for vibes."
          className="bento__card--market"
          tourLine={tour.market}
          delay={200}
        >
          <MarketChart />
        </Card>

        <Card
          n="06"
          label="Manga & anime"
          title="Slam Dunk & Vagabond"
          text="Two favourites, both by Takehiko Inoue. Tap a panel to flip it."
          className="bento__card--manga"
          tourLine={tour.manga}
        >
          <MangaPanels />
        </Card>
      </div>
    </section>
  );
}
