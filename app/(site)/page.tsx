import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { Marquee } from "@/components/site/marquee";
import { TrustStrip } from "@/components/home/trust-strip";
import { Suspense } from "react";
import { TeamsMarquee } from "@/components/home/teams-marquee";
import { FootballScores } from "@/components/home/football-scores";
import { CorridorHero } from "@/components/home/corridor-hero";
import { FeaturedCarousel } from "@/components/home/featured-carousel";
import { CtaBand } from "@/components/site/cta-band";
import { SectionHeading } from "@/components/home/section-heading";
import { CategoryGrid } from "@/components/home/category-grid";
import { HowTo } from "@/components/home/how-to";
import { SizeGuide } from "@/components/home/size-guide";
import { Faq } from "@/components/home/faq";
import { buttonClasses } from "@/components/ui/button";
import {
  getSettings,
  getFeaturedProducts,
  getCategories,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, featured, categories] = await Promise.all([
    getSettings(),
    getFeaturedProducts(12),
    getCategories(),
  ]);

  const heroImages = featured
    .flatMap((p) => p.images)
    .filter(Boolean)
    .slice(0, 12);

  return (
    <>
      {heroImages.length >= 1 ? (
        <CorridorHero
          title={settings.heroTitle}
          subtitle={settings.heroSubtitle}
          images={heroImages}
        />
      ) : (
        <Hero title={settings.heroTitle} subtitle={settings.heroSubtitle} />
      )}
      <Marquee />
      <TrustStrip />

      <div className="mx-auto max-w-7xl space-y-24 px-4 py-20 sm:px-6 lg:px-8">
        <TeamsMarquee />

        {/* Featured */}
        <section>
          <SectionHeading
            kicker="Seçilmiş formalar"
            title="Ən çox axtarılanlar"
            description="Kolleksiyanın vitrini — klub, milli və retro formaların ən yaxşıları."
          />
          <div className="mt-12">
            {featured.length > 0 ? (
              <FeaturedCarousel products={featured} />
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line-strong bg-surface/50 px-6 py-16 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-2xl border border-gold/30 bg-ink-2 text-gold">
                  <Sparkles className="h-7 w-7" />
                </span>
                <h3 className="mt-5 font-display text-2xl font-bold italic text-cream">
                  Kolleksiya hazırlanır
                </h3>
                <p className="mt-2 max-w-md text-sm text-muted">
                  Seçilmiş formalar tezliklə burada olacaq. Sifariş və mövcud
                  formalar üçün bizimlə WhatsApp-da əlaqə saxla.
                </p>
                <Link
                  href="/kataloq"
                  className={buttonClasses("outline", "md", "mt-6")}
                >
                  Kataloqa bax
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Categories */}
        <section>
          <SectionHeading
            kicker="Kateqoriyalar"
            title="Nə axtarırsan?"
            description="Klublardan milli komandalara, retro klassiklərdən uşaq dəstlərinə qədər."
          />
          <div className="mt-12">
            <CategoryGrid categories={categories} />
          </div>
        </section>

        <Suspense fallback={null}>
          <FootballScores />
        </Suspense>

        <HowTo />
        <SizeGuide />
        <Faq />
        <CtaBand whatsappNumber={settings.whatsappNumber} />
      </div>
    </>
  );
}
