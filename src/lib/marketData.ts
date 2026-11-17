// ─────────────────────────────────────────────────────────────
//  Price history for the finance card: Bitcoin and the IDX Composite (IHSG).
//
//  Everything that talks to an API lives in this file. The rest of the app just calls
//  getSeries("btc", "1M") and gets back a clean list of { t, v } points.
// ─────────────────────────────────────────────────────────────

export type AssetId = "btc" | "ihsg";

/** The three ranges both charts share. */
export type RangeId = "1M" | "3M" | "1Y";
export const RANGES: RangeId[] = ["1M", "3M", "1Y"];

/** How many daily candles each range needs (Bitcoin). */
const DAYS: Record<RangeId, number> = { "1M": 30, "3M": 90, "1Y": 365 };

/** The same ranges in Yahoo's wording (IHSG). */
const YAHOO_RANGE: Record<RangeId, string> = { "1M": "1mo", "3M": "3mo", "1Y": "1y" };

/** One point on the chart: t = time in milliseconds, v = price (or index level). */
export interface Point {
  t: number;
  v: number;
}

export interface SeriesResult {
  points: Point[];
  /** Where the data came from, shown under the chart. */
  source: string;
  /** When we fetched it (ms). */
  fetchedAt: number;
  /** True when the network failed and we're showing an older saved copy. */
  stale?: boolean;
}

/** How often a visible chart re-checks for new data (the cache makes extra checks cheap). */
export const REFRESH_MS: Record<AssetId, number> = {
  btc: 60_000,
  ihsg: 300_000,
};

// Where the IHSG requests go. By default that's our own dev server (see vite.config.ts).
// Set VITE_YAHOO_PROXY in a .env file to point at a deployed proxy instead.
const YAHOO_BASE = (import.meta.env.VITE_YAHOO_PROXY as string | undefined) ?? "/api/yahoo";

// ── Small helpers ───────────────────────────────────────────

const isValid = (p: Point) => Number.isFinite(p.t) && Number.isFinite(p.v);

/** fetch() that gives up after `timeoutMs`, and can also be cancelled from outside. */
async function getJson<T>(url: string, signal?: AbortSignal, timeoutMs = 6000): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
  const forwardAbort = () => controller.abort();
  signal?.addEventListener("abort", forwardAbort);

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError" && !signal?.aborted) {
      throw new Error("timed out");
    }
    // A server without the proxy answers with an HTML page instead of JSON.
    if (err instanceof SyntaxError) throw new Error("answer wasn't JSON (is the proxy running?)");
    throw err;
  } finally {
    window.clearTimeout(timeout);
    signal?.removeEventListener("abort", forwardAbort);
  }
}

function requirePoints(points: Point[], source: string): Point[] {
  const clean = points.filter(isValid);
  if (clean.length < 2) throw new Error(`${source} returned no usable data`);
  return clean;
}

// ── Bitcoin: Binance, then Bybit, then Coinbase ─────────────

/**
 * Binance "klines" are candlesticks, OLDEST first. Each row is an array:
 * [openTime, open, high, low, close, volume, closeTime, ...] with prices as strings.
 * We use the market-data-only host, which is meant for exactly this kind of read-only use.
 */
async function bitcoinFromBinance(range: RangeId, signal?: AbortSignal): Promise<Point[]> {
  const url = `https://data-api.binance.vision/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=${DAYS[range]}`;
  const rows = await getJson<unknown[][]>(url, signal);
  if (!Array.isArray(rows)) throw new Error("unexpected answer");
  return requirePoints(
    rows.map((row) => ({ t: Number(row[0]), v: Number(row[4]) })),
    "Binance",
  );
}

/**
 * Bybit wraps everything in { retCode, retMsg, result: { list } } and sends candles NEWEST first.
 * Each row is [startTime, open, high, low, close, volume, turnover], all strings.
 */
interface BybitKlineResponse {
  retCode: number;
  retMsg?: string;
  result?: { list?: string[][] };
}

async function bitcoinFromBybit(range: RangeId, signal?: AbortSignal): Promise<Point[]> {
  const url = `https://api.bybit.com/v5/market/kline?category=spot&symbol=BTCUSDT&interval=D&limit=${DAYS[range]}`;
  const json = await getJson<BybitKlineResponse>(url, signal);
  const list = json.result?.list;
  if (json.retCode !== 0 || !Array.isArray(list)) throw new Error(json.retMsg || "unexpected answer");
  const points = list.map((row) => ({ t: Number(row[0]), v: Number(row[4]) })).sort((a, b) => a.t - b.t);
  return requirePoints(points, "Bybit");
}

/**
 * Coinbase candles: [time (seconds), low, high, open, close, volume], newest first.
 * Quoted in USD (the other two use USDT). US-friendly, so it's the last resort.
 * It returns at most 300 candles, so the 1Y range shows the latest 300 days.
 */
async function bitcoinFromCoinbase(range: RangeId, signal?: AbortSignal): Promise<Point[]> {
  const url = "https://api.exchange.coinbase.com/products/BTC-USD/candles?granularity=86400";
  const rows = await getJson<number[][]>(url, signal);
  if (!Array.isArray(rows)) throw new Error("unexpected answer");
  const points = rows
    .map((row) => ({ t: row[0] * 1000, v: row[4] }))
    .sort((a, b) => a.t - b.t)
    .slice(-Math.min(DAYS[range], 300));
  return requirePoints(points, "Coinbase");
}

const BITCOIN_SOURCES: { name: string; load: (range: RangeId, signal?: AbortSignal) => Promise<Point[]> }[] = [
  { name: "Binance", load: bitcoinFromBinance },
  { name: "Bybit", load: bitcoinFromBybit },
  { name: "Coinbase", load: bitcoinFromCoinbase },
];

/**
 * Try each exchange in order and use the first that answers. Exchanges block some countries
 * (Binance and Bybit both restrict certain regions, and a blocked request often shows up in the
 * browser as a CORS error), so having a chain means most visitors still get a chart.
 */
async function fetchBitcoin(range: RangeId, signal?: AbortSignal): Promise<SeriesResult> {
  const failures: string[] = [];

  for (const source of BITCOIN_SOURCES) {
    try {
      const points = await source.load(range, signal);
      return { points, source: source.name, fetchedAt: Date.now() };
    } catch (err) {
      if (signal?.aborted) throw err;
      const reason = err instanceof Error ? err.message : "failed";
      failures.push(`${source.name}: ${reason}`);
      if (import.meta.env.DEV) console.warn(`[market] ${source.name} failed (${reason}), trying the next source`);
    }
  }

  throw new Error(`No exchange answered (${failures.join(", ")})`);
}

// ── IHSG: Yahoo Finance chart API, through our proxy ───────

interface YahooChartResponse {
  chart: {
    result:
      | {
          timestamp?: number[];
          indicators: { quote: { close: (number | null)[] }[] };
        }[]
      | null;
    error?: { description?: string } | null;
  };
}

/**
 * Yahoo answers with two parallel arrays: `timestamp` (seconds) and `close` (prices).
 * Index i in one matches index i in the other. `close` can contain null for gaps.
 */
async function fetchIhsg(range: RangeId, signal?: AbortSignal): Promise<SeriesResult> {
  // %5E is an encoded "^", so this is the symbol ^JKSE (the Jakarta Composite Index).
  const url = `${YAHOO_BASE}/v8/finance/chart/%5EJKSE?range=${YAHOO_RANGE[range]}&interval=1d`;
  const json = await getJson<YahooChartResponse>(url, signal);

  const result = json.chart?.result?.[0];
  if (!result?.timestamp) {
    throw new Error(json.chart?.error?.description ?? "Yahoo returned no data for the IHSG");
  }

  const closes = result.indicators.quote[0]?.close ?? [];
  const points = result.timestamp
    .map((t, i) => ({ t: t * 1000, v: closes[i] as number }))
    .filter((p) => typeof p.v === "number");

  return { points: requirePoints(points, "Yahoo Finance"), source: "Yahoo Finance", fetchedAt: Date.now() };
}

// ── Cache ───────────────────────────────────────────────────
// Two layers: a Map for this page visit, and localStorage so a refresh (or a failed request
// later on) can still show the last good data instead of an empty chart.

const memory = new Map<string, SeriesResult>();
const cacheKey = (asset: AssetId, range: RangeId) => `portfolio-market-v4:${asset}:${range}`;

function readCache(key: string): SeriesResult | null {
  const hit = memory.get(key);
  if (hit) return hit;

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SeriesResult;
    if (!Array.isArray(parsed.points) || parsed.points.length < 2) return null;
    memory.set(key, parsed);
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(key: string, value: SeriesResult) {
  memory.set(key, value);
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable: the Map still works */
  }
}

const isFresh = (asset: AssetId, result: SeriesResult) => Date.now() - result.fetchedAt < REFRESH_MS[asset];

/** Look in the cache without touching the network. Used to paint instantly. */
export function peekSeries(asset: AssetId, range: RangeId): { data: SeriesResult; fresh: boolean } | null {
  const cached = readCache(cacheKey(asset, range));
  return cached ? { data: cached, fresh: isFresh(asset, cached) } : null;
}

/**
 * The one function the app uses:
 *  1. fresh cache → return it, no request
 *  2. otherwise fetch (Bitcoin: Binance → Bybit → Coinbase. IHSG: Yahoo.)
 *  3. if the fetch fails but we have an old copy → return that, marked `stale`
 *  4. otherwise throw, and the UI shows an error (or, for the IHSG, the TradingView widget)
 */
export async function getSeries(asset: AssetId, range: RangeId, signal?: AbortSignal): Promise<SeriesResult> {
  const key = cacheKey(asset, range);
  const cached = readCache(key);
  if (cached && isFresh(asset, cached)) return cached;

  try {
    const fresh = asset === "btc" ? await fetchBitcoin(range, signal) : await fetchIhsg(range, signal);
    writeCache(key, fresh);
    return fresh;
  } catch (err) {
    if (signal?.aborted) throw err;
    if (import.meta.env.DEV) console.warn(`[market] ${asset} ${range} failed:`, err);
    if (cached) return { ...cached, stale: true };
    throw err;
  }
}
