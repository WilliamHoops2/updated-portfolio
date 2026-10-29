import { useEffect, useRef, useState } from "react";
import { profile } from "../data/content";
import { Reveal } from "./Reveal";

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
    <section className="contact" id="contact">
      <Reveal as="h2" className="contact__title">
        Let's make
        <br />
        something
        <br />
        <em>worth keeping.</em>
      </Reveal>

      <Reveal delay={150} className="contact__actions">
        <button type="button" className="contact__email" onClick={copyEmail}>
          {copied ? "Copied! Talk soon." : profile.email}
        </button>
        <p className="mono">Click to copy · {profile.location}</p>
      </Reveal>
    </section>
  );
}
