"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const SORTS = [
  { value: "yeni", label: "Yenilər" },
  { value: "populyar", label: "Populyar" },
  { value: "ad", label: "Ad (A-Z)" },
] as const;

export function CatalogControls() {
  const router = useRouter();
  const params = useSearchParams();
  const sort = params.get("sirala") ?? "yeni";
  const inStock = params.get("stok") === "eldedir";

  function update(mutate: (p: URLSearchParams) => void) {
    const next = new URLSearchParams(params.toString());
    mutate(next);
    next.delete("sehife"); // any change returns to the first page
    const qs = next.toString();
    router.replace(qs ? `/kataloq?${qs}` : "/kataloq", { scroll: false });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-faint">
        Sırala:
        <select
          value={sort}
          onChange={(e) =>
            update((p) =>
              e.target.value === "yeni"
                ? p.delete("sirala")
                : p.set("sirala", e.target.value)
            )
          }
          className="h-9 rounded-lg border border-line-strong bg-surface px-3 text-sm font-medium text-cream outline-none transition-colors hover:border-gold/50 focus-visible:border-gold"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        aria-pressed={inStock}
        onClick={() =>
          update((p) => (inStock ? p.delete("stok") : p.set("stok", "eldedir")))
        }
        className={cn(
          "inline-flex h-9 items-center gap-2 rounded-lg border px-3.5 text-sm font-semibold transition-all",
          inStock
            ? "border-gold bg-gold/15 text-gold"
            : "border-line-strong text-muted hover:border-gold/50 hover:text-cream"
        )}
      >
        <span
          className={cn(
            "grid h-4 w-4 place-items-center rounded border",
            inStock ? "border-gold bg-gold text-white" : "border-line-strong"
          )}
        >
          {inStock && <Check className="h-3 w-3" strokeWidth={3} />}
        </span>
        Yalnız Əldədir
      </button>
    </div>
  );
}
