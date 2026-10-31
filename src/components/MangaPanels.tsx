import { useState } from "react";
import type { ReactNode } from "react";

interface PanelProps {
  title: string;
  kicker: string;
  blurb: string;
  flipped: boolean;
  onToggle: () => void;
  className: string;
  children: ReactNode;
}

function Panel({ title, kicker, blurb, flipped, onToggle, className, children }: PanelProps) {
  return (
    <button
      type="button"
      className={`panel-art ${className} ${flipped ? "is-flipped" : ""}`.trim()}
      aria-pressed={flipped}
      aria-label={`${title}: ${flipped ? "hide" : "show"} note`}
      onClick={onToggle}
    >
      <span className="panel-art__art" aria-hidden="true">
        {children}
      </span>
      <span className="panel-art__label">
        <span className="mono">{kicker}</span>
        <strong>{title}</strong>
      </span>
      <span className="panel-art__note">{blurb}</span>
    </button>
  );
}

/** Two comic-style panels. Tap one to flip it and read a short note. */
export function MangaPanels() {
  const [flipped, setFlipped] = useState<"slam" | "vagabond" | null>(null);

  return (
    <div className="manga">
      <Panel
        title="Slam Dunk"
        kicker="Shohoku · #10"
        blurb="A rookie, a ball and a whole lot of heart."
        className="panel-art--slam"
        flipped={flipped === "slam"}
        onToggle={() => setFlipped((f) => (f === "slam" ? null : "slam"))}
      >
        <span className="speed" />
        <svg viewBox="0 0 100 120" className="jersey">
          <path
            d="M30 8h12q8 14 16 0h12l18 22-12 10-4-6v78H28V34l-4 6L12 30z"
            fill="#d62828"
            stroke="#0a0e11"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <text x="50" y="82" textAnchor="middle" fontSize="38" fontWeight="800" fill="#fff" fontFamily="Inter, system-ui, sans-serif">
            10
          </text>
        </svg>
      </Panel>

      <Panel
        title="Vagabond"
        kicker="武蔵 · Musashi"
        blurb="A swordsman's path, one brush stroke at a time."
        className="panel-art--vagabond"
        flipped={flipped === "vagabond"}
        onToggle={() => setFlipped((f) => (f === "vagabond" ? null : "vagabond"))}
      >
        <svg viewBox="0 0 100 100" className="ensou">
          <path
            d="M50 10C26 10 10 30 12 52c2 24 24 38 46 34 22-4 34-24 30-46"
            fill="none"
            stroke="#0a0e11"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M50 10C26 10 10 30 12 52c2 24 24 38 46 34 22-4 34-24 30-46"
            fill="none"
            stroke="#0a0e11"
            strokeOpacity="0.35"
            strokeWidth="3"
            strokeLinecap="round"
            transform="translate(2 2)"
          />
          <path d="M22 84L82 16" stroke="#c1121f" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <span className="kanji">武蔵</span>
      </Panel>
    </div>
  );
}
