import { useState } from "react";
import { useInView } from "../hooks/useInView";
import { RANGES } from "../lib/marketData";
import type { RangeId } from "../lib/marketData";
import { BitcoinView } from "./BitcoinView";
import { IhsgView } from "./IhsgView";

type Asset = "ihsg" | "btc";

/**
 * The finance card. It owns only the two switches (which market, which range) and hands them
 * to the matching view. Both views draw through MarketFrame, so they look the same.
 */
export function MarketChart() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  const [asset, setAsset] = useState<Asset>("btc");
  const [range, setRange] = useState<RangeId>("1M");

  return (
    <div ref={ref} className="market">
      <div className="market__top">
        <div className="segmented mono" role="group" aria-label="Market">
          <button type="button" className={asset === "ihsg" ? "is-active" : ""} aria-pressed={asset === "ihsg"} onClick={() => setAsset("ihsg")}>
            IHSG
          </button>
          <button type="button" className={asset === "btc" ? "is-active" : ""} aria-pressed={asset === "btc"} onClick={() => setAsset("btc")}>
            Bitcoin
          </button>
        </div>

        <div className="segmented segmented--sm mono" role="group" aria-label="Time range">
          {RANGES.map((id) => (
            <button key={id} type="button" className={range === id ? "is-active" : ""} aria-pressed={range === id} onClick={() => setRange(id)}>
              {id}
            </button>
          ))}
        </div>
      </div>

      {asset === "ihsg" ? <IhsgView range={range} active={inView} /> : <BitcoinView range={range} active={inView} />}
    </div>
  );
}
