import { Fragment } from "react";
import type { CSSProperties } from "react";

/**
 * Splits text into words that rise out of a mask when the parent `.reveal--split` becomes visible.
 * `start` offsets the stagger so several pieces in one heading stay in sequence.
 */
export function SplitText({ text, start = 0 }: { text: string; start?: number }) {
  return (
    <>
      {text.split(" ").map((word, i, all) => (
        <Fragment key={i}>
          <span className="sw" style={{ "--i": start + i } as CSSProperties}>
            <span>{word}</span>
          </span>
          {i < all.length - 1 && " "}
        </Fragment>
      ))}
    </>
  );
}
