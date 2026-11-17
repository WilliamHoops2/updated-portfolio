import { useCallback, useEffect, useState } from "react";
import { getSeries, peekSeries, REFRESH_MS } from "../lib/marketData";
import type { AssetId, RangeId, SeriesResult } from "../lib/marketData";

/**
 * Loads a price series and keeps it up to date while `enabled` is true.
 *  - paints straight from the cache if there is one
 *  - fetches in the background when the cache is old
 *  - re-checks on a timer (REFRESH_MS), which is cheap because getSeries() respects the cache
 *  - cancels in-flight requests when you switch range or scroll away
 */
export function useMarketSeries(asset: AssetId, range: RangeId, enabled: boolean) {
  const [data, setData] = useState<SeriesResult | null>(() => peekSeries(asset, range)?.data ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();
    const cached = peekSeries(asset, range);
    setData(cached ? cached.data : null);
    setError(null);

    const load = async (showSpinner: boolean) => {
      if (showSpinner) setLoading(true);
      try {
        const result = await getSeries(asset, range, controller.signal);
        if (controller.signal.aborted) return;
        setData(result);
        setError(null);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void load(!cached || !cached.fresh);
    const id = window.setInterval(() => void load(false), REFRESH_MS[asset]);

    return () => {
      controller.abort();
      window.clearInterval(id);
    };
  }, [asset, range, enabled, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { data, loading, error, retry };
}
