import ShinyText from "./rb/ShinyText";

/** The numbered label above every section, with a slow shine passing through it. */
export function Eyebrow({ children }: { children: string }) {
  return (
    <p className="mb-5 flex items-center gap-2.5 font-mono text-xs tracking-widest uppercase">
      <span className="size-2 rounded-full bg-signal" />
      <ShinyText text={children} color="#8fa396" shineColor="#f1e6cf" speed={3} delay={2} trigger="view" />
    </p>
  );
}
