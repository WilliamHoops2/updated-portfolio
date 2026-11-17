import { useMarketSeries } from "../hooks/useMarketSeries";
import type { RangeId } from "../lib/marketData";
import { SeriesChart } from "./SeriesChart";

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

interface BitcoinViewProps {
  range: RangeId;
  /** Only load data while the card is on screen. */
  active: boolean;
}

export function BitcoinView({ range, active }: BitcoinViewProps) {
  const { data, loading, error, retry } = useMarketSeries("btc", range, active);

  // Binance and Bybit quote Bitcoin in USDT; Coinbase quotes it in USD.
  const quote = data?.source === "Coinbase" ? "USD" : "USDT";

  return (
    <SeriesChart
      data={data}
      loading={loading}
      error={error}
      retry={retry}
      range={range}
      label="Bitcoin"
      sub={`Bitcoin · ${quote}`}
      formatValue={(value) => usd.format(value)}
    />
  );
}
