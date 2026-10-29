import { profile } from "../data/content";
import { useClock } from "../hooks/useClock";
import { useCursor } from "../hooks/useCursor";

/** Fixed bottom strip with a live local clock and pointer coordinates. */
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
