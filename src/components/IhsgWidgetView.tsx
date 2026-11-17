import type { RangeId } from "../lib/marketData";
import { MarketFrame } from "./MarketFrame";
import { TradingViewMini } from "./TradingViewMini";

const SYMBOL = "IDX:COMPOSITE";
const PAGE = "https://www.tradingview.com/symbols/IDX-COMPOSITE/";

interface IhsgWidgetViewProps {
  range: RangeId;
}

/**
 * The fallback IHSG view, used when our own chart can't get data (for example on a deployed site
 * with no Yahoo proxy). It uses the same MarketFrame, so the layout matches. The widget is an
 * iframe, so we can't read the index level out of it: the headline is the name, and there's no
 * hover readout.
 */
export function IhsgWidgetView({ range }: IhsgWidgetViewProps) {
  return (
    <MarketFrame
      headline={<strong>IDX Composite</strong>}
      sub="IHSG · end-of-day"
      plotClassName="market__plot--tv"
      plot={<TradingViewMini symbol={SYMBOL} range={range} fallbackHref={PAGE} />}
      note={
        <>
          <a href={PAGE} target="_blank" rel="noopener nofollow">
            IDX Composite chart
          </a>{" "}
          by TradingView · end-of-day data · not financial advice
        </>
      }
    />
  );
}
