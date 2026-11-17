import { useEffect, useState } from "react";

export type DocumentTheme = "light" | "dark";

const read = (): DocumentTheme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

/** Follows the site's light/dark switch (the `data-theme` attribute on <html>). */
export function useDocumentTheme(): DocumentTheme {
  const [theme, setTheme] = useState<DocumentTheme>(read);

  useEffect(() => {
    setTheme(read());
    const observer = new MutationObserver(() => setTheme(read()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return theme;
}
