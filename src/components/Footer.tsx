import { profile } from "../data/content";
import { Roll } from "./Roll";

export function Footer({ inert }: { inert?: boolean }) {
  return (
    <footer className="footer" inert={inert}>
      <div className="footer__bar mono">
        <span>
          © {profile.year} {profile.name} · {profile.place.join(", ")}
        </span>
        <a href="#top">
          <Roll>Back to top</Roll> ↑
        </a>
      </div>
    </footer>
  );
}
