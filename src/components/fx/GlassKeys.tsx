import { useRef } from "react";
import { useCanvasLoop } from "@/hooks/useCanvasLoop";
import { cn } from "@/lib/utils";

const LETTERS = "QWERTYUIOPASDFGHJKLZXCVBNM";

/** A board of frosted keys. They sink under the pointer, and a few type themselves. */
export function GlassKeys({ className }: { className?: string }) {
  const depth = useRef<Float32Array>(new Float32Array(0));
  const auto = useRef<Float32Array>(new Float32Array(0));
  const grid = useRef({ cols: 0, rows: 0, size: 64, ox: 0, oy: 0 });
  const lastAuto = useRef(0);

  const ref = useCanvasLoop({
    setup: (w, h) => {
      const size = Math.max(52, Math.min(84, w / 16));
      const cols = Math.ceil(w / size) + 1;
      const rows = Math.ceil(h / size) + 1;
      grid.current = { cols, rows, size, ox: (w - cols * size) / 2, oy: (h - rows * size) / 2 };
      depth.current = new Float32Array(cols * rows);
      auto.current = new Float32Array(cols * rows);
    },
    frame: (ctx, _w, _h, t, p) => {
      const { cols, rows, size, ox, oy } = grid.current;
      if (t - lastAuto.current > 0.14) {
        lastAuto.current = t;
        auto.current[Math.floor(Math.random() * cols * rows)] = 1;
      }
      const gap = size * 0.12;
      const face = size - gap;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `500 ${size * 0.26}px "JetBrains Mono", monospace`;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const x = ox + c * size + gap / 2;
          const y = oy + r * size + gap / 2;
          const near = p.on ? Math.max(0, 1 - Math.hypot(x + face / 2 - p.x, y + face / 2 - p.y) / (size * 2.4)) : 0;
          const target = Math.max(near, auto.current[i]);
          auto.current[i] *= 0.9;
          depth.current[i] += (target - depth.current[i]) * 0.22;
          const d = depth.current[i];
          const inset = d * 3;
          const fy = y + d * 5;

          ctx.fillStyle = "rgba(0,0,0,0.35)";
          ctx.beginPath();
          ctx.roundRect(x, y + 4, face, face, 12);
          ctx.fill();

          const grad = ctx.createLinearGradient(0, fy, 0, fy + face);
          grad.addColorStop(0, `rgba(233,220,192,${0.13 + d * 0.1})`);
          grad.addColorStop(1, `rgba(233,220,192,${0.03 + d * 0.06})`);
          ctx.fillStyle = grad;
          ctx.strokeStyle = d > 0.05 ? `rgba(185,242,124,${0.15 + d * 0.6})` : "rgba(233,220,192,0.16)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(x + inset, fy + inset, face - inset * 2, face - inset * 2, 11);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = d > 0.05 ? `rgba(185,242,124,${0.3 + d * 0.7})` : "rgba(233,220,192,0.22)";
          ctx.fillText(LETTERS[(r * 7 + c * 3) % LETTERS.length], x + face / 2, fy + face / 2);
        }
      }
    },
  });
  return <canvas ref={ref} aria-hidden="true" className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} />;
}
