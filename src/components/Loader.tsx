import { useCallback, useEffect, useRef, useState } from "react";
import { profile } from "../data/content";

const KEY = "portfolio-loaded";
const COUNT_MS = 600;
const LEAVE_MS = 700;

/** The loader plays once per session, and never for people who prefer reduced motion. */
export function shouldSkipLoader(): boolean {
  try {
    if (sessionStorage.getItem(KEY) === "1") return true;
  } catch {
    /* storage unavailable */
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

interface LoaderProps {
  /** Called as the curtain starts to lift, so the hero can begin its entrance. */
  onLeave: () => void;
  /** Called once the curtain is gone and the loader can be unmounted. */
  onDone: () => void;
}

export function Loader({ onLeave, onDone }: LoaderProps) {
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const finished = useRef(false);
  const leave = useRef(onLeave);
  const done = useRef(onDone);

  useEffect(() => {
    leave.current = onLeave;
    done.current = onDone;
  }, [onLeave, onDone]);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    setCount(100);
    setLeaving(true);
    leave.current();
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* storage unavailable */
    }
    window.setTimeout(() => done.current(), LEAVE_MS);
  }, []);

  // Count up with an ease-out, hold for a beat at 100, then lift.
  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    let hold = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / COUNT_MS);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * 100));
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        hold = window.setTimeout(finish, 120);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(hold);
    };
  }, [finish]);

  // Keep the page still underneath, and let Escape or Enter skip.
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") finish();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [finish]);

  return (
    <div
      className={`loader ${leaving ? "is-leaving" : ""}`.trim()}
      role="status"
      aria-label="Loading"
      onClick={finish}
    >
      <span className="loader__top mono">Welcome to</span>
      <span className="loader__name">{profile.display}</span>
      <div className="loader__bar">
        <span className="loader__count">{String(count).padStart(3, "0")}</span>
        <span className="loader__skip mono">Click to skip</span>
      </div>
    </div>
  );
}
