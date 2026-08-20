import { Ruler, Info, Shirt } from "lucide-react";
import { SIZE_GUIDE_ROWS, SIZE_NOTE, SPORT_FIT_NOTE } from "@/lib/constants";
import { SectionHeading } from "./section-heading";
import { Reveal } from "@/components/motion/reveal";

export function SizeGuide() {
  return (
    <section id="olcu-beledcisi" className="scroll-mt-24">
      <SectionHeading
        kicker="Ölçü bələdçisi"
        title="Doğru ölçünü seç"
        description="Çin (1688 / Taobao) ölçülərinə əsaslanır və bütün formalar üçündür — futbol, basketbol, UFC, hokkey və s. Əmin deyilsənsə, boyunu/çəkini WhatsApp-da yaz, biz seçək."
      />

      <Reveal className="mt-10">
        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-ink-2/60 text-xs uppercase tracking-wider text-silver-deep">
                  <th className="px-5 py-4 font-semibold">
                    <span className="inline-flex items-center gap-2">
                      <Ruler className="h-4 w-4 text-gold" />
                      Ölçü
                    </span>
                  </th>
                  <th className="px-5 py-4 font-semibold">Boy (sm)</th>
                  <th className="px-5 py-4 font-semibold">Çəki (kg)</th>
                  <th className="px-5 py-4 font-semibold">Sinə (sm)</th>
                  <th className="px-5 py-4 font-semibold">Uzunluq (sm)</th>
                  <th className="px-5 py-4 font-semibold">Təxmini bədən</th>
                </tr>
              </thead>
              <tbody>
                {SIZE_GUIDE_ROWS.map((r) => (
                  <tr
                    key={r.size}
                    className="border-b border-line/60 last:border-0 transition-colors hover:bg-ink-2/40"
                  >
                    <td className="px-5 py-4">
                      <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-gold/40 px-2 font-display font-bold text-gold">
                        {r.size}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-cream">{r.height}</td>
                    <td className="px-5 py-4 text-cream">{r.weight}</td>
                    <td className="px-5 py-4 text-cream">{r.chest}</td>
                    <td className="px-5 py-4 text-cream">{r.length}</td>
                    <td className="px-5 py-4 text-muted">{r.advice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-start gap-3 border-t border-line bg-gold/5 px-5 py-4">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
            <p className="text-sm text-cream">{SIZE_NOTE}</p>
          </div>
          <div className="flex items-start gap-3 border-t border-line px-5 py-4">
            <Shirt className="mt-0.5 h-5 w-5 shrink-0 text-silver" />
            <p className="text-sm text-muted">{SPORT_FIT_NOTE}</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
