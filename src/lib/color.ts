/**
 * Turns "#2261e9" into "rgba(34, 97, 233, 0.35)".
 * TradingView's widget wants colours as strings in its JSON config, and we want the same accent
 * the rest of the site uses, so we read the CSS variable and convert it.
 */
export function withAlpha(hex: string, alpha: number): string {
  const digits = hex.trim().replace("#", "");
  if (digits.length !== 6) return hex; // not a 6-digit hex colour: use it as it is
  const n = parseInt(digits, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

/** The current accent colour, straight from the `--accent` CSS variable. */
export function readAccent(): string {
  return getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
}
