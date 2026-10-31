import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { tour } from "../data/content";

const SIZE = 76;
const FLOOR_GAP = 20;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

interface Pos {
  x: number;
  y: number;
}

/**
 * A little guide that comments on whichever section you're looking at.
 * Eyes follow the cursor, it can be picked up and dropped, and it does a trick on request.
 */
export function Mascot() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const bubbleTimer = useRef<number | undefined>(undefined);
  const trickTimer = useRef<number | undefined>(undefined);
  const draggingRef = useRef(false);
  const interacted = useRef(false);
  const grabOffset = useRef({ x: 0, y: 0 });

  const [line, setLine] = useState("");
  const [bubble, setBubble] = useState(false);
  const [pos, setPos] = useState<Pos | null>(null);
  const [dragging, setDragging] = useState(false);
  const [tricking, setTricking] = useState(false);

  const say = useCallback((text: string, ms = 5000) => {
    window.clearTimeout(bubbleTimer.current);
    setLine(text);
    setBubble(true);
    bubbleTimer.current = window.setTimeout(() => setBubble(false), ms);
  }, []);

  // Comment on each section as it crosses the middle of the screen.
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-tour]"));
    if (targets.length === 0 || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || draggingRef.current) continue;
          const text = (entry.target as HTMLElement).dataset.tour;
          if (text) say(text);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [say]);

  // A gentle nudge if nobody has touched it yet.
  useEffect(() => {
    const id = window.setTimeout(() => {
      if (!interacted.current && !draggingRef.current) say(tour.idle, 5000);
    }, 12000);
    return () => window.clearTimeout(id);
  }, [say]);

  // Eyes follow the pointer.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let frame = 0;
    let px = 0;
    let py = 0;

    const update = () => {
      frame = 0;
      const r = root.getBoundingClientRect();
      const dx = px - (r.left + r.width / 2);
      const dy = py - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, d / 180);
      root.style.setProperty("--ex", ((dx / d) * 3.2 * k).toFixed(2));
      root.style.setProperty("--ey", ((dy / d) * 3.2 * k).toFixed(2));
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  // "Do a trick" button in the footer.
  useEffect(() => {
    const onTrick = () => {
      window.clearTimeout(trickTimer.current);
      setTricking(true);
      const quips = tour.tricks;
      say(quips[Math.floor(Math.random() * quips.length)], 2500);
      trickTimer.current = window.setTimeout(() => setTricking(false), 950);
    };
    window.addEventListener("mascot:trick", onTrick);
    return () => window.removeEventListener("mascot:trick", onTrick);
  }, [say]);

  // Keep it on screen if the window is resized after being moved.
  useEffect(() => {
    const onResize = () =>
      setPos((p) =>
        p
          ? {
              x: clamp(p.x, 0, window.innerWidth - SIZE),
              y: clamp(p.y, 0, window.innerHeight - SIZE - FLOOR_GAP),
            }
          : p,
      );
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(
    () => () => {
      window.clearTimeout(bubbleTimer.current);
      window.clearTimeout(trickTimer.current);
    },
    [],
  );

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const root = rootRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    grabOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    root.setPointerCapture(e.pointerId);
    draggingRef.current = true;
    interacted.current = true;
    setDragging(true);
    setPos({ x: rect.left, y: rect.top });
    say(tour.grabbed, 60000);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    setPos({
      x: clamp(e.clientX - grabOffset.current.x, 0, window.innerWidth - SIZE),
      y: clamp(e.clientY - grabOffset.current.y, 0, window.innerHeight - SIZE - FLOOR_GAP),
    });
  };

  const onPointerUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    // Let go and it drops back to the floor with a bounce.
    const floor = window.innerHeight - SIZE - FLOOR_GAP;
    setPos((p) => (p ? { x: p.x, y: floor } : p));
    say(tour.dropped, 3500);
  };

  const nearLeft = pos ? pos.x < 240 : false;
  const nearTop = pos ? pos.y < 110 : false;

  const classes = [
    "mascot",
    dragging ? "is-dragging" : "",
    tricking ? "is-tricking" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const bubbleClasses = [
    "mascot__bubble",
    bubble ? "is-visible" : "",
    nearLeft ? "is-left" : "",
    nearTop ? "is-below" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={rootRef}
      className={classes}
      aria-hidden="true"
      style={pos ? { left: pos.x, top: pos.y, right: "auto", bottom: "auto" } : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className={bubbleClasses}>{line}</div>

      <svg className="mascot__svg" viewBox="0 0 80 80">
        <ellipse className="mascot__shadow" cx="40" cy="74" rx="22" ry="4" />
        <g className="mascot__body">
          <path className="mascot__tuft" d="M40 11c0-6 4-9 8-7" />
          <path
            className="mascot__skin"
            d="M12 52C12 28 24 11 40 11s28 17 28 41c0 10-6 18-28 18S12 62 12 52z"
          />
          <ellipse className="mascot__shine" cx="28" cy="27" rx="8" ry="5" transform="rotate(-30 28 27)" />
          <g className="mascot__eyes">
            <circle className="mascot__eye" cx="30" cy="41" r="8" />
            <circle className="mascot__eye" cx="50" cy="41" r="8" />
            <circle className="mascot__pupil" cx="30" cy="41" r="4" />
            <circle className="mascot__pupil" cx="50" cy="41" r="4" />
          </g>
          {dragging ? (
            <ellipse className="mascot__mouth-open" cx="40" cy="59" rx="5" ry="6" />
          ) : (
            <path className="mascot__mouth" d="M33 57q7 7 14 0" />
          )}
        </g>
      </svg>
    </div>
  );
}
