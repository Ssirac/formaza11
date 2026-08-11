"use client";

import { cn } from "@/lib/utils";

export function SizeChips({
  sizes,
  selected,
  onSelect,
  shake,
  size = "md",
}: {
  sizes: string[];
  selected: string | null;
  onSelect: (s: string) => void;
  shake?: boolean;
  size?: "sm" | "md";
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", shake && "shake")}>
      {sizes.map((s) => {
        const active = selected === s;
        return (
          <button
            key={s}
            type="button"
            onClick={() => onSelect(s)}
            aria-pressed={active}
            className={cn(
              "rounded-lg border font-semibold transition-all duration-150",
              size === "sm" ? "h-8 min-w-8 px-2 text-xs" : "h-11 min-w-11 px-3 text-sm",
              active
                ? "border-gold bg-gold/15 text-gold"
                : "border-line-strong text-muted hover:border-gold/60 hover:text-cream"
            )}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}
