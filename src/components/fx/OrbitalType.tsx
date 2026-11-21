import { useId } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

function Ring({ text, r = 170, className }: { text: string; r?: number; className?: string }) {
  const id = `o${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg viewBox="0 0 400 400" className={cn("h-full w-full overflow-visible", className)} aria-hidden="true">
      <defs>
        <path id={id} d={`M200 200 m-${r} 0 a${r} ${r} 0 1 1 ${r * 2} 0 a${r} ${r} 0 1 1 -${r * 2} 0`} />
      </defs>
      <text className="fill-current font-mono text-[15px] uppercase" letterSpacing="3">
        <textPath href={`#${id}`} textLength={2 * Math.PI * r - 6} lengthAdjust="spacing">
          {text}
        </textPath>
      </text>
    </svg>
  );
}

/** Text running round a ring, with a second ring tilted into 3D, both slowly turning. */
export function OrbitalType({ text, children, className }: { text: string; children?: ReactNode; className?: string }) {
  return (
    <div className={cn("relative aspect-square", className)}>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
      <div className="pointer-events-none absolute -inset-[6%] animate-orbit text-cream/45">
        <Ring text={text} />
      </div>
      <div className="pointer-events-none absolute -inset-[16%] [transform:perspective(900px)_rotateX(72deg)_rotateY(-8deg)]">
        <div className="h-full w-full animate-orbit-rev text-signal/80">
          <Ring text={text} />
        </div>
      </div>
    </div>
  );
}
