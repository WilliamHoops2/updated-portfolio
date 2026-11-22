import { useEffect, useRef, useState } from "react";
import { useCanvasLoop } from "@/hooks/useCanvasLoop";
import { cn } from "@/lib/utils";

interface Props {
  src: string;
  alt: string;
  className?: string;
  /** Live particles. Drawn into a pixel buffer, so tens of thousands are cheap. */
  particleCount?: number;
  /** Side of each particle, in CSS px. */
  particleSize?: number;
  /** How hard the flow field pushes a particle each frame. */
  noiseStrength?: number;
  /** Velocity kept per frame; lower settles faster. */
  damping?: number;
  /** Frames before a particle drifts home and starts over. */
  lifespan?: number;
  /** Radius of the pointer's pull, in CSS px. */
  cursorRadius?: number;
  /** How much of the pointer's motion is handed to nearby particles. */
  cursorStrength?: number;
}

interface Field {
  w: number;
  h: number;
  hx: Float32Array;
  hy: Float32Array;
  x: Float32Array;
  y: Float32Array;
  vx: Float32Array;
  vy: Float32Array;
  life: Uint16Array;
  rgb: Uint8Array;
  rect: [number, number, number, number];
  layer: HTMLCanvasElement;
  data: ImageData;
  px: Uint32Array;
}

/**
 * A sharp photo with a swarm of its own pixels on top. Each particle drifts along a flow field,
 * eases back to where it came from, and starts again. The pointer drags nearby ones along with it,
 * so you can smear the picture apart and watch it knit back together.
 */
export function ParticleImage({
  src,
  alt,
  className,
  particleCount = 60000,
  particleSize = 2,
  noiseStrength = 0.09,
  damping = 0.95,
  lifespan = 220,
  cursorRadius = 90,
  cursorStrength = 0.35,
}: Props) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const field = useRef<Field | null>(null);
  const last = useRef({ x: 0, y: 0, on: false });

  useEffect(() => {
    const el = new Image();
    el.src = src;
    el.onload = () => setImg(el);
  }, [src]);

  const ref = useCanvasLoop({
    deps: [img, particleCount],
    maxDpr: 2,
    setup: (w, h) => {
      if (!img) return;
      const k = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * k;
      const dh = img.naturalHeight * k;
      const rect: Field["rect"] = [(w - dw) / 2, (h - dh) / 2, dw, dh];

      const cw = Math.max(1, Math.round(w));
      const ch = Math.max(1, Math.round(h));
      const sample = document.createElement("canvas");
      sample.width = cw;
      sample.height = ch;
      const sctx = sample.getContext("2d", { willReadFrequently: true })!;
      sctx.drawImage(img, ...rect);
      const src32 = sctx.getImageData(0, 0, cw, ch).data;

      const n = particleCount;
      const f: Field = {
        w: cw, h: ch, hx: new Float32Array(n), hy: new Float32Array(n), x: new Float32Array(n), y: new Float32Array(n),
        vx: new Float32Array(n), vy: new Float32Array(n), life: new Uint16Array(n), rgb: new Uint8Array(n * 3), rect,
        layer: document.createElement("canvas"), data: new ImageData(cw, ch), px: new Uint32Array(0),
      };
      f.layer.width = cw;
      f.layer.height = ch;
      f.px = new Uint32Array(f.data.data.buffer);
      for (let i = 0; i < n; i++) {
        const x = Math.random() * (cw - 1);
        const y = Math.random() * (ch - 1);
        f.hx[i] = f.x[i] = x;
        f.hy[i] = f.y[i] = y;
        const o = (Math.floor(y) * cw + Math.floor(x)) * 4;
        f.rgb[i * 3] = src32[o];
        f.rgb[i * 3 + 1] = src32[o + 1];
        f.rgb[i * 3 + 2] = src32[o + 2];
      }
      field.current = f;
    },
    frame: (ctx, w, h, t, p) => {
      const f = field.current;
      if (!img || !f) return;
      ctx.drawImage(img, ...f.rect);

      // pointer velocity, from how far it moved since the last frame
      let pvx = 0;
      let pvy = 0;
      if (p.on && last.current.on) {
        pvx = p.x - last.current.x;
        pvy = p.y - last.current.y;
      }
      last.current = { x: p.x, y: p.y, on: p.on };

      const px = f.px;
      px.fill(0);
      const s = particleSize;
      const R2 = cursorRadius * cursorRadius;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      for (let i = 0; i < particleCount; i++) {
        let x = f.x[i];
        let y = f.y[i];
        let vx = f.vx[i];
        let vy = f.vy[i];
        let near = false;
        let fall = 0;
        let dx = 0;
        let dy = 0;
        if (p.on) {
          dx = x - p.x;
          dy = y - p.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R2) {
            near = true;
            fall = 1 - Math.sqrt(d2) / cursorRadius;
          }
        }
        // Dormant until the pointer touches it, so the photo stays clear at rest.
        if (f.life[i] === 0 && !near) continue;
        const life = ++f.life[i];
        const age = life / lifespan;

        if (!reduce) {
          // layered sine waves stand in for a noise field
          const a = (Math.sin(x * 0.011 + t * 0.4) + Math.cos(y * 0.013 - t * 0.3) + Math.sin((x + y) * 0.006 + t * 0.2)) * 2.1;
          vx += Math.cos(a) * noiseStrength;
          vy += Math.sin(a) * noiseStrength;
        }
        if (near) {
          vx += pvx * cursorStrength * fall - dy * 0.012 * fall;
          vy += pvy * cursorStrength * fall + dx * 0.012 * fall;
        }
        if (age > 0.6) {
          // the last stretch of its life: glide home so the picture reforms
          const pull = 0.035 * Math.min(1, (age - 0.6) / 0.4);
          vx += (f.hx[i] - x) * pull;
          vy += (f.hy[i] - y) * pull;
        }
        vx *= damping;
        vy *= damping;
        x += vx;
        y += vy;
        if (life >= lifespan) {
          x = f.hx[i];
          y = f.hy[i];
          vx = vy = 0;
          f.life[i] = 0;
        }
        f.x[i] = x;
        f.y[i] = y;
        f.vx[i] = vx;
        f.vy[i] = vy;

        // invisible at home, fully there once it has wandered a few pixels
        const away = Math.abs(x - f.hx[i]) + Math.abs(y - f.hy[i]);
        const alpha = Math.min(1, away / 8) * 0.9;
        if (alpha < 0.04) continue;
        const ix = x | 0;
        const iy = y | 0;
        if (ix < 0 || iy < 0 || ix + s > f.w || iy + s > f.h) continue;
        const col = (Math.round(alpha * 255) << 24) | (f.rgb[i * 3 + 2] << 16) | (f.rgb[i * 3 + 1] << 8) | f.rgb[i * 3];
        for (let oy = 0; oy < s; oy++) for (let ox = 0; ox < s; ox++) px[(iy + oy) * f.w + ix + ox] = col;
      }

      f.layer.getContext("2d")!.putImageData(f.data, 0, 0);
      ctx.drawImage(f.layer, 0, 0, w, h);
    },
  });

  return <canvas ref={ref} role="img" aria-label={alt} className={cn("h-full w-full", className)} />;
}
