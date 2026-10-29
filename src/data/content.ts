// ─────────────────────────────────────────────────────────────
//  EDIT ME — everything shown on the site lives in this file.
// ─────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  blurb: string;
  tags: string[];
  /** Two colours for the placeholder cover gradient. Swap for a real image later. */
  colors: [string, string];
  href?: string;
  featured?: boolean;
}

export interface Social {
  label: string;
  href: string;
}

export const profile = {
  name: "William",
  handle: "itsjustw",
  greeting: "Scroll down and I'll show you around.",
  titleLines: ["Design &", "Engineering"],
  tagline: "Small apps, built with care.",
  intro:
    "I'm a developer and designer building apps and interfaces that feel good to use, from native iOS to the web.",
  email: "hello@example.com",
  location: "Bali, ID",
  timezone: "Asia/Makassar",
  timezoneLabel: "GMT+8",
  year: 2026,
  socials: [
    { label: "GitHub", href: "https://github.com/" },
    { label: "LinkedIn", href: "https://linkedin.com/" },
    { label: "X", href: "https://x.com/" },
  ] satisfies Social[],
};

export const stack = [
  "Swift",
  "SwiftUI",
  "React",
  "TypeScript",
  "Core ML",
  "Vision",
  "WidgetKit",
  "Figma",
  "Vite",
];

export const statement = {
  before: "I bring",
  highlight: "craft & curiosity",
  after: "to everything I build, from first sketch to shipped product.",
};

export const steps = [
  { n: "01", title: "Sketch", text: "Start with the problem. Rough ideas, quick prototypes, lots of questions." },
  { n: "02", title: "Build", text: "Turn the best idea into working software, with motion and detail." },
  { n: "03", title: "Ship", text: "Polish, test on real devices, and put it in people's hands." },
];

// Drafted from the apps in your "Apple Projects" folder. Rewrite the blurbs in your own words.
export const projects: Project[] = [
  {
    id: "artie",
    title: "Artie",
    category: "iOS App",
    year: "2026",
    blurb: "A charm-collecting app with 3D keychains, physics-based collages and nearby trading.",
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
    tags: ["SwiftData", "App Intents", "AirPods"],
    colors: ["#7c3aed", "#c4b5fd"],
  },
  {
    id: "live-music-pets",
    title: "LiveMusicPets",
    category: "iOS App · Live Activities",
    year: "2026",
    blurb: "Lock-screen pets that react to the music playing around you.",
    tags: ["ActivityKit", "ShazamKit", "WidgetKit"],
    colors: ["#ec4899", "#fbcfe8"],
  },
  {
    id: "pomodoro-clock",
    title: "PomodoroClock",
    category: "iOS App",
    year: "2025",
    blurb: "A focus timer with its own music library and a customisable rhythm.",
    tags: ["SwiftUI", "AVAudioEngine"],
    colors: ["#ef4444", "#fca5a5"],
  },
  {
    id: "friend-tracker",
    title: "FriendTracker",
    category: "iOS App",
    year: "2025",
    blurb: "Keep track of the people you care about and when you last caught up.",
    tags: ["SwiftUI", "Core Data"],
    colors: ["#0f766e", "#5eead4"],
  },
  {
    id: "my-bali-app",
    title: "MyBaliApp",
    category: "iOS App",
    year: "2025",
    blurb: "A pocket guide to island life.",
    tags: ["SwiftUI"],
    colors: ["#16a34a", "#bbf7d0"],
  },
];
