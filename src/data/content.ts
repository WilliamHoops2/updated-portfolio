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
}

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
  handle: "itsjustw",
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

/** The scrolling strip under the hero: a mix of tools and interests. */
export const ticker = [
  "SwiftUI",
  "Chess",
  "TypeScript",
  "Basketball",
  "iOS",
  "Slam Dunk",
  "React",
  "Vagabond",
  "Stocks",
  "Crypto",
  "Core ML",
  "WidgetKit",
];

export const statement = {
  before: "I bring",
  highlight: "craft & curiosity",
  after: "to everything I build, from first sketch to shipped product.",
};

/** Short paragraphs under the statement. Rewrite these in your own voice. */
export const about = [
  "I started on the web with TypeScript and React, and lately I've been diving deep into SwiftUI as part of the Apple Developer Academy in Bali. I'm hooked on iOS and the whole Apple ecosystem.",
  "Away from the keyboard you'll find me on a basketball court, over a chessboard, reading manga, or watching the markets move. Those habits shape how I design and build.",
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
  market: "Totally simulated. Not financial advice!",
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
      { variant: "splash", caption: "Home" },
      { variant: "cards", caption: "Charm collection" },
      { variant: "list", caption: "Trading" },
    ],
    tags: ["SwiftUI", "RealityKit", "Lottie"],
    colors: ["#2261e9", "#7aa2ff"],
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
      { variant: "scan", caption: "Board detection" },
      { variant: "chart", caption: "Engine evaluation" },
      { variant: "list", caption: "Move history" },
    ],
    tags: ["Core ML", "Vision", "AVFoundation"],
    colors: ["#111827", "#4b5563"],
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
      { variant: "timer", caption: "Focus session" },
      { variant: "splash", caption: "Your pet" },
      { variant: "chart", caption: "Weekly progress" },
    ],
    tags: ["SwiftUI", "WidgetKit", "Live Activities"],
    colors: ["#ff7a45", "#ffd166"],
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
      { variant: "list", caption: "Steps" },
      { variant: "splash", caption: "Calm mode" },
      { variant: "cards", caption: "Strategies" },
    ],
    tags: ["SwiftData", "App Intents", "AirPods"],
    colors: ["#7c3aed", "#c4b5fd"],
  },
  {
    id: "live-music-pets",
    title: "LiveMusicPets",
    category: "iOS App · Live Activities",
    year: "2026",
    blurb: "Lock-screen pets that react to the music playing around you.",
    overview:
      "Little pets live on your lock screen and dance to whatever's playing nearby. A small, playful way to make music feel more alive.",
    role: "Design & development",
    platform: "iOS",
    highlights: [
      "Music recognition powered by ShazamKit.",
      "Live Activities that animate along with the song.",
      "Widgets to show off your pet collection.",
    ],
    gallery: [
      { variant: "waves", caption: "Listening" },
      { variant: "splash", caption: "Now playing" },
      { variant: "cards", caption: "Pet collection" },
    ],
    tags: ["ActivityKit", "ShazamKit", "WidgetKit"],
    colors: ["#ec4899", "#fbcfe8"],
  },
  {
    id: "pomodoro-clock",
    title: "PomodoroClock",
    category: "iOS App",
    year: "2025",
    blurb: "A focus timer with its own music library and a customisable rhythm.",
    overview:
      "A clean Pomodoro timer with a built-in music library, so you can start a session and stay in the zone without juggling apps.",
    role: "Design & development",
    platform: "iOS",
    highlights: [
      "Adjustable focus and break lengths.",
      "Background audio with a custom playback engine.",
      "A distraction-free timer screen.",
    ],
    gallery: [
      { variant: "timer", caption: "Timer" },
      { variant: "list", caption: "Music library" },
    ],
    tags: ["SwiftUI", "AVAudioEngine"],
    colors: ["#ef4444", "#fca5a5"],
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
      { variant: "list", caption: "Friends" },
      { variant: "cards", caption: "Profile" },
    ],
    tags: ["SwiftUI", "Core Data"],
    colors: ["#0f766e", "#5eead4"],
  },
  {
    id: "my-bali-app",
    title: "MyBaliApp",
    category: "iOS App",
    year: "2025",
    blurb: "A pocket guide to island life.",
    overview:
      "A pocket guide to everyday life on the island, built around the places and routines that make Bali feel like home.",
    role: "Design & development",
    platform: "iOS",
    highlights: [
      "Places and tips for daily life on the island.",
      "A fast, native SwiftUI interface.",
    ],
    gallery: [
      { variant: "cards", caption: "Places" },
      { variant: "splash", caption: "Home" },
    ],
    tags: ["SwiftUI"],
    colors: ["#16a34a", "#bbf7d0"],
  },
];
