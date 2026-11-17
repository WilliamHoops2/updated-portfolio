import { useDocumentTheme } from "../hooks/useDocumentTheme";
import { profile } from "../data/content";
import { Roll } from "./Roll";
import { StatusBar } from "./StatusBar";

interface HeaderProps {
  soundOn: boolean;
  onToggleSound: () => void;
  onHover: () => void;
}

export function Header({ soundOn, onToggleSound, onHover }: HeaderProps) {
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
        <a href="#contact" onMouseEnter={onHover}>
          <Roll>Contact</Roll>
        </a>
      </nav>

      <div className="header__controls mono">
        <button
          type="button"
          onClick={onToggleSound}
          aria-pressed={soundOn}
          aria-label="Toggle hover sounds"
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

      <StatusBar />
    </header>
  );
}
