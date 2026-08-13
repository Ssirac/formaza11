"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CoverflowCarousel } from "@/components/ui/coverflow-carousel";
import { buttonClasses } from "@/components/ui/button";
import type { ProductDTO } from "@/lib/types";

/**
 * Featured products shown as a 3D cover-flow that auto-rotates every 3s.
 * The centred card's product is surfaced below as a "view" link.
 */
export function FeaturedCarousel({ products }: { products: ProductDTO[] }) {
  const items = products.filter((p) => p.images.length > 0);
  const [selected, setSelected] = useState(0);

  if (items.length === 0) return null;

  const slides = items.map((p) => ({
    src: p.images[0],
    alt: p.name,
    title: p.name,
    subtitle: p.categoryName,
  }));

  const active = items[Math.min(selected, items.length - 1)];

  return (
    <div className="flex flex-col items-center">
      <CoverflowCarousel
        slides={slides}
        autoPlay
        autoPlayInterval={3000}
        showCaption
        showPagination
        showNavigation
        onSelect={setSelected}
        label="Seçilmiş formalar"
        cardClassName="border border-line"
      />

      <Link
        href={`/forma/${active.slug}`}
        className={buttonClasses("gold", "md", "mt-6")}
      >
        Məhsula bax
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
