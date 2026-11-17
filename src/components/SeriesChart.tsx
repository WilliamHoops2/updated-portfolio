import { useId, useState } from "react";
import type { PointerEvent } from "react";
import type { RangeId, SeriesResult } from "../lib/marketData";
import { MarketFrame } from "./MarketFrame";

// The chart is drawn in a 300 × 120 box that CSS stretches to fit the chart area.
const W = 300;
const H = 120;
const PAD = 10;

const UP = "#22c55e";
const DOWN = "#ef4444";

const formatDate = (t: number) =>
  new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

interface SeriesChartProps {
  data: SeriesResult | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
  range: RangeId;
  /** Used in the chart's accessible label, e.g. "Bitcoin". */
  label: string;
  /** The small line under the headline, e.g. "Bitcoin · USDT". */
  sub: string;
  /** How to print a price or index level. */
  formatValue: (value: number) => string;
  /** Extra words for the footer, e.g. " · may be delayed". */
  noteSuffix?: string;
}

/**
 * Draws a price series as an area chart with a hover inspector. It doesn't know or care whether
 * the numbers are Bitcoin prices or the IHSG: the parent passes the data and how to format it.
 */
export function SeriesChart({ data, loading, error, retry, range, label, sub, formatValue, noteSuffix = "" }: SeriesChartProps) {
  const gradientId = `s${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const [hover, setHover] = useState<number | null>(null);

  const points = data?.points ?? [];
  const hasData = points.length >= 2;

  // Which point is "active": the one under the pointer, otherwise the latest.
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!hasData) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    setHover(Math.round(ratio * (points.length - 1)));
  };

  // ── Chart maths (only when there is data) ────────────────
  let line = "";
  let area = "";
  let activeValue = 0;
  let activeTime = 0;
  let change = 0;
  let dot = { x: 0, y: 0 };

  if (hasData) {
    const values = points.map((p) => p.v);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;

    // Turn each point into an x/y position inside the 300 × 120 box.
    // x: spread evenly left → right. y: higher price = smaller y (SVG's y axis points down).
    const coords = points.map((p, i) => ({
      x: (i / (points.length - 1)) * W,
      y: PAD + (1 - (p.v - min) / span) * (H - PAD * 2),
    }));

    line = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(" ");
    area = `${line} L${W} ${H} L0 ${H} Z`;

    const index = hover !== null && hover < points.length ? hover : points.length - 1;
    activeValue = points[index].v;
    activeTime = points[index].t;
    change = (activeValue / points[0].v - 1) * 100;
    dot = coords[index];
  }

  const updated = data
    ? new Date(data.fetchedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    : "";

  const plot = hasData ? (
    <>
      <svg className="market__chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label={`${label} chart, ${range}`}>
        <defs>
          {/* The fill fades from 35% accent at the top to nothing at the bottom. */}
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: "var(--accent)" }} stopOpacity="0.35" />
            <stop offset="1" style={{ stopColor: "var(--accent)" }} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${gradientId})`} />
        <path
          d={line}
          fill="none"
          style={{ stroke: "var(--accent)" }}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {hover !== null && <span className="market__cross" style={{ left: `${(dot.x / W) * 100}%` }} aria-hidden="true" />}
      <span className="market__dot" style={{ left: `${(dot.x / W) * 100}%`, top: `${(dot.y / H) * 100}%` }} aria-hidden="true" />
    </>
  ) : error ? (
    <div className="market__error" role="alert">
      <p>Couldn't load live data right now.</p>
      <p className="mono">{error}</p>
      <button type="button" className="textbtn mono" onClick={retry}>
        Try again ↺
      </button>
    </div>
  ) : (
    <div className="market__skeleton" aria-hidden="true" />
  );

  return (
    <MarketFrame
      headline={
        hasData ? <strong>{formatValue(activeValue)}</strong> : <strong className="market__placeholder">{loading ? "Loading…" : "—"}</strong>
      }
      badge={
        hasData && (
          <span className="mono" style={{ color: change >= 0 ? UP : DOWN }}>
            {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
          </span>
        )
      }
      sub={
        <>
          {sub}
          {hasData && <> · {hover !== null ? formatDate(activeTime) : "latest"}</>}
        </>
      }
      plot={plot}
      plotClassName={loading && hasData ? "is-loading" : ""}
      plotProps={{ onPointerMove: onMove, onPointerLeave: () => setHover(null) }}
      note={
        <>
          {data ? `Source: ${data.source} · ${updated}` : "Live data"}
          {data?.stale ? " · saved copy" : ""}
          {error && hasData ? " · couldn't refresh" : ""}
          {noteSuffix}
          {" · not financial advice"}
        </>
      }
    />
  );
}
