import type { CSSProperties, ElementType, ReactNode } from "react";
import { useReveal } from "../hooks/useReveal";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Delay in milliseconds, for staggering siblings. */
  delay?: number;
  /** Line the mascot says when this element is on screen. */
  tour?: string;
}

export function Reveal({ children, as: Tag = "div", className = "", delay = 0, tour }: RevealProps) {
  const { ref, visible } = useReveal<HTMLElement>();
  const style = { "--delay": `${delay}ms` } as CSSProperties;

  return (
    <Tag
      ref={ref}
      style={style}
      data-tour={tour}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
