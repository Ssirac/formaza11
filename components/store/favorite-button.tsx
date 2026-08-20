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
        "group/fav inline-flex items-center justify-center rounded-full transition-all",
        variant === "overlay"
          ? "h-9 w-9 border border-black/10 bg-white/85 shadow-sm backdrop-blur-md hover:scale-105 hover:bg-white"
          : "h-11 w-11 border border-line-strong hover:border-red-500",
        className
      )}
    >
      <Heart
        className={cn(
          "h-[18px] w-[18px] transition-all",
          active
            ? "scale-110 fill-red-500 text-red-500"
            : "text-zinc-700 group-hover/fav:fill-red-500 group-hover/fav:text-red-500"
        )}
      />
    </button>
  );
}
