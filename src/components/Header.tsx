import type { Theme } from "../hooks/useTheme";
import { profile } from "../data/content";

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
          Work
        </a>
        <a href="#contact" onMouseEnter={onHover}>
          Contact
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
      </div>
    </header>
  );
}
