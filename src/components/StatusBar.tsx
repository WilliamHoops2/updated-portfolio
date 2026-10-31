import { profile } from "../data/content";
import { useClock } from "../hooks/useClock";
import { useCursor } from "../hooks/useCursor";

/** Live local clock and pointer coordinates, shown under the nav. */
export function StatusBar() {
  const time = useClock(profile.timezone);
  const { x, y } = useCursor();

  return (
    <div className="status mono" aria-hidden="true">
      <span>
        {time} {profile.timezoneLabel} {profile.location.split(", ")[1] ?? ""}
      </span>
      <span>
        {x} X {y} Y
      </span>
    </div>
  );
}
