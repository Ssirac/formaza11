import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedProducts } from "@/lib/queries";
import { ImageStreamHero } from "@/components/ui/image-stream-hero";
import { buttonClasses } from "@/components/ui/button";

/**
 * Immersive 3D corridor of the shop's own jersey photos. Renders only when
 * there are enough real product images — never shows placeholder stock.
 */
export async function JerseyCorridor() {
  const featured = await getFeaturedProducts(12);
  const images = featured
    .flatMap((p) => p.images)
    .filter(Boolean)
    .slice(0, 12);

  if (images.length < 6) return null;

  return (
    <section className="always-dark">
      <ImageStreamHero
        images={images.map((src) => ({ src }))}
        className="h-[460px] rounded-3xl border border-gold/15 bg-[#08080a] sm:h-[560px]"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/85"
          aria-hidden
        />
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-gold">
            <span className="h-px w-6 bg-gold" />
            Kolleksiya
          </span>
          <h2 className="font-display text-4xl font-extrabold italic text-cream sm:text-6xl">
            Meydana <span className="text-metal-gold">premium giriş</span>
          </h2>
          <Link
            href="/kataloq"
            className={buttonClasses("gold", "lg", "pointer-events-auto")}
          >
            Hamısına bax
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </ImageStreamHero>
    </section>
  );
}
