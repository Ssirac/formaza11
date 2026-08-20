import type { Metadata } from "next";
import { Suspense } from "react";
import { FootballNews } from "@/components/home/football-news";
import { FootballScores } from "@/components/home/football-scores";

export const revalidate = 60; // ISR: keşlənir, admin dəyişəndə revalidatePath dərhal təzələyir

export const metadata: Metadata = {
  title: "Futbol xəbərləri",
  description:
    "Dünya futbolundan ən yeni xəbərlər və Avropa liqalarının son nəticələri.",
};

export default function NewsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-20 px-4 py-14 sm:px-6 lg:px-8">
      <header>
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-gold">
          <span className="h-px w-6 bg-gold" />
          Meydandan
        </span>
        <h1 className="mt-4 font-display text-4xl font-extrabold italic text-cream sm:text-5xl">
          Futbol <span className="text-metal-gold">xəbərləri</span> & nəticələri
        </h1>
        <p className="mt-4 max-w-xl text-muted">
          Ən yeni başlıqlar və Avropanın aparıcı liqalarından son oyun hesabları
          — bir yerdə.
        </p>
      </header>

      <Suspense fallback={null}>
        <FootballNews />
      </Suspense>

      <Suspense fallback={null}>
        <FootballScores />
      </Suspense>
    </div>
  );
}
