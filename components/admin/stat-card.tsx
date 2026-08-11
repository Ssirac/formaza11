import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">{label}</span>
        <span
          className={cn(
            "grid h-9 w-9 place-items-center rounded-lg border",
            accent
              ? "border-gold/40 bg-gold/10 text-gold"
              : "border-line-strong bg-ink-2 text-silver"
          )}
        >
          <Icon className="h-[18px] w-[18px]" />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl font-extrabold italic text-cream">
        {value}
      </p>
    </div>
  );
}
