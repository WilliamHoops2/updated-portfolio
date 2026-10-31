import { useState } from "react";
import { projects } from "../data/content";

interface Item {
  name: string;
  blurb: string;
  /** Project tags that count as using this. Leave empty for tools. */
  match: string[];
}

const items: Item[] = [
  { name: "SwiftUI", blurb: "Declarative UI that scales across every Apple platform.", match: ["SwiftUI"] },
  { name: "SwiftData", blurb: "Modern, Swift-native persistence for app data.", match: ["SwiftData"] },
  { name: "WidgetKit", blurb: "Glanceable widgets for the home and lock screen.", match: ["WidgetKit"] },
  { name: "Live Activities", blurb: "Real-time updates on the lock screen and Dynamic Island.", match: ["Live Activities", "ActivityKit"] },
  { name: "App Intents", blurb: "Expose app actions to Siri, Shortcuts and Spotlight.", match: ["App Intents"] },
  { name: "Core ML", blurb: "Run machine-learning models privately, on the device.", match: ["Core ML"] },
  { name: "Vision", blurb: "Detect and recognise things in images and video.", match: ["Vision"] },
  { name: "ShazamKit", blurb: "Recognise music playing around you.", match: ["ShazamKit"] },
  { name: "RealityKit", blurb: "3D and spatial experiences with a Swift API.", match: ["RealityKit"] },
  { name: "Xcode", blurb: "Where it all comes together, from canvas previews to Instruments.", match: [] },
  { name: "TestFlight", blurb: "Get builds into real hands before they ship.", match: [] },
];

function usedIn(item: Item): string[] {
  if (item.match.length === 0) return [];
  return projects.filter((p) => p.tags.some((t) => item.match.includes(t))).map((p) => p.title);
}

export function EcosystemCard() {
  const [active, setActive] = useState(0);
  const item = items[active];
  const used = usedIn(item);

  return (
    <div className="eco">
      <ul className="eco__chips">
        {items.map((it, i) => (
          <li key={it.name}>
            <button
              type="button"
              className={`chip ${i === active ? "is-active" : ""}`.trim()}
              aria-pressed={i === active}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              {it.name}
            </button>
          </li>
        ))}
      </ul>

      <div className="eco__detail" aria-live="polite">
        <strong>{item.name}</strong>
        <p>{item.blurb}</p>
        {used.length > 0 && (
          <p className="mono eco__used">
            Used in {used.slice(0, 3).join(", ")}
            {used.length > 3 ? ` +${used.length - 3}` : ""}
          </p>
        )}
      </div>
    </div>
  );
}
