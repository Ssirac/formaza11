"use client";

import { useState } from "react";
import Image from "next/image";
import { Shirt } from "lucide-react";
import { cn } from "@/lib/utils";
import { Watermark } from "./watermark";

export function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center rounded-2xl border border-line bg-gradient-to-br from-surface to-ink-2">
        <Shirt className="h-20 w-20 text-line-strong" strokeWidth={1} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-ink-2">
        {images.map((src, i) => (
          <Image
            key={src + i}
            src={src}
            alt={alt}
            fill
            priority={i === 0}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={cn(
              "object-cover transition-opacity duration-400",
              i === active ? "opacity-100" : "opacity-0"
            )}
          />
        ))}
        <Watermark size="text-lg sm:text-xl" />
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Şəkil ${i + 1}`}
              className={cn(
                "relative h-20 w-16 shrink-0 overflow-hidden rounded-lg border transition-all",
                i === active
                  ? "border-gold ring-1 ring-gold"
                  : "border-line hover:border-line-strong"
              )}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
