// ─────────────────────────────────────────────────────────────
//  Does any crypto exchange list an Indonesian market (IDX Composite / IHSG)?
//
//  Run:  node scripts/scan-exchanges.mjs        (needs Node 18+)
//
//  It downloads each exchange's public list of futures/perpetual contracts and looks for
//  names that look Indonesian. Nothing is traded and no API key is used.
//  This file is just a research tool: it isn't part of the website and can be deleted.
// ─────────────────────────────────────────────────────────────

// Substrings that would show up in an Indonesian index or stock market name.
const PATTERN = /(JKSE|IHSG|COMPOSITE|LQ45|INDONESIA|IDX30|IDX50|^IDX|^JCI)/i;

// Field names that hold a market's symbol or name in the various exchange formats.
const NAME_KEYS = new Set([
  "symbol", "instId", "name", "fullName", "baseCoin", "baseAsset",
  "underlyingTicker", "pair", "description", "underlying", "displayName",
]);

async function getJson(url, options = {}) {
  const res = await fetch(url, { ...options, signal: AbortSignal.timeout(12000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/** Walks any JSON and collects every string stored under a "name-like" key. */
function collectNames(node, found) {
  if (Array.isArray(node)) {
    node.forEach((item) => collectNames(item, found));
  } else if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      if (typeof value === "string" && NAME_KEYS.has(key)) found.add(value);
      else collectNames(value, found);
    }
  }
}

// Bybit returns its contracts in pages.
async function bybit() {
  const pages = [];
  let cursor = "";
  for (let i = 0; i < 10; i++) {
    const suffix = cursor ? `&cursor=${encodeURIComponent(cursor)}` : "";
    const json = await getJson(`https://api.bybit.com/v5/market/instruments-info?category=linear&limit=1000${suffix}`);
    pages.push(json);
    cursor = json?.result?.nextPageCursor;
    if (!cursor) break;
  }
  return pages;
}

// Hyperliquid's main book, plus the extra "builder" venues where stocks and indices live.
async function hyperliquid() {
  const post = (body) =>
    getJson("https://api.hyperliquid.xyz/info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

  const results = [await post({ type: "meta" })];
  try {
    const dexs = await post({ type: "perpDexs" });
    results.push(dexs);
    for (const dex of dexs ?? []) {
      if (dex?.name) results.push(await post({ type: "meta", dex: dex.name }));
    }
  } catch {
    /* the extra venues are a bonus; the main list is already scanned */
  }
  return results;
}

const SOURCES = [
  { name: "Binance", load: () => getJson("https://fapi.binance.com/fapi/v1/exchangeInfo") },
  { name: "Bybit", load: bybit },
  { name: "Bitget", load: () => getJson("https://api.bitget.com/api/v2/mix/market/contracts?productType=usdt-futures") },
  { name: "OKX", load: () => getJson("https://www.okx.com/api/v5/public/instruments?instType=SWAP") },
  { name: "KuCoin", load: () => getJson("https://api-futures.kucoin.com/api/v1/contracts/active") },
  { name: "Coinbase Intl", load: () => getJson("https://api.international.coinbase.com/api/v1/instruments") },
  { name: "Hyperliquid", load: hyperliquid },
];

const results = await Promise.all(
  SOURCES.map(async (source) => {
    try {
      const names = new Set();
      collectNames(await source.load(), names);
      const hits = [...names].filter((name) => PATTERN.test(name));
      return `${source.name.padEnd(14)} scanned ${String(names.size).padStart(4)} names → ${hits.length ? hits.join(", ") : "nothing Indonesian"}`;
    } catch (err) {
      return `${source.name.padEnd(14)} skipped (${err.message}). It may be blocked in your region.`;
    }
  }),
);

console.log("\nIndonesian markets on crypto exchanges:\n");
results.forEach((line) => console.log(line));
console.log("\nAny match above is worth a closer look. 'nothing Indonesian' means no such market is listed.\n");
