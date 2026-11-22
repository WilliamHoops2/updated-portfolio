import { useCanvasLoop } from "@/hooks/useCanvasLoop";
import { cn } from "@/lib/utils";

const RAMP = " .·:-=+*#%@";
const CW = 9;
const CH = 16;

/** A field of characters that swells like water, and ripples around the pointer. */
export function AsciiWave({ className }: { className?: string }) {
  const ref = useCanvasLoop({
    frame: (ctx, w, h, t, p) => {
      const cols = Math.ceil(w / CW);
      const rows = Math.ceil(h / CH);
      const buckets: number[][] = Array.from({ length: RAMP.length }, () => []);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let v =
            (Math.sin(c * 0.09 + t * 0.9) + Math.sin(r * 0.15 - t * 0.7) + Math.sin((c + r) * 0.05 + t * 0.5) + 3) / 6;
          if (p.on) {
            const d = Math.hypot(c * CW - p.x, r * CH - p.y);
            v += Math.exp(-(d * d) / (2 * 150 * 150)) * (0.5 + 0.5 * Math.sin(d * 0.07 - t * 5)) * 0.7;
          }
          const level = Math.min(RAMP.length - 1, Math.floor(Math.pow(Math.max(0, v), 1.7) * RAMP.length));
          if (level > 0) buckets[level].push(c * CW, r * CH + CH - 3);
        }
      }
      ctx.font = `${CH - 2}px "JetBrains Mono", monospace`;
      for (let level = 1; level < RAMP.length; level++) {
        ctx.fillStyle = `rgba(185,242,124,${0.05 + (level / RAMP.length) * 0.5})`;
        const ch = RAMP[level];
        const list = buckets[level];
        for (let i = 0; i < list.length; i += 2) ctx.fillText(ch, list[i], list[i + 1]);
      }
    },
  });
  return <canvas ref={ref} aria-hidden="true" className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} />;
}
