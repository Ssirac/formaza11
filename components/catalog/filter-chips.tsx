import Link from "next/link";
import type { CategoryDTO } from "@/lib/types";
import { cn } from "@/lib/utils";

function withParams(categorySlug?: string, q?: string) {
  const params = new URLSearchParams();
  if (categorySlug) params.set("kateqoriya", categorySlug);
  if (q) params.set("axtar", q);
  const qs = params.toString();
  return qs ? `/kataloq?${qs}` : "/kataloq";
}

export function FilterChips({
  categories,
  active,
  q,
}: {
  categories: CategoryDTO[];
  active?: string;
  q?: string;
}) {
  const chips = [{ name: "Hamısı", slug: "" }, ...categories];
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((c) => {
        const isActive = (active ?? "") === c.slug;
        return (
          <Link
            key={c.slug || "all"}
            href={withParams(c.slug || undefined, q)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-semibold transition-all",
              isActive
                ? "border-gold bg-gold/15 text-gold"
                : "border-line-strong text-muted hover:border-gold/50 hover:text-cream"
            )}
          >
            {c.name}
          </Link>
        );
      })}
    </div>
  );
}
