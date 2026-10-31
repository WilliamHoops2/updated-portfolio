import { useEffect, useId, useState } from "react";
import { useInView } from "../hooks/useInView";

type Mode = "stocks" | "crypto";

const POINTS = 48;
const W = 300;
const H = 120;

// Crypto swings a lot harder than stocks, so it gets a bigger random step.
const VOLATILITY: Record<Mode, number> = { stocks: 0.012, crypto: 0.045 };
const DRIFT: Record<Mode, number> = { stocks: 0.0006, crypto: 0.002 };

const nextValue = (value: number, mode: Mode) =>
  Math.max(1, value * (1 + DRIFT[mode] + (Math.random() - 0.5) * 2 * VOLATILITY[mode]));

function makeSeries(mode: Mode): number[] {
  const out = [100];
  for (let i = 1; i < POINTS; i++) out.push(nextValue(out[i - 1], mode));
  return out;
}

export function MarketChart() {
  const gradientId = `m${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const [mode, setMode] = useState<Mode>("stocks");
  const [series, setSeries] = useState<number[]>(() => makeSeries("stocks"));
  const [paused, setPaused] = useState(false);

  const switchMode = (next: Mode) => {
    setMode(next);
    setSeries(makeSeries(next));
  };

  // Tick along only while the card is on screen.
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!inView || paused || reduceMotion) return;

    const id = window.setInterval(() => {
      setSeries((s) => [...s.slice(1), nextValue(s[s.length - 1], mode)]);
    }, 900);
    return () => window.clearInterval(id);
  }, [inView, paused, mode]);

  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;
  const pad = 8;

  const coords = series.map((v, i) => {
    const x = (i / (series.length - 1)) * W;
    const y = pad + (1 - (v - min) / span) * (H - pad * 2);
    return [x, y] as const;
  });

  const line = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L${W} ${H} L0 ${H} Z`;

  const first = series[0];
  const last = series[series.length - 1];
  const change = (last / first - 1) * 100;
  const up = change >= 0;
  const color = up ? "#22c55e" : "#ef4444";
  const [lastX, lastY] = coords[coords.length - 1];

  return (
    <div ref={ref} className="market">
      <div className="market__top">
        <div className="segmented mono" role="group" aria-label="Market type">
          <button type="button" className={mode === "stocks" ? "is-active" : ""} aria-pressed={mode === "stocks"} onClick={() => switchMode("stocks")}>
            Stocks
          </button>
          <button type="button" className={mode === "crypto" ? "is-active" : ""} aria-pressed={mode === "crypto"} onClick={() => switchMode("crypto")}>
            Crypto
          </button>
        </div>
        <button type="button" className="textbtn mono" onClick={() => setPaused((p) => !p)}>
          {paused ? "Resume ▶" : "Pause ❚❚"}
        </button>
      </div>

      <div className="market__value">
        <strong>{last.toFixed(2)}</strong>
        <span className="mono" style={{ color }}>
          {up ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
        </span>
      </div>

      <div className="market__plot">
      <svg className="market__chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label={`Simulated ${mode} price chart`}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={color} stopOpacity="0.35" />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${gradientId})`} />
        <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="market__dot" style={{ left: `${(lastX / W) * 100}%`, top: `${(lastY / H) * 100}%`, background: color }} aria-hidden="true" />
      </div>

      <p className="market__note mono">Simulated data · not financial advice</p>
    </div>
  );
}
