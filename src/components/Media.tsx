import { useState } from "react";
import type { GalleryItem } from "../data/content";

interface MediaProps {
  item: GalleryItem;
  projectId: string;
  /** CSS aspect-ratio, e.g. "9 / 19.5". */
  aspect: string;
  className?: string;
}

/**
 * A screen recording if there is one, otherwise a screenshot, otherwise a placeholder frame.
 *
 * The placeholder is drawn with CSS only, in the project's own colours, with a shape picked by the
 * item's `variant` (see `.media--*` in work.css). It is deliberately abstract: no fake UI, so it
 * reads as "image goes here" and not as a screenshot. Add `src` (or `video`) to a gallery item in
 * content.ts and the real thing replaces it.
 */
export function Media({ item, projectId, aspect, className = "" }: MediaProps) {
  const [failed, setFailed] = useState(false);
  const style = { aspectRatio: aspect };
  const classes = `media ${className}`.trim();

  if (!failed && item.video) {
    return (
      <div className={classes} style={style}>
        <video
          src={item.video}
          poster={item.src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={item.caption}
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  if (!failed && item.src) {
    return (
      <div className={classes} style={style}>
        <img src={item.src} alt={item.caption} loading="lazy" onError={() => setFailed(true)} />
      </div>
    );
  }

  return (
    <div
      className={`${classes} media--empty media--${item.variant}`}
      style={style}
      role="img"
      aria-label={`${item.caption} (placeholder)`}
      title={`Placeholder. Add a screenshot or recording in public/projects/${projectId}/ and set it as src in content.ts`}
    >
      <span className="media__caption mono">{item.caption}</span>
    </div>
  );
}
