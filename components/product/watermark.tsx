import { cn } from "@/lib/utils";

/**
 * Faded, tiled "FORMAZA11" watermark overlaid on product imagery. Pure CSS
 * overlay — non-destructive, works on any image, and shows up in screenshots.
 */
export function Watermark({
  className,
  rows = 7,
  size = "text-base",
}: {
  className?: string;
  rows?: number;
  size?: string;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-10 overflow-hidden",
        className
      )}
      aria-hidden
    >
      <div className="absolute inset-[-35%] flex -rotate-[24deg] flex-col justify-around opacity-[0.13]">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "whitespace-nowrap text-center font-display font-black italic uppercase tracking-[0.35em] text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.45)]",
              size
            )}
          >
            FORMAZA11 · FORMAZA11 · FORMAZA11 · FORMAZA11
          </div>
        ))}
      </div>
    </div>
  );
}
