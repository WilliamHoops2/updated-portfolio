import { profile } from "../data/content";
import { Roll } from "./Roll";

export function Footer() {
  const doTrick = () => window.dispatchEvent(new CustomEvent("mascot:trick"));

  return (
    <footer className="footer">
      <div className="footer__cols">
        <div>
          <h3 className="mono">Navigate</h3>
          <ul>
            <li>
              <a href="#work">
                <Roll>Work</Roll>
              </a>
            </li>
            <li>
              <a href="#interests">
                <Roll>Interests</Roll>
              </a>
            </li>
            <li>
              <a href="#process">
                <Roll>Process</Roll>
              </a>
            </li>
            <li>
              <a href="#updates">
                <Roll>Updates</Roll>
              </a>
            </li>
            <li>
              <a href="#contact">
                <Roll>Contact</Roll>
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mono">Follow</h3>
          <ul>
            {profile.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer">
                  <Roll>{s.label}</Roll>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mono">Contact</h3>
          <ul>
            <li>
              <a href={`mailto:${profile.email}`}>
                <Roll>{profile.email}</Roll>
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mono">Find me</h3>
          <ul>
            {profile.place.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer__bar mono">
        <span>
          © {profile.year} {profile.name}
        </span>
        <button type="button" onClick={doTrick}>
          <Roll>Do a trick</Roll>
        </button>
        <a href="#top">
          <Roll>Back to top</Roll> ↑
        </a>
      </div>
    </footer>
  );
}
