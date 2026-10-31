import { useEffect, useRef, useState } from "react";
import { profile, tour } from "../data/content";
import { Reveal } from "./Reveal";
import { Roll } from "./Roll";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      window.location.href = `mailto:${profile.email}`;
      return;
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="contact" id="contact" data-tour={tour.contact}>
      <Reveal>
        <p className="eyebrow mono">Got a project?</p>
      </Reveal>

      <Reveal as="h2" className="contact__title">
        Let's make
        <br />
        something
        <br />
        <em>worth keeping.</em>
      </Reveal>

      <Reveal delay={150} className="contact__actions">
        <p className="contact__lead">I'm taking on new work.</p>
        <button type="button" className="btn btn--solid contact__email" onClick={copyEmail}>
          <Roll>{copied ? "Copied! Talk soon." : profile.email}</Roll>
        </button>
        <p className="mono contact__hint">Write me anytime. Click and it's copied.</p>
        <p className="contact__topics">Always happy to talk iOS, chess, basketball or a good manga recommendation.</p>
      </Reveal>

      <Reveal delay={250} className="contact__socials">
        {profile.socials.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="mono">
            <Roll>{s.label}</Roll> ↗
          </a>
        ))}
      </Reveal>
    </section>
  );
}
