import { cn } from "@/lib/utils";

/** A wall of oversized words in rows that drift in opposite directions. Hover a word to fill it in. */
export function TypeWall({ rows, className }: { rows: string[][]; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2 overflow-hidden select-none md:gap-4", className)}>
      {rows.map((words, r) => {
        const sizes = ["text-[clamp(3rem,9vw,8rem)]", "text-[clamp(2.2rem,6vw,5.5rem)]", "text-[clamp(3.5rem,11vw,9.5rem)]"];
        const size = sizes[r % sizes.length];
        const strip = [...words, ...words];
        return (
          <div key={r} className="flex w-max">
            <div className={cn("flex w-max gap-8 md:gap-14", r % 2 ? "animate-marquee-rev" : "animate-marquee")}>
              {strip.map((word, i) => {
                const solid = (i + r) % 5 === 0;
                return (
                  <span
                    key={i}
                    className={cn(
                      "cursor-default font-display leading-[0.95] font-extrabold tracking-tight whitespace-nowrap transition-all duration-300",
                      size,
                      solid
                        ? "text-cream"
                        : "text-transparent [-webkit-text-stroke:1.5px_rgb(233_220_192/0.4)] hover:text-signal hover:[-webkit-text-stroke:0]",
                      "hover:-skew-x-6 hover:scale-105",
                    )}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
