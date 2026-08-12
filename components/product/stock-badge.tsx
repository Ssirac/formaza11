import { stockLabel } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function StockBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const inStock = status === "in_stock";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide",
        inStock
          ? "border-pitch/40 bg-pitch/15 text-pitch"
          : "border-amber-400/40 bg-amber-400/10 text-amber-300",
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          inStock ? "bg-pitch" : "bg-amber-300"
        )}
      />
      {stockLabel(status)}
    </span>
  );
}
