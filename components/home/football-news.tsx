import { ArrowUpRight } from "lucide-react";
import { getFootballNews } from "@/lib/football";
import { SectionHeading } from "./section-heading";
import { Reveal } from "@/components/motion/reveal";

function fmt(d: string): string {
  try {
    return new Intl.DateTimeFormat("az-AZ", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(d));
  } catch {
    return "";
  }
}

export async function FootballNews({
  heading = true,
  limit = 8,
}: {
  heading?: boolean;
  limit?: number;
}) {
  const news = await getFootballNews(limit);
  if (news.length === 0) return null;

  return (
    <section id="xeberler" className="scroll-mt-24">
      {heading && (
        <SectionHeading
          kicker="Xəbərlər"
          title="Ən yeni futbol xəbərləri"
          description="Dünya futbolundan ən son başlıqlar — mənbəyə keçid üçün üstünə toxun."
        />
      )}
      <Reveal className={heading ? "mt-10" : ""}>
        <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
          {news.map((n, i) => (
            <a
              key={`${n.link}-${i}`}
              href={n.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-2"
            >
              <span className="hidden w-6 shrink-0 font-display text-lg font-bold italic text-line-strong sm:block">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-cream transition-colors group-hover:text-gold">
                  {n.title}
                </p>
                <p className="mt-0.5 text-xs text-faint">
                  {n.source} · {fmt(n.date)}
                </p>
              </div>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-faint transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold" />
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
