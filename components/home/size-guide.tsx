"use client";

import { useState } from "react";
import { Ruler, Info } from "lucide-react";
import { SIZE_GUIDES, SIZE_NOTE } from "@/lib/constants";
import { SectionHeading } from "./section-heading";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function SizeGuide() {
  const [active, setActive] = useState(0);
  const guide = SIZE_GUIDES[active];

  return (
    <section id="olcu-beledcisi" className="scroll-mt-24">
      <SectionHeading
        kicker="Ölçü bələdçisi"
        title="Doğru ölçünü seç"
        description="Hər idman növü üçün ayrıca cədvəl — növü seç, boyuna və çəkinə görə ölçünü tap."
      />

      <Reveal className="mt-10">
        {/* Sport tabs */}
        <div className="flex flex-wrap gap-2">
          {SIZE_GUIDES.map((g, i) => (
            <button
              key={g.key}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold transition-all",
                i === active
                  ? "border-gold bg-gold/15 text-gold"
                  : "border-line-strong text-muted hover:border-gold/50 hover:text-cream"
              )}
            >
              {g.label}
            </button>
          ))}
        </div>

        <p className="mt-4 text-sm text-muted">{guide.fit}</p>

        <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
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
                </tr>
              </thead>
              <tbody>
                {guide.rows.map((r) => (
                  <tr
                    key={r.size}
                    className="border-b border-line/60 transition-colors last:border-0 hover:bg-ink-2/40"
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-start gap-3 border-t border-line bg-gold/5 px-5 py-4">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
            <p className="text-sm text-cream">{SIZE_NOTE}</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
