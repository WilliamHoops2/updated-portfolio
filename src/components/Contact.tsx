import { useEffect, useRef, useState } from "react";
import { profile } from "../data/content";
import { Eyebrow } from "./Eyebrow";
import { GlassKeys } from "./fx/GlassKeys";
import { SignalType } from "./fx/SignalType";
import StarBorder from "./rb/StarBorder";

const SAY_HI = ["Say hi.", "Let's talk.", "Build it."];

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
    <section id="contact" className="relative flex min-h-screen items-center overflow-hidden px-6 py-28 md:px-12">
      <GlassKeys className="[mask-image:radial-gradient(ellipse_at_center,transparent_18%,#000_75%)]" />
      <div className="relative mx-auto w-full max-w-5xl text-center">
        <div className="flex justify-center">
          <Eyebrow>07 / Contact</Eyebrow>
        </div>
        <h2 className="font-display text-[clamp(3rem,11vw,9.5rem)] leading-[0.9] font-extrabold tracking-tight text-cream">
          Got a project?
          <br />
          <SignalType words={SAY_HI} className="text-signal" />
        </h2>
        <p className="mx-auto mt-6 max-w-md text-cream/70">I'm taking on new work. Write me anytime, click and it's copied.</p>
        <div className="mt-8 flex justify-center">
          <StarBorder as="button" type="button" onClick={copyEmail} theme="dark" color="#b9f27c" radius={999} className="font-mono text-sm tracking-wider">
            {copied ? "Copied! Talk soon." : profile.email}
          </StarBorder>
        </div>
        <ul className="mt-10 flex justify-center gap-6 font-mono text-xs tracking-widest uppercase">
          {profile.socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer" className="text-cream/60 transition hover:text-signal">
                {s.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
