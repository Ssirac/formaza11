import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ImageStreamHero } from "@/components/ui/image-stream-hero";
import { buttonClasses } from "@/components/ui/button";

/**
 * Hero that leads with the shop's own jersey photos flowing in a 3D corridor,
 * with the FORMAZA11 statement overlaid. Used only when there are enough real
 * product images; otherwise the animated shader Hero is shown instead.
 */
export function CorridorHero({
  title,
  subtitle,
  images,
}: {
  title: string;
  subtitle: string;
  images: string[];
}) {
  const lines = title.split("\n").filter(Boolean);

  return (
    <section className="always-dark relative">
      <ImageStreamHero
        images={images.map((src) => ({ src }))}
        speed={20}
        className="min-h-[92vh] bg-[#08080a] text-cream"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black"
          aria-hidden
        />
        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col items-center justify-center gap-5 px-4 py-24 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-black/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-silver backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            Azərbaycanın forma ünvanı
          </span>

          <h1 className="font-display text-[14vw] font-black italic uppercase leading-[0.86] tracking-tight sm:text-7xl lg:text-8xl">
            {lines.map((line, i) => (
              <span key={i} className="block text-metal-gold drop-shadow-2xl">
                {line}
              </span>
            ))}
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-cream/80 sm:text-lg">
            {subtitle}
          </p>

          <div className="pointer-events-auto mt-3 flex flex-wrap items-center justify-center gap-4">
            <Link href="/kataloq" className={buttonClasses("gold", "lg")}>
              Kataloqa bax
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/#nece-sifaris" className={buttonClasses("outline", "lg")}>
              Necə sifariş?
            </Link>
          </div>
        </div>
      </ImageStreamHero>
    </section>
  );
}
