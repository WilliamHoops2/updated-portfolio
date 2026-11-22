import type { ReactNode } from "react";

const S = { fill: "none", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const cream = { ...S, stroke: "#e9dcc0" };
const signal = { ...S, stroke: "#b9f27c" };

/** One simple line drawing per chapter of the path, shown until a real photo is added to public/path/. */
export const pathArt: ReactNode[] = [
  // Coding tutor: a code window and a speech bubble
  <>
    <rect x="70" y="40" width="150" height="100" rx="12" {...cream} />
    <path d="M70 62h150" {...cream} />
    <circle cx="86" cy="51" r="2" {...signal} />
    <path d="m108 88-16 14 16 14M146 88l16 14-16 14M135 82l-8 40" {...signal} />
    <path d="M232 70h40a8 8 0 0 1 8 8v26a8 8 0 0 1-8 8h-22l-12 10v-10h-6a8 8 0 0 1-8-8V78a8 8 0 0 1 8-8Z" {...cream} />
    <path d="M240 86h32M240 96h20" {...cream} />
  </>,
  // Graduation: a cap
  <>
    <path d="m160 46 90 38-90 38-90-38Z" {...signal} />
    <path d="M112 104v28c0 8 22 16 48 16s48-8 48-16v-28" {...cream} />
    <path d="M250 84v44" {...cream} />
    <circle cx="250" cy="134" r="5" {...signal} />
  </>,
  // Own business: a pile of wood pellets, and a leaf
  <>
    {[[110, 132], [140, 132], [170, 132], [200, 132], [125, 108], [155, 108], [185, 108], [140, 84], [170, 84], [155, 60]].map(([x, y]) => (
      <rect key={`${x}-${y}`} x={x - 13} y={y - 9} width="26" height="18" rx="9" {...cream} />
    ))}
    <path d="M250 70c-30 0-42 20-42 42 24 0 42-14 42-42Z" {...signal} />
    <path d="M250 70c-14 8-24 22-30 36" {...signal} />
  </>,
  // Apple Developer Academy: a phone with a grid of app icons
  <>
    <rect x="118" y="26" width="84" height="130" rx="16" {...cream} />
    <path d="M148 36h24" {...cream} />
    {[0, 1].flatMap((r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={134 + c * 34} y={58 + r * 34} width="24" height="24" rx="7" {...(r === 1 && c === 1 ? signal : cream)} />))}
    <path d="m250 52 4 10 10 4-10 4-4 10-4-10-10-4 10-4Z" {...signal} />
    <path d="m72 112 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z" {...signal} />
  </>,
];
