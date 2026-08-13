import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";

/**
 * Full-width brand video band. The clip plays muted on a loop as the
 * background, with the FORMAZA11 statement and a catalog CTA over it.
 */
export function VideoShowcase() {
  return (
    <section className="always-dark relative overflow-hidden rounded-3xl border border-gold/15 bg-[#070b1a] text-cream">
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-70"
        src="/formaza11video.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
      />
      {/* Legibility overlays */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/40"
        aria-hidden
      />
      <div
        className="pitch-lines pointer-events-none absolute inset-0 opacity-20"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-[420px] flex-col items-center justify-center gap-5 px-6 py-20 text-center sm:min-h-[520px]">
        <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-black/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-silver backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          FORMAZA11
        </span>
        <h2 className="max-w-2xl font-display text-3xl font-black italic uppercase leading-[0.95] tracking-tight text-metal-gold drop-shadow-2xl sm:text-5xl">
          Formanı gey, oyunu yaşa
        </h2>
        <p className="max-w-md text-sm text-cream/85 sm:text-base">
          Klub, milli komanda və retro formalar — hər tikişi orijinala sadiq.
        </p>
        <Link href="/kataloq" className={buttonClasses("gold", "lg", "mt-2")}>
          Kataloqa bax
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
