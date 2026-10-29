# Portfolio

Personal portfolio built with **React + TypeScript + Vite**.

## Design references

- **Layout** — haoqi.design: fixed mono header (THEME / SOUND toggles), live clock and cursor coordinates, oversized hero type, list-driven "All work" with a cursor-following preview.
- **Motion and accent** — sebg.ch: electric blue accent, playful reveal animations, stack ticker, click-to-copy email.
- **Mood** — inkgames.com: deep `#0A0E11` dark theme, bold rounded cards, numbered "Sketch. Build. Ship." steps.

## Get started

```bash
cd "/Users/itsjustw/Documents/Personal Projects/Portfolio"
npm install
npm run dev
```

Requires Node 18+ (20+ recommended).

## Edit your content

Everything on the page comes from `src/data/content.ts`: your name, email, socials, timezone and the project list. Project entries were drafted from the apps in your Apple Projects folder, so rewrite the blurbs in your own words.

To use real images for projects, drop them in `public/` and replace the gradient covers in `src/components/Featured.tsx` and `WorkList.tsx`.

## Structure

```
src/
  components/   Header, Hero, Featured, Process, WorkList, Contact, Footer, StatusBar, Reveal
  hooks/        useClock, useCursor, useReveal, useTheme, useSound
  data/         content.ts
  index.css     design tokens + all styles
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run typecheck` | Type-check only |
