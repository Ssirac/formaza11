import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ImageStreamHero } from "@/components/ui/image-stream-hero";
import { buttonClasses } from "@/components/ui/button";
import { HeroSlogans } from "@/components/home/hero-slogans";

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
        className="min-h-[92vh] bg-[#070b1a] text-cream"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black sm:from-black/65 sm:via-black/45"
          aria-hidden
        />
        <div className="relative z-10 mx-auto flex min-h-[92vh] w-full max-w-7xl flex-col items-center justify-center gap-4 px-5 py-20 text-center sm:gap-5 sm:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-black/40 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-silver backdrop-blur-sm sm:text-xs sm:tracking-[0.2em]">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            Azərbaycanın forma ünvanı
          </span>

          <h1 className="sr-only">{lines.join(" ")}</h1>
          <div className="w-full" aria-hidden>
            <HeroSlogans className="min-h-[2.2em] w-full justify-center text-center font-display text-[2rem] font-black italic uppercase leading-[0.98] tracking-tight drop-shadow-2xl sm:text-5xl lg:text-6xl" />
          </div>

          <p className="max-w-md text-pretty text-[15px] leading-relaxed text-cream/85 sm:max-w-xl sm:text-lg">
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
