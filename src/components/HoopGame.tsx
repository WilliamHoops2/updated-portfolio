import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

type Phase = "idle" | "charging" | "flying";

interface Point {
  x: number;
  y: number;
}

const START: Point = { x: 56, y: 184 };
const RIM: Point = { x: 226, y: 88 };
const SWEET_MIN = 0.62;
const SWEET_MAX = 0.74;

/** Power 0…1 → where the ball arrives at rim height. The green zone lands right in the hoop. */
const landingX = (power: number) => 90 + power * 200;

export function HoopGame() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [power, setPower] = useState(0);
  const [ball, setBall] = useState({ x: START.x, y: START.y, rot: 0 });
  const [made, setMade] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [msg, setMsg] = useState("Hold to charge, release in the green.");
  const [netShake, setNetShake] = useState(false);

  const phaseRef = useRef<Phase>("idle");
  const powerRef = useRef(0);
  const chargeStart = useRef(0);
  const raf = useRef(0);
  const timer = useRef<number | undefined>(undefined);
  const streakRef = useRef(0);

  const setPhaseBoth = (next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  };

  const charge = useCallback((now: number) => {
    // Triangle wave 0 → 1 → 0, one full sweep roughly every 1.3 seconds.
    const t = (now - chargeStart.current) / 650;
    const p = 1 - Math.abs((t % 2) - 1);
    powerRef.current = p;
    setPower(p);
    raf.current = requestAnimationFrame(charge);
  }, []);

  const shoot = useCallback((p: number) => {
    const ex = landingX(p);
    const inside = Math.abs(ex - RIM.x) < 12;
    const end: Point = { x: ex, y: RIM.y };
    const fall: Point = inside
      ? { x: RIM.x, y: 160 }
      : p < SWEET_MIN
        ? { x: ex - 24, y: 176 }
        : { x: ex - 34, y: 170 };
    const ctrl: Point = { x: (START.x + end.x) / 2, y: 14 };

    const t0 = performance.now();
    const flight = 750;
    const drop = 320;

    const step = (now: number) => {
      const el = now - t0;

      if (el < flight) {
        const t = el / flight;
        const u = 1 - t;
        setBall({
          x: u * u * START.x + 2 * u * t * ctrl.x + t * t * end.x,
          y: u * u * START.y + 2 * u * t * ctrl.y + t * t * end.y,
          rot: t * 420,
        });
        raf.current = requestAnimationFrame(step);
        return;
      }

      if (el < flight + drop) {
        const t = (el - flight) / drop;
        if (inside) setNetShake(true);
        setBall({
          x: end.x + (fall.x - end.x) * t,
          y: end.y + (fall.y - end.y) * t * t,
          rot: 420 + t * 120,
        });
        raf.current = requestAnimationFrame(step);
        return;
      }

      if (inside) {
        streakRef.current += 1;
        setMade((n) => n + 1);
        setStreak(streakRef.current);
        setBest((b) => Math.max(b, streakRef.current));
        setMsg(streakRef.current >= 3 ? `Swish! ${streakRef.current} in a row. On fire!` : "Swish!");
      } else {
        streakRef.current = 0;
        setStreak(0);
        setMsg(p < SWEET_MIN ? "Short! Hold a bit longer." : "Too strong! Ease off.");
      }

      timer.current = window.setTimeout(() => {
        setNetShake(false);
        setBall({ x: START.x, y: START.y, rot: 0 });
        setPower(0);
        phaseRef.current = "idle";
        setPhase("idle");
      }, 650);
    };

    raf.current = requestAnimationFrame(step);
  }, []);

  const begin = () => {
    if (phaseRef.current !== "idle") return;
    setPhaseBoth("charging");
    setMsg("Release in the green zone!");
    chargeStart.current = performance.now();
    raf.current = requestAnimationFrame(charge);
  };

  const release = useCallback(() => {
    if (phaseRef.current !== "charging") return;
    cancelAnimationFrame(raf.current);
    phaseRef.current = "flying";
    setPhase("flying");
    shoot(powerRef.current);
  }, [shoot]);

  // Release even if the pointer is lifted away from the button.
  useEffect(() => {
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    return () => {
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
    };
  }, [release]);

  useEffect(
    () => () => {
      cancelAnimationFrame(raf.current);
      window.clearTimeout(timer.current);
    },
    [],
  );

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if ((e.key === " " || e.key === "Enter") && !e.repeat) {
      e.preventDefault();
      begin();
    }
  };

  const onKeyUp = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      release();
    }
  };

  return (
    <div className="hoop">
      <svg className="hoop__court" viewBox="0 0 300 220" role="img" aria-label="Basketball hoop">
        <line className="hoop__floor" x1="0" y1="204" x2="300" y2="204" />
        <path className="hoop__arc" d="M20 204 A 90 90 0 0 1 200 204" />

        {/* backboard + support */}
        <rect className="hoop__board" x="246" y="34" width="7" height="66" rx="2" />
        <rect className="hoop__board" x="252" y="62" width="22" height="6" rx="2" />

        {/* net sits behind the ball */}
        <g className={`hoop__net ${netShake ? "is-shake" : ""}`.trim()}>
          <path d="M208 90 L215 122 M217 91 L220 124 M226 92 L226 126 M235 91 L232 124 M244 90 L237 122" />
          <path d="M211 102 H241 M213 112 H239 M215 121 H237" />
        </g>

        <g transform={`translate(${ball.x} ${ball.y}) rotate(${ball.rot})`}>
          <circle className="hoop__ball" r="11" />
          <path className="hoop__seam" d="M-11 0 H11 M0 -11 V11 M-7.8 -7.8 Q0 0 -7.8 7.8 M7.8 -7.8 Q0 0 7.8 7.8" />
        </g>

        <ellipse className="hoop__rim" cx="226" cy="88" rx="18" ry="4.5" />
      </svg>

      <div className="hoop__meter" aria-hidden="true">
        <span className="hoop__zone" style={{ left: `${SWEET_MIN * 100}%`, width: `${(SWEET_MAX - SWEET_MIN) * 100}%` }} />
        <span className="hoop__needle" style={{ left: `${power * 100}%` }} />
      </div>

      <div className="hoop__row">
        <button
          type="button"
          className="btn btn--solid hoop__shoot"
          onPointerDown={begin}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          disabled={phase === "flying"}
        >
          {phase === "charging" ? "Release!" : "Hold to shoot"}
        </button>
        <div className="hoop__stats mono" aria-label="Score">
          <span>
            Made <b>{made}</b>
          </span>
          <span>
            Streak <b>{streak}</b>
          </span>
          <span>
            Best <b>{best}</b>
          </span>
        </div>
      </div>

      <p className="hoop__msg mono" aria-live="polite">
        {msg}
      </p>
    </div>
  );
}
