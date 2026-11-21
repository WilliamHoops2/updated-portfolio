import { profile } from "../data/content";
import { useClock } from "../hooks/useClock";

/** Live local clock, shown under the nav. */
export function StatusBar() {
  const time = useClock(profile.timezone);

  return (
    <div className="status mono" aria-hidden="true">
      <span>
        {time} {profile.timezoneLabel} {profile.location.split(", ")[1] ?? ""}
      </span>
    </div>
  );
}
