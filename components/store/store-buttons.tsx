"use client";

import { Heart, ShoppingBag } from "lucide-react";
import { useCart, useFavorites, useStoreUI } from "./store";
import { cn } from "@/lib/utils";

export function StoreButtons({ className }: { className?: string }) {
  const { count } = useCart();
  const { count: favCount } = useFavorites();
  const { openCart, openFav } = useStoreUI();

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <IconButton
        label="Favorilər"
        onClick={openFav}
        count={favCount}
        icon={<Heart className="h-[18px] w-[18px]" />}
      />
      <IconButton
        label="Səbət"
        onClick={openCart}
        count={count}
        icon={<ShoppingBag className="h-[18px] w-[18px]" />}
      />
    </div>
  );
}

function IconButton({
  label,
  onClick,
  count,
  icon,
}: {
  label: string;
  onClick: () => void;
  count: number;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${label}${count ? ` (${count})` : ""}`}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line text-cream transition-colors hover:border-gold/50 hover:text-gold"
    >
      {icon}
      {count > 0 && (
        <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-metal-gold px-1 text-[11px] font-bold text-ink">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
