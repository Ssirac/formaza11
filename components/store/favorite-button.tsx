"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useFavorites, type FavItem } from "./store";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  item,
  className,
  variant = "overlay",
}: {
  item: FavItem;
  className?: string;
  variant?: "overlay" | "solid";
}) {
  const { has, toggle } = useFavorites();
  const active = has(item.id);

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const added = toggle(item);
    toast.success(added ? "Favorilərə əlavə olundu" : "Favorilərdən çıxarıldı");
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? "Favorilərdən çıxar" : "Favorilərə əlavə et"}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-all",
        variant === "overlay"
          ? "h-9 w-9 border border-white/10 bg-black/50 backdrop-blur-md hover:bg-black/70"
          : "h-11 w-11 border border-line-strong hover:border-gold",
        className
      )}
    >
      <Heart
        className={cn(
          "h-[18px] w-[18px] transition-all",
          active ? "fill-gold text-gold" : "text-cream"
        )}
      />
    </button>
  );
}
