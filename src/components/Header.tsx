import { useDocumentTheme } from "../hooks/useDocumentTheme";
import { profile } from "../data/content";
import { Roll } from "./Roll";
import { StatusBar } from "./StatusBar";

interface HeaderProps {
  soundOn: boolean;
  onToggleSound: () => void;
  onHover: () => void;
  /** True while a project view covers the page, so focus can't wander behind it. */
  inert?: boolean;
}

export function Header({ soundOn, onToggleSound, onHover, inert }: HeaderProps) {
  const theme = useDocumentTheme();
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // private mode: the choice just won't persist
    }
  };

  return (
    <header className="header" inert={inert}>
      <a href="#top" className="header__logo" onMouseEnter={onHover}>
        {profile.handle}
        <sup>©{profile.year}</sup>
      </a>

      <nav className="header__nav mono" aria-label="Primary">
        <a href="#about" onMouseEnter={onHover}>
          <Roll>About</Roll>
        </a>
        <a href="#work" onMouseEnter={onHover}>
          <Roll>Work</Roll>
        </a>
        <a href="#interests" onMouseEnter={onHover}>
          <Roll>Interests</Roll>
        </a>
        <a href="#contact" onMouseEnter={onHover}>
          <Roll>Contact</Roll>
        </a>
      </nav>

      <StatusBar />

      <div className="header__controls mono">
        <button
          type="button"
          onClick={onToggleSound}
          aria-pressed={soundOn}
          aria-label="Sound"
        >
          SOUND[{soundOn ? "|" : " "}]
        </button>
        <button type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
          {theme === "dark" ? "LIGHT" : "DARK"}
        </button>
        <a href="#contact" className="header__cta" onMouseEnter={onHover}>
          <Roll>Say hello</Roll>
        </a>
      </div>

    </header>
  );
}
