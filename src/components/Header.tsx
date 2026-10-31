import type { Theme } from "../hooks/useTheme";
import { profile } from "../data/content";
import { Roll } from "./Roll";
import { StatusBar } from "./StatusBar";

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  soundOn: boolean;
  onToggleSound: () => void;
  onHover: () => void;
}

export function Header({ theme, onToggleTheme, soundOn, onToggleSound, onHover }: HeaderProps) {
  return (
    <header className="header">
      <a href="#top" className="header__logo" onMouseEnter={onHover}>
        {profile.handle}
        <sup>©{profile.year}</sup>
      </a>

      <nav className="header__nav mono" aria-label="Primary">
        <a href="#work" onMouseEnter={onHover}>
          <Roll>Work</Roll>
        </a>
        <a href="#interests" onMouseEnter={onHover}>
          <Roll>Interests</Roll>
        </a>
        <a href="#process" onMouseEnter={onHover}>
          <Roll>Process</Roll>
        </a>
        <a href="#contact" onMouseEnter={onHover}>
          <Roll>Contact</Roll>
        </a>
      </nav>

      <div className="header__controls mono">
        <button type="button" onClick={onToggleTheme} onMouseEnter={onHover} aria-label="Toggle theme">
          THEME[{theme === "dark" ? "D" : "L"}]
        </button>
        <button
          type="button"
          onClick={onToggleSound}
          aria-pressed={soundOn}
          aria-label="Toggle hover sounds"
        >
          SOUND[{soundOn ? "|" : " "}]
        </button>
        <a href="#contact" className="header__cta" onMouseEnter={onHover}>
          <Roll>Say hello</Roll>
        </a>
      </div>

      <StatusBar />
    </header>
  );
}
