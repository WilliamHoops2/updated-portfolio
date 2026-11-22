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

/** A faint line of text running round a ring that slowly turns. */
export function OrbitalType({ text, children, className }: { text: string; children?: ReactNode; className?: string }) {
  return (
    <div className={cn("relative aspect-square", className)}>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
      <div className="pointer-events-none absolute -inset-[6%] animate-orbit text-cream/30">
        <Ring text={text} />
      </div>
    </div>
  );
}
