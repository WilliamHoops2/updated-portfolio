import { useCallback, useEffect, useRef, useState } from "react";
import { projects } from "../data/content";

const PATTERN = /^#work\/([\w-]+)$/;

function read(): string | null {
  const match = PATTERN.exec(window.location.hash);
  return match && projects.some((p) => p.id === match[1]) ? match[1] : null;
}

/**
 * Which project's full view is open, kept in the URL as #work/<id> so it can be linked to
 * and the browser's back button closes it.
 */
export function useCase() {
  const [id, setId] = useState<string | null>(read);
  const pushed = useRef(false);

  useEffect(() => {
    const sync = () => setId(read());
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, []);

  /** Open from the index: adds a history entry, so Back returns to the list. */
  const open = useCallback((next: string) => {
    pushed.current = true;
    window.location.hash = `work/${next}`;
  }, []);

  /** Move between projects without piling up history entries. */
  const go = useCallback((next: string) => {
    window.history.replaceState(null, "", `#work/${next}`);
    setId(next);
  }, []);

  const close = useCallback(() => {
    if (pushed.current) {
      pushed.current = false;
      window.history.back();
      return;
    }
    // Arrived on a direct link, so there is nothing to go back to.
    window.history.replaceState(null, "", "#work");
    setId(null);
  }, []);

  return { id, open, go, close };
}
