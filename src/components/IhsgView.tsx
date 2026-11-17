import { useMarketSeries } from "../hooks/useMarketSeries";
import type { RangeId } from "../lib/marketData";
import { IhsgWidgetView } from "./IhsgWidgetView";
import { SeriesChart } from "./SeriesChart";

const indexLevel = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

interface IhsgViewProps {
  range: RangeId;
  /** Only load data while the card is on screen. */
  active: boolean;
}

/**
 * The IDX Composite tab.
 *
 * First choice: our own chart (same as Bitcoin, with a hover readout), fed by Yahoo Finance.
 * If Yahoo can't be reached and we have nothing saved, fall back to TradingView's widget, so the
 * card never ends up empty. TradingView's script is only loaded in that case.
 */
export function IhsgView({ range, active }: IhsgViewProps) {
  const { data, loading, error, retry } = useMarketSeries("ihsg", range, active);

  const hasData = (data?.points.length ?? 0) >= 2;
  if (!hasData && error) return <IhsgWidgetView range={range} />;

  return (
    <SeriesChart
      data={data}
      loading={loading}
      error={error}
      retry={retry}
      range={range}
      label="IDX Composite"
      sub="IHSG · IDX Composite"
      formatValue={(value) => indexLevel.format(value)}
      noteSuffix=" · may be delayed"
    />
  );
}
