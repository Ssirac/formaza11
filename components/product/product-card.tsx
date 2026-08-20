"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Shirt } from "lucide-react";
import type { ProductDTO } from "@/lib/types";
import { SizeChips } from "./size-chips";
import { StockBadge } from "./stock-badge";
import { withCloudinaryWatermark } from "@/lib/image-watermark";
import { trackAndOpen } from "./order-util";
import { WhatsAppIcon } from "@/components/ui/icons";
import { buttonClasses } from "@/components/ui/button";
import { FavoriteButton } from "@/components/store/favorite-button";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  whatsappNumber,
}: {
  product: ProductDTO;
  whatsappNumber: string;
}) {
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [tip, setTip] = useState(false);

  const hasSecond = product.images.length > 1;
  const primary = product.images[0];
  const secondary = product.images[1];
  const isNew =
    Date.now() - new Date(product.createdAt).getTime() <
    14 * 24 * 60 * 60 * 1000;

  // Subtle 3D tilt
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), {
    stiffness: 200,
    damping: 18,
  });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), {
    stiffness: 200,
    damping: 18,
  });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    setHovered(false);
    mx.set(0);
    my.set(0);
  }

  function order() {
    if (product.sizes.length && !selected) {
      setShake(true);
      setTip(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setTip(false), 2200);
      return;
    }
    trackAndOpen({
      productId: product.id,
      productName: product.name,
      size: selected ?? "—",
      whatsappNumber,
      slug: product.slug,
    });
  }

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className="group relative flex flex-col rounded-2xl border border-line bg-surface/70 backdrop-blur-sm overflow-hidden transition-colors hover:border-gold/40"
    >
      <Link
        href={`/forma/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-ink-2"
        aria-label={product.name}
      >
        {primary ? (
          <>
            <Image
              src={withCloudinaryWatermark(primary)}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={cn(
                "object-cover transition-opacity duration-500",
                hovered && hasSecond ? "opacity-0" : "opacity-100"
              )}
            />
            {hasSecond && (
              <Image
                src={withCloudinaryWatermark(secondary)}
                alt=""
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={cn(
                  "object-cover transition-opacity duration-500",
                  hovered ? "opacity-100" : "opacity-0"
                )}
              />
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface to-ink-2">
            <Shirt className="h-14 w-14 text-line-strong" strokeWidth={1.2} />
          </div>
        )}

        <span className="sheen z-10" aria-hidden />

        <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-silver backdrop-blur-md">
          {product.categoryName}
        </span>
        {product.isFeatured && (
          <span className="absolute bottom-3 left-3 rounded-full bg-metal-gold px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            Seçilmiş
          </span>
        )}
        {isNew && (
          <span className="absolute bottom-3 right-3 rounded-full bg-pitch px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-lg">
            Yeni
          </span>
        )}
      </Link>

      <FavoriteButton
        item={{
          id: product.id,
          slug: product.slug,
          name: product.name,
          image: product.images[0],
          categoryName: product.categoryName,
        }}
        className="absolute right-3 top-3 z-20"
      />

      <div className="flex flex-1 flex-col gap-3 p-4">
        <StockBadge status={product.stockStatus} className="self-start" />
        <Link href={`/forma/${product.slug}`} className="min-w-0">
          <h3 className="truncate font-display text-lg font-bold italic leading-tight text-cream transition-colors group-hover:text-gold">
            {product.name}
          </h3>
        </Link>

        {product.sizes.length > 0 ? (
          <SizeChips
            sizes={product.sizes}
            selected={selected}
            onSelect={setSelected}
            shake={shake}
            size="sm"
          />
        ) : (
          <p className="text-xs text-faint">Ölçü mövcud deyil</p>
        )}

        <div className="relative mt-auto pt-1">
          {tip && (
            <span className="absolute -top-8 left-0 rounded-md bg-gold px-2.5 py-1 text-xs font-semibold text-ink shadow-lg">
              Əvvəlcə ölçünü seç
            </span>
          )}
          <button
            type="button"
            onClick={order}
            disabled={product.sizes.length === 0}
            className={buttonClasses("gold", "sm", "w-full")}
          >
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp-da soruş
          </button>
        </div>
      </div>
    </motion.div>
  );
}
