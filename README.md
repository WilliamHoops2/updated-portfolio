# Portfolio

Personal portfolio built with **React + TypeScript + Vite**.

## Design references

- **Layout**: haoqi.design. Fixed mono header with THEME / SOUND toggles, live clock and cursor coordinates under the nav, oversized hero type, plain list-driven "All work", big closing call to action with a socials row.
- **Motion and character**: sebg.ch. Electric blue accent, a mascot that guides you down the page, click-to-copy email, "Do a trick" button.
- **Mood and components**: inkgames.com. Deep `#0A0E11` dark band for the process section, small dotted eyebrow labels, hover-roll text on links and buttons, dated "Latest from…" update cards, multi-column footer.

## Get started

```bash
cd "/Users/itsjustw/Documents/Personal Projects/Portfolio"
npm install
npm run dev
```

Requires Node 18+ (20+ recommended).

## Page structure

1. **Hero**: particle field, lifting title letters, floating phones (click one to open that project). The ticker mixes tools and interests.
2. **Statement**: short intro with two paragraphs.
3. **Selected work**: three project cards with phones peeking out. Clicking one opens it in the "All work" list below.
4. **Interests** ("Beyond the code"): six cards, most of them playable.
   - **Coding**: a SwiftUI snippet that types itself out, and the TypeScript → React → SwiftUI path.
   - **iOS ecosystem**: tap a framework to see which of your projects use it (matched from each project's `tags`).
   - **Chess**: a clickable mate-in-one puzzle.
   - **Basketball**: hold to charge a shot, release in the green zone.
   - **Finance**: a *simulated* stocks/crypto chart (clearly labelled as made up).
   - **Manga & anime**: Slam Dunk and Vagabond as flip-able comic panels.
5. **Process**: dark band, "Sketch. Build. Ship.", with a chess phase for each step (Opening, Middlegame, Endgame).
6. **All work**: click any row and the project **unfolds downward in place** with overview, highlights and screens. Esc or "Close ↑" folds it back up.
7. **Updates**: dated cards.
8. **Contact**: "Got a project?", click-to-copy email, socials.
9. **Footer**: columns, "Do a trick", back to top.

The **mascot** (bottom-right) comments on each section and each interest card, its eyes follow your cursor, you can pick it up and drop it, and the footer button makes it do a trick (slam dunk, checkmate, to the moon…). Returning visitors get a different greeting.

All motion respects `prefers-reduced-motion`, and the live demos (code typing, chart) pause when off-screen.

## Edit your content

Everything on the page comes from `src/data/content.ts`: your name, email, socials, timezone, intro paragraphs, ticker words, mascot lines, updates and the project list. The project overviews and highlights are placeholders, so rewrite them in your own words.

Interest card copy lives in `src/components/Interests.tsx`. The chess puzzle position is the `FEN` constant in `ChessPuzzle.tsx`, and the code sample is `CODE` in `CodeCard.tsx`.

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
  components/   Header, StatusBar, Hero (+ Statement), HeroField, HeroPhones, Featured,
                Interests (+ CodeCard, EcosystemCard, ChessPuzzle, HoopGame, MarketChart, MangaPanels),
                Process, WorkList, Updates, Contact, Footer, Mascot, Roll, ScreenArt, Reveal
  hooks/        useClock, useCursor, useReveal, useInView, useTheme, useSound, useHeroPointer
  data/         content.ts
  index.css         tokens, base, header, hero, work list, updates, contact, footer
  experience.css    phones, hero visuals, project cards, process band, mascot
  interests.css     interests grid and the six interest cards
```

`ProjectModal.tsx` and `hooks/useStoryProgress.ts` are empty leftovers from earlier versions and can be deleted.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run typecheck` | Type-check only |
