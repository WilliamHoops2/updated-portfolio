import type { HTMLAttributes, ReactNode } from "react";

interface MarketFrameProps {
  /** The big line: a price for Bitcoin, the index name for the IHSG. */
  headline: ReactNode;
  /** Optional small badge next to the headline, e.g. the % change. */
  badge?: ReactNode;
  /** The small monospace line under the headline. */
  sub: ReactNode;
  /** What goes inside the chart box: an SVG, or the TradingView widget. */
  plot: ReactNode;
  /** Extra class for the chart box (e.g. while loading). */
  plotClassName?: string;
  /** Extra props for the chart box, like pointer handlers for hovering. */
  plotProps?: HTMLAttributes<HTMLDivElement>;
  /** The small footer line: source, time, disclaimer. */
  note: ReactNode;
}

/**
 * The layout both market tabs share: headline, subtitle, chart box, footer note.
 * Because Bitcoin and the IHSG both render through this one component, they always have the
 * same fonts, spacing and chart height. Only what's passed in differs.
 */
export function MarketFrame({ headline, badge, sub, plot, plotClassName = "", plotProps, note }: MarketFrameProps) {
  return (
    <>
      <div className="market__value">
        {headline}
        {badge}
      </div>

      <p className="market__sub mono">{sub}</p>

      <div className={`market__plot ${plotClassName}`.trim()} {...plotProps}>
        {plot}
      </div>

      <p className="market__note mono">{note}</p>
    </>
  );
}
