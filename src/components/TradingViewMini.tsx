import { useEffect, useRef, useState } from "react";
import { useDocumentTheme } from "../hooks/useDocumentTheme";
import { readAccent, withAlpha } from "../lib/color";
import type { RangeId } from "../lib/marketData";

const SCRIPT_SRC = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";

/** Our range names → TradingView's. ("12M" means twelve months.) */
const TV_RANGE: Record<RangeId, string> = { "1M": "1M", "3M": "3M", "1Y": "12M" };

interface TradingViewMiniProps {
  /** TradingView symbol, e.g. "IDX:COMPOSITE". */
  symbol: string;
  range: RangeId;
  /** Where the fallback message links to if the widget can't load. */
  fallbackHref: string;
}

/**
 * TradingView's free "Mini Chart" widget, reduced to just the area chart.
 *
 * TradingView has no data API, so the widget is their official way to show a chart: you add
 * their script, give it a JSON config, and it draws the chart (and fetches the data) inside an
 * iframe it creates itself. Because it's an iframe we can't restyle what's inside it; we can only
 * set the options in the config below. Those options are what make it match the Bitcoin chart:
 *  - chartOnly + noTimeScale: just the area chart, no header and no axis labels
 *  - isTransparent: no background, so it sits on the card like the Bitcoin chart does
 *  - the line and fill colours: the same accent colour, fading out the same way
 *
 * The script reads its config from its own text and puts the widget next to itself, so we build
 * the container by hand and append the script last. It's rebuilt when range or theme changes.
 */
export function TradingViewMini({ symbol, range, fallbackHref }: TradingViewMiniProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const theme = useDocumentTheme();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    setFailed(false);
    host.replaceChildren();

    const target = document.createElement("div");
    target.className = "tradingview-widget-container__widget";
    host.appendChild(target);

    const accent = readAccent();
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.type = "text/javascript";
    script.onerror = () => setFailed(true);
    script.innerHTML = JSON.stringify({
      symbol,
      width: "100%",
      height: "100%",
      locale: "en",
      dateRange: TV_RANGE[range],
      colorTheme: theme,
      isTransparent: true,
      autosize: true,
      largeChartUrl: "",
      chartOnly: true,
      noTimeScale: true,
      // Same colours as the Bitcoin chart: solid accent line, fill fading from 35% to 0%.
      trendLineColor: withAlpha(accent, 1),
      underLineColor: withAlpha(accent, 0.35),
      underLineBottomColor: withAlpha(accent, 0),
    });
    host.appendChild(script);

    return () => host.replaceChildren();
  }, [symbol, range, theme]);

  return (
    <>
      <div ref={hostRef} className="tradingview-widget-container tvmini__host" hidden={failed} />

      {failed && (
        <div className="tvmini__fallback" role="status">
          <p>The TradingView chart couldn't load. A privacy or ad blocker can cause this.</p>
          <a className="mono" href={fallbackHref} target="_blank" rel="noopener nofollow">
            Open it on TradingView ↗
          </a>
        </div>
      )}
    </>
  );
}
