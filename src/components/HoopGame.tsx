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
        <defs>
          <radialGradient id="hoopBall" cx="35%" cy="30%" r="80%">
            <stop offset="0" style={{ stopColor: "color-mix(in srgb, var(--p-orchid) 60%, white)" }} />
            <stop offset="1" style={{ stopColor: "var(--p-orchid)" }} />
          </radialGradient>
        </defs>

        {/* hardwood floor and three-point line */}
        <rect className="hoop__wood" x="0" y="204" width="300" height="16" />
        <path className="hoop__planks" d="M50 204v16M110 204v16M170 204v16M230 204v16M290 204v16" />
        <path className="hoop__arc" d="M20 204 A 90 90 0 0 1 200 204" />

        {/* stanchion, backboard, rim bracket */}
        <rect className="hoop__pole" x="262" y="100" width="6" height="104" />
        <rect className="hoop__board" x="246" y="30" width="8" height="72" rx="2" />
        <rect className="hoop__shine" x="248" y="34" width="2" height="64" rx="1" />
        <rect className="hoop__bracket" x="240" y="86" width="8" height="4" />

        {/* the shadow stays on the floor and shrinks as the ball climbs */}
        <ellipse className="hoop__shadow" cx={ball.x} cy="206" rx={13 - (204 - Math.min(ball.y, 204)) / 24} ry="2.6" />

        {/* back half of the rim and the net sit behind the ball */}
        <path className="hoop__rim" d="M208 88 A18 4.5 0 0 1 244 88" />
        <g className={`hoop__net ${netShake ? "is-shake" : ""}`.trim()}>
          <path d="M210 90 L216 124 M218 91 L221 126 M226 92 L226 128 M234 91 L231 126 M242 90 L236 124" />
          <path d="M212 102 H240 M214 112 H238 M216 121 H236" />
        </g>

        <g transform={`translate(${ball.x} ${ball.y}) rotate(${ball.rot})`}>
          <circle className="hoop__ball" r="11" />
          <path className="hoop__seam" d="M-11 0 H11 M0 -11 V11 M-7.8 -7.8 Q0 0 -7.8 7.8 M7.8 -7.8 Q0 0 7.8 7.8" />
        </g>

        {/* the front half of the rim is drawn over the ball, so a make looks like it goes through */}
        <path className="hoop__rim" d="M208 88 A18 4.5 0 0 0 244 88" />
      </svg>

      <div className="hoop__meter" aria-hidden="true">
        <span className="hoop__label mono">Power</span>
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
        <div className="hoop__stats" aria-label="Score">
          <span>
            <b>{made}</b> made
          </span>
          <span>
            <b>{streak}</b> streak
          </span>
          <span>
            <b>{best}</b> best
          </span>
        </div>
      </div>

      <p className="hoop__msg" aria-live="polite">
        {msg}
      </p>
    </div>
  );
}
