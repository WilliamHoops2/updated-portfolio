# Portfolio

Personal portfolio built with **React + TypeScript + Vite**.

## Design references

- **Layout**: haoqi.design. Fixed mono header (THEME / SOUND toggles), live clock and cursor coordinates, oversized hero type, list-driven "All work" with a cursor-following preview.
- **Motion and accent**: sebg.ch. Electric blue accent, playful reveal animations, stack ticker, click-to-copy email.
- **Mood**: inkgames.com. Deep `#0A0E11` dark theme, bold rounded cards, numbered "Sketch. Build. Ship." steps.

## Get started

```bash
cd "/Users/itsjustw/Documents/Personal Projects/Portfolio"
npm install
npm run dev
```

Requires Node 18+ (20+ recommended).

## Interactive bits

- **Hero particle field**: dots drift, link up, shy away from your cursor, and scatter with a ripple when you click (`HeroField.tsx`).
- **Hero title**: letters near the cursor lift and turn accent-coloured (`useHeroPointer.ts`).
- **Hero phones**: three floating phones tilt with your mouse. Click one to open that project (`HeroPhones.tsx`).
- **Project pop-ups**: click any card, work row or hero phone. Esc closes, ← / → switch projects (`ProjectModal.tsx`).

All motion respects `prefers-reduced-motion`, and the particle loop pauses when the hero is off-screen.

## Edit your content

Everything on the page comes from `src/data/content.ts`: your name, email, socials, timezone and the project list. The overviews and highlights for each project are placeholders, so rewrite them in your own words.

## Adding real screenshots

Until you add screenshots, each project shows illustrated placeholder screens drawn from its colours.

1. Put your images in `public/projects/<project-id>/`, for example `public/projects/artie/home.png`.
2. In `src/data/content.ts`, add `src` to a gallery item:

   ```ts
   gallery: [
     { variant: "splash", caption: "Home", src: "/projects/artie/home.png" },
   ],
   ```

If the file is missing, the placeholder is shown instead. Portrait phone screenshots (about 1:2) look best.

## Structure

```
src/
  components/   Header, Hero, HeroField, HeroPhones, Featured, Process, WorkList,
                ProjectModal, ScreenArt, Contact, Footer, StatusBar, Reveal
  hooks/        useClock, useCursor, useReveal, useTheme, useSound, useHeroPointer
  data/         content.ts
  index.css         base design tokens and styles
  experience.css    hero visuals, phone mockups, project pop-up
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run typecheck` | Type-check only |
