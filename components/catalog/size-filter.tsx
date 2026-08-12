"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ADULT_SIZES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SizeFilter() {
  const router = useRouter();
  const params = useSearchParams();
  const active = params.get("olcu");

  function set(size?: string) {
    const next = new URLSearchParams(params.toString());
    if (size && size !== active) next.set("olcu", size);
    else next.delete("olcu");
    const qs = next.toString();
    router.replace(qs ? `/kataloq?${qs}` : "/kataloq", { scroll: false });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-faint">
        Ölçü:
      </span>
      {ADULT_SIZES.map((s) => {
        const isActive = active === s;
        return (
          <button
            key={s}
            type="button"
            onClick={() => set(s)}
            aria-pressed={isActive}
            className={cn(
              "h-8 min-w-8 rounded-lg border px-2.5 text-xs font-semibold transition-all",
              isActive
                ? "border-gold bg-gold/15 text-gold"
                : "border-line-strong text-muted hover:border-gold/50 hover:text-cream"
            )}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}
