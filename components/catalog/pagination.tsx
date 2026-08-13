import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Params = Record<string, string | undefined>;

function buildHref(basePath: string, params: Params, page: number): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) sp.set(k, v);
  if (page > 1) sp.set("sehife", String(page));
  const qs = sp.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

/** Compact page list: 1 … p-1 p p+1 … last */
function pageList(page: number, total: number): (number | "…")[] {
  const out: (number | "…")[] = [];
  const add = (n: number) => out.push(n);
  const window = new Set<number>([1, total, page - 1, page, page + 1]);
  const sorted = [...window].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  let prev = 0;
  for (const n of sorted) {
    if (n - prev > 1) out.push("…");
    add(n);
    prev = n;
  }
  return out;
}

export function Pagination({
  page,
  totalPages,
  params,
  basePath = "/kataloq",
}: {
  page: number;
  totalPages: number;
  params: Params;
  basePath?: string;
}) {
  if (totalPages <= 1) return null;

  const linkCls =
    "inline-flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition-colors";

  return (
    <nav
      aria-label="Səhifələr"
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
    >
      {page > 1 ? (
        <Link
          href={buildHref(basePath, params, page - 1)}
          rel="prev"
          aria-label="Əvvəlki səhifə"
          className={cn(linkCls, "border-line-strong text-cream hover:border-gold hover:text-gold")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span className={cn(linkCls, "border-line text-faint opacity-50")} aria-disabled>
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}

      {pageList(page, totalPages).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-faint">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(basePath, params, p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              linkCls,
              p === page
                ? "border-gold bg-gold/10 text-gold"
                : "border-line-strong text-cream hover:border-gold hover:text-gold"
            )}
          >
            {p}
          </Link>
        )
      )}

      {page < totalPages ? (
        <Link
          href={buildHref(basePath, params, page + 1)}
          rel="next"
          aria-label="Növbəti səhifə"
          className={cn(linkCls, "border-line-strong text-cream hover:border-gold hover:text-gold")}
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className={cn(linkCls, "border-line text-faint opacity-50")} aria-disabled>
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
