interface RollProps {
  children: string;
}

/**
 * Text that "rolls" to a duplicate on hover (the effect used on inkgames.com).
 * The animation is triggered by hovering the parent <a> or <button>; see `.roll` in index.css.
 */
export function Roll({ children }: RollProps) {
  return (
    <span className="roll">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}
