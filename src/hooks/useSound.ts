import { useCallback, useRef, useState } from "react";

/** Tiny WebAudio "tick" for hover feedback. Off by default; the browser only allows audio after a click. */
export function useSound() {
  const [enabled, setEnabled] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);

  const tick = useCallback(
    (frequency = 880) => {
      if (!enabled) return;
      const ctx = ctxRef.current;
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    },
    [enabled],
  );

  const toggle = useCallback(() => {
    setEnabled((on) => {
      const next = !on;
      if (next && !ctxRef.current) {
        const Ctor =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (Ctor) ctxRef.current = new Ctor();
      }
      void ctxRef.current?.resume();
      return next;
    });
  }, []);

  return { enabled, toggle, tick };
}
