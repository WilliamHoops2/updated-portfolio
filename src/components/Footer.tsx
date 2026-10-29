import { profile } from "../data/content";

export function Footer() {
  return (
    <footer className="footer mono">
      <span>
        © {profile.year} {profile.name}
      </span>
      <nav aria-label="Social links">
        {profile.socials.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
            {s.label}
          </a>
        ))}
      </nav>
    </footer>
  );
}
