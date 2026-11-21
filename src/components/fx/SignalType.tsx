import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const NOISE = "░▒▓█▌▐▀▄#%&*+=<>/\\|";
const pick = () => NOISE[Math.floor(Math.random() * NOISE.length)];

/**
 * Text that locks on like a tuned signal: static first, then each letter resolves left to right.
 * Give it several words and it retunes to the next one on a timer; hover to scan again.
 */
export function SignalType({ words, interval = 3400, className }: { words: string[]; interval?: number; className?: string }) {
  const [shown, setShown] = useState<{ ch: string; locked: boolean }[]>(() =>
    Array.from(words[0]).map((ch) => ({ ch, locked: true })),
  );
  const index = useRef(0);
  const raf = useRef(0);
  const widest = words.reduce((a, b) => (b.length > a.length ? b : a), "");

  const tune = (word: string) => {
    cancelAnimationFrame(raf.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(Array.from(word).map((ch) => ({ ch, locked: true })));
      return;
    }
    const start = performance.now();
    const step = (now: number) => {
      const el = now - start;
      const chars = Array.from(word).map((ch, i) => {
        const locked = ch === " " || el > 260 + i * 55;
        return { ch: locked ? ch : pick(), locked };
      });
      setShown(chars);
      if (chars.some((c) => !c.locked)) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    tune(words[0]);
    if (words.length < 2) return () => cancelAnimationFrame(raf.current);
    const id = window.setInterval(() => {
      index.current = (index.current + 1) % words.length;
      tune(words[index.current]);
    }, interval);
    return () => {
      window.clearInterval(id);
      cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words, interval]);

  return (
    <span className={cn("relative inline-block whitespace-nowrap", className)} onPointerEnter={() => tune(words[index.current])}>
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden="true" className="invisible">{widest}</span>
      <span aria-hidden="true" className="absolute inset-0">
        {shown.map((c, i) => (
          <span key={i} className={c.locked ? "" : "text-signal/70"}>
            {c.ch}
          </span>
        ))}
      </span>
    </span>
  );
}
