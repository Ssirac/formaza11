import { stockLabel } from "@/lib/constants";
import { cn } from "@/lib/utils";

const STYLES: Record<string, { badge: string; dot: string }> = {
  in_stock: { badge: "border-pitch/40 bg-pitch/15 text-pitch", dot: "bg-pitch" },
  on_way: {
    badge: "border-amber-400/40 bg-amber-400/10 text-amber-300",
    dot: "bg-amber-300",
  },
  pre_order: { badge: "border-gold/40 bg-gold/10 text-gold", dot: "bg-gold" },
};

export function StockBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const style = STYLES[status] ?? STYLES.in_stock;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide",
        style.badge,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
      {stockLabel(status)}
    </span>
  );
}
