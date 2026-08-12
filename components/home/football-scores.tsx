import { getRecentMatches } from "@/lib/football";
import { SectionHeading } from "./section-heading";
import { Reveal } from "@/components/motion/reveal";

export async function FootballScores() {
  const matches = await getRecentMatches(6);
  if (matches.length === 0) return null;

  return (
    <section>
      <SectionHeading
        kicker="Meydandan"
        title="Son futbol nəticələri"
        description="Avropanın aparıcı liqalarından ən son oyun hesabları — futbol nəbzini burada tut."
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {matches.map((m, i) => (
          <Reveal key={`${m.home}-${m.away}-${i}`} delay={i * 0.05}>
            <div className="h-full rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-gold/40">
              <div className="flex items-center justify-between text-xs text-faint">
                <span className="truncate">{m.league}</span>
                <span>{m.date}</span>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-cream">
                  {m.home}
                </span>
                <span className="shrink-0 rounded-lg border border-gold/30 bg-gold/10 px-3 py-1 font-display text-lg font-extrabold text-gold">
                  {m.homeScore}–{m.awayScore}
                </span>
                <span className="min-w-0 flex-1 truncate text-right text-sm font-semibold text-cream">
                  {m.away}
                </span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
