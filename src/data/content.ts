import { INK, INK_LIFT, ORCHID } from "../lib/palette";

/** Site root: "/" in dev, "/updated-portfolio/" on GitHub Pages (see vite.config.ts). */
const BASE = import.meta.env.BASE_URL;
// ─────────────────────────────────────────────────────────────
//  EDIT ME — everything shown on the site lives in this file.
// ─────────────────────────────────────────────────────────────

/** Which illustrated placeholder screen to draw when no real screenshot is given. */
export type ArtVariant = "splash" | "cards" | "timer" | "scan" | "chart" | "waves" | "list";

export interface GalleryItem {
  variant: ArtVariant;
  caption: string;
  /**
   * Optional real screenshot, e.g. "/projects/artie/home.png"
   * (put the file in the `public/projects/artie/` folder).
   * If omitted, or if the file is missing, the illustrated placeholder is shown.
   */
  src?: string;
  /**
   * Optional short screen recording, e.g. "/projects/artie/demo.mp4". Plays muted on a loop
   * in the hover preview and the project view; `src` doubles as its poster image.
   */
  video?: string;
}

export type ProjectKind = "app" | "game" | "research";

export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  /** One-liner shown on cards and at the top of an opened project. */
  blurb: string;
  /** Longer description shown when the project is opened. */
  overview: string;
  role: string;
  platform: string;
  highlights: string[];
  gallery: GalleryItem[];
  tags: string[];
  /** Two colours for the gradient and placeholder screens. */
  colors: [string, string];
  /** Optional external link (App Store, GitHub, live site…). Shows a "Visit" button. */
  href?: string;
  /** Featured projects get a card in the "Selected work" row near the top. */
  featured?: boolean;
  /** Decides the group in the index and the shape of the media frames. Defaults to "app". */
  kind?: ProjectKind;
}

export interface Social {
  label: string;
  href: string;
}

export interface Update {
  date: string;
  tag: string;
  title: string;
  href?: string;
}

export const profile = {
  name: "William",
  handle: "williamsilvanoangga",
  display: "William Silvano Angga",
  role: "Developer & designer",
  greeting: "Scroll down and I'll show you around.",
  greetingReturn: "Oh hi, you're back. Want the tour again?",
  hint: "Move your cursor around, or click anywhere.",
  titleLines: ["Design &", "Engineering"],
  tagline: "Small apps, built with care.",
  intro:
    "I'm a developer and designer who loves building apps that feel good to use, with a growing focus on SwiftUI and the whole Apple ecosystem.",
  email: "hello@example.com",
  location: "Bali, ID",
  place: ["Bali", "Indonesia"],
  timezone: "Asia/Makassar",
  timezoneLabel: "GMT+8",
  year: 2026,
  socials: [
    { label: "GitHub", href: "https://github.com/" },
    { label: "LinkedIn", href: "https://linkedin.com/" },
    { label: "X", href: "https://x.com/" },
  ] satisfies Social[],
};

/** The scrolling strip under the hero: tools in the grotesk, interests set apart in italic serif. */
export const ticker = [
  { label: "SwiftUI" },
  { label: "Chess", interest: true },
  { label: "TypeScript" },
  { label: "Basketball", interest: true },
  { label: "iOS" },
  { label: "Slam Dunk", interest: true },
  { label: "React" },
  { label: "Vagabond", interest: true },
  { label: "Core ML" },
  { label: "Stocks", interest: true },
  { label: "WidgetKit" },
  { label: "Crypto", interest: true },
];

/** The word that rolls after "I make" in the hero. */
export const heroWords = ["apps", "games", "widgets", "trading signals"];

export const statement = {
  before: "Small apps.",
  highlight: "Big on details.",
  after: "Sketched, built, shipped.",
};

/** Short paragraphs under the statement. Rewrite these in your own voice. */
export const about = [
  "I'm William, a developer and designer based in Bali. I started on the web with TypeScript and React, and now I'm all in on SwiftUI at the Apple Developer Academy, building apps that feel good to use.",
  "Away from the keyboard you'll find me on a basketball court, over a chessboard, reading manga, or watching the markets move. Those habits shape how I design and build.",
];

/** The about section's timeline. Drafted from your projects: fix the wording and dates to match your real path. */
export const path = [
  {
    when: "2021 – 2022",
    title: "Coding tutor",
    image: `${BASE}path/tutor.jpg`,
    alt: "William teaching a coding class",
    text: "My first job in tech was an internship teaching others to code. Explaining the same idea five different ways taught me to really understand it.",
    points: ["Taught beginners the basics of programming", "Broke big problems into small steps", "Learned patience and clear communication"],
  },
  {
    when: "Late 2023",
    title: "Graduated",
    image: `${BASE}path/graduation.jpg`,
    alt: "William at graduation",
    text: "I finished university and left with a degree and a habit of building things on the side. That is where my taste for simple, clean interfaces started.",
    points: ["Finished my degree in late 2023", "Built web projects outside of class", "Decided to try building something of my own"],
  },
  {
    when: "2024 – 2025",
    title: "My own business",
    image: `${BASE}path/business.jpg`,
    alt: "Wood pellets at a renewable energy supplier",
    text: "I ran my own company in renewable energy, mostly wood pellets. It was a crash course in how real businesses work, far from a code editor.",
    points: ["Sourced from suppliers and found buyers", "Negotiated deals and planned cash flow", "Made decisions with incomplete information"],
  },
  {
    when: "2026",
    title: "Apple Developer Academy",
    image: `${BASE}path/academy.jpg`,
    alt: "William at the Apple Developer Academy in Bali",
    text: "Now I am back to building full time in Bali, learning SwiftUI alongside a team of designers and developers. I bring the business side with me.",
    points: ["SwiftUI, RealityKit, Core ML and WidgetKit", "Shipped Artie, ChessUp and fisch", "Working in a team on real product briefs"],
  },
];

/** Tools grouped by what they are for. Taken from the tags on your projects. */
export const toolkit = [
  { label: "Apple", items: ["SwiftUI", "SwiftData", "WidgetKit", "ActivityKit", "RealityKit", "Core ML", "Vision"] },
  { label: "Web", items: ["TypeScript", "React", "Vite"] },
  { label: "Games", items: ["Godot 4", "GDScript"] },
  { label: "Other", items: ["Lottie", "Quant research"] },
];

/** What you can be hired for. Rewrite in your own words. */
export const services = [
  { title: "iOS apps", text: "SwiftUI apps from first sketch to something people can install, with widgets, Live Activities and motion done properly.", tags: ["SwiftUI", "WidgetKit", "Core ML"] },
  { title: "Interface & motion", text: "Screens and interactions with a point of view: layout, type, animation and the small details that make an app feel good.", tags: ["Design", "Prototyping", "Lottie"] },
  { title: "Games & experiments", text: "Playable prototypes and odd little ideas, in Godot or on the web, when a project needs something with a pulse.", tags: ["Godot 4", "Three.js", "React"] },
];

/** Small labelled facts shown under the about copy. */
export const facts = [
  { label: "Now", value: "SwiftUI at the Apple Developer Academy, Bali" },
  { label: "Off the clock", value: "Hoops, chess, manga, markets" },
  { label: "Method", value: "Sketch, build, ship" },
];

/** Each step also gets a chess phase, shown next to its number. */
export const steps = [
  { n: "01", aside: "Opening", title: "Sketch", text: "Start with the problem. Rough ideas, quick prototypes, lots of questions." },
  { n: "02", aside: "Middlegame", title: "Build", text: "Turn the best idea into working software, with motion and detail." },
  { n: "03", aside: "Endgame", title: "Ship", text: "Polish, test on real devices, and put it in people's hands." },
];

/** Dated cards, in the style of a "latest news" row. Edit freely. */
export const updates: Update[] = [
  { date: "10.30.26", tag: "Portfolio", title: "Launched this portfolio, built with React and TypeScript." },
  { date: "2026", tag: "Learning", title: "Diving deep into SwiftUI at the Apple Developer Academy in Bali." },
  {
    date: "Now",
    tag: "Availability",
    title: "Open to new projects and collaborations. Say hello.",
    href: "#contact",
  },
];

/** What the mascot says as you scroll. */
export const tour = {
  statement: "That's the short version of me.",
  interests: "Now the fun part: what I do off the clock.",
  code: "Started on the web, now all in on SwiftUI.",
  ecosystem: "Tap a framework to see where I've used it.",
  chess: "White to move. Can you spot the mate in one?",
  hoop: "Hold to charge, release in the green zone.",
  market: "Real data: the IDX Composite and Bitcoin. Not financial advice!",
  manga: "Slam Dunk and Vagabond. Great taste, if I say so myself.",
  process: "Here's how I usually work.",
  work: "Everything else is in this list. Click a row to open it.",
  updates: "A few recent bits.",
  contact: "Write me anytime. Click and it's copied.",
  idle: "Psst. You can grab me.",
  grabbed: "Wheee!",
  dropped: "Thanks for the ride.",
  /** One is picked at random when you press "Do a trick". */
  tricks: ["Slam dunk!", "Checkmate!", "To the moon!", "Ship it!", "Ta-da!"],
};

// Drafted from the apps in your "Apple Projects" folder.
// The overviews and highlights are placeholders: rewrite them in your own words.
export const projects: Project[] = [
  {
    id: "artie",
    title: "Artie",
    category: "iOS App",
    year: "2026",
    blurb: "A charm-collecting app with 3D keychains, physics-based collages and nearby trading.",
    overview:
      "Artie turns collecting into play. Charms hang from a 3D keychain you can swing around, snap into collages, and trade with people who are close by.",
    role: "Design & development",
    platform: "iOS",
    highlights: [
      "A 3D keychain with physics-driven swinging and haptic feedback.",
      "A drag-and-drop collage board for arranging your charms.",
      "Nearby trading between two devices, no accounts needed.",
    ],
    gallery: [
      { variant: "splash", caption: "Home", src: `${BASE}projects/artie/home.jpg` },
      { variant: "cards", caption: "Scraps", src: `${BASE}projects/artie/scraps.jpg` },
      { variant: "list", caption: "Trading", src: `${BASE}projects/artie/trade.jpg` },
    ],
    tags: ["SwiftUI", "RealityKit", "Lottie"],
    colors: [INK, ORCHID],
    featured: true,
  },
  {
    id: "chessup",
    title: "ChessUp",
    category: "iOS App · Computer Vision",
    year: "2026",
    blurb: "Point your camera at a real chessboard and play against an engine, with spoken moves.",
    overview:
      "Set up a real board, point the camera, and ChessUp reads the position, suggests moves and announces them out loud, so you can keep your eyes on the pieces.",
    role: "Design & development",
    platform: "iOS",
    highlights: [
      "On-device piece detection using Core ML and Vision.",
      "Engine analysis with spoken move announcements.",
      "Designed around a simple overhead camera angle.",
    ],
    gallery: [
      { variant: "scan", caption: "Welcome", src: `${BASE}projects/chessup/welcome.jpg` },
      { variant: "chart", caption: "Choose a side", src: `${BASE}projects/chessup/side.jpg` },
      { variant: "list", caption: "Difficulty", src: `${BASE}projects/chessup/difficulty.jpg` },
    ],
    tags: ["Core ML", "Vision", "AVFoundation"],
    colors: [INK_LIFT, ORCHID],
    featured: true,
  },
  {
    id: "fisch",
    title: "fisch",
    category: "iOS App · Widgets",
    year: "2026",
    blurb: "A pixel-art focus timer where a pet grows while you stay off your phone.",
    overview:
      "Stay focused and your pixel-art pet grows. The timer lives on your lock screen and home screen, so progress is always one glance away.",
    role: "Design & development",
    platform: "iOS",
    highlights: [
      "A Live Activity timer on the lock screen and Dynamic Island.",
      "Home-screen widgets that show your pet's progress.",
      "Hand-made pixel-art animations.",
    ],
    gallery: [
      { variant: "timer", caption: "Focus session", src: `${BASE}projects/fisch/focus.jpg` },
      { variant: "splash", caption: "Your pet", src: `${BASE}projects/fisch/home.jpg` },
      { variant: "chart", caption: "Pet collection", src: `${BASE}projects/fisch/pets.jpg` },
    ],
    tags: ["SwiftUI", "WidgetKit", "Live Activities"],
    colors: [INK, ORCHID],
    featured: true,
  },
  {
    id: "tantrum-noya",
    title: "TantrumNoYa",
    category: "iOS App · Accessibility",
    year: "2026",
    blurb: "A calm-down companion that guides caregivers through steps when a child is overwhelmed.",
    overview:
      "When a child is overwhelmed, thinking clearly is hard. TantrumNoYa walks a caregiver through simple, ordered steps, designed to be used quickly and one-handed.",
    role: "Design & development",
    platform: "iOS",
    highlights: [
      "Step-by-step guidance built for stressful moments.",
      "Quick access through Shortcuts and AirPods gestures.",
      "Data stays on the device with SwiftData.",
    ],
    gallery: [
      { variant: "splash", caption: "Meet Noya", src: `${BASE}projects/tantrum-noya/intro.jpg` },
      { variant: "list", caption: "Head-nod control", src: `${BASE}projects/tantrum-noya/nod.jpg` },
      { variant: "cards", caption: "Home", src: `${BASE}projects/tantrum-noya/home.jpg` },
    ],
    tags: ["SwiftData", "App Intents", "AirPods"],
    colors: [INK_LIFT, ORCHID],
  },
  {
    id: "friend-tracker",
    title: "FriendTracker",
    category: "iOS App",
    year: "2025",
    blurb: "Keep track of the people you care about and when you last caught up.",
    overview:
      "A gentle nudge to stay in touch. Keep notes on the people who matter and see at a glance who you haven't spoken to in a while.",
    role: "Design & development",
    platform: "iOS",
    highlights: [
      "Simple reminders for staying in touch.",
      "Quick notes for each friend.",
      "Private by default, stored on your device.",
    ],
    gallery: [
      { variant: "list", caption: "Friends", src: `${BASE}projects/friend-tracker/friends.jpg` },
      { variant: "cards", caption: "New friend", src: `${BASE}projects/friend-tracker/new.jpg` },
    ],
    tags: ["SwiftUI", "Core Data"],
    colors: [INK, ORCHID],
  },
  {
    id: "gnome-runner",
    kind: "game",
    title: "Gnome Runner",
    category: "Game · Godot 4",
    year: "2026",
    blurb: "An endless runner where a gnome sprints through a parallax forest.",
    overview:
      "An endless runner built in Godot 4. A gnome runs through a parallax forest while the speed ramps up and obstacles appear along the way.",
    role: "Design & development",
    platform: "Godot 4",
    highlights: [
      "Speed ramps up over a run, from a starting speed to a cap.",
      "Four obstacle types, each its own scene: stump, rock, barrel and bird.",
      "Parallax forest, scrolling ground and a live score and high score HUD.",
    ],
    gallery: [
      { variant: "splash", caption: "Run" },
      { variant: "list", caption: "Score" },
    ],
    tags: ["Godot 4", "GDScript"],
    colors: [INK, ORCHID],
  },
  {
    id: "parkirin",
    kind: "game",
    title: "Parkirin",
    category: "Game · Godot 4",
    year: "2026",
    blurb: "A Block Blast-style puzzle where you drag vehicles onto a parking grid.",
    overview:
      "A Godot 4 puzzle game in the Block Blast style, with parking as the theme. You place vehicles on an 8×8 grid while more arrive along queue lanes.",
    role: "Design & development",
    platform: "Godot 4",
    highlights: [
      "Drag to place on an 8×8 grid, with ghost previews and vehicle rotation.",
      "Vehicles with non-rectangular footprints.",
      "A weighted spawn system with convoy events.",
    ],
    gallery: [
      { variant: "cards", caption: "Grid" },
      { variant: "list", caption: "Queue" },
    ],
    tags: ["Godot 4"],
    colors: [INK_LIFT, ORCHID],
  },
  {
    id: "worldquant-brain",
    kind: "research",
    title: "Alpha research",
    category: "Research · Quant",
    year: "2026",
    blurb: "Equity alphas on WorldQuant Brain.",
    overview:
      "Researching and refining equity alphas on WorldQuant Brain, from implied volatility skew to fundamentals and sentiment.",
    role: "Research",
    platform: "WorldQuant Brain",
    highlights: [
      "Signals built around implied volatility skew, debt, earnings yield and price reversion.",
      "Tuned against Sharpe, fitness, drawdown, turnover and self-correlation.",
    ],
    gallery: [
      { variant: "chart", caption: "Performance" },
      { variant: "list", caption: "Alphas" },
    ],
    tags: ["WorldQuant Brain", "Quant"],
    colors: [INK, ORCHID],
  },
];
