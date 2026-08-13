import Link from "next/link";
import { SectionHeading } from "./section-heading";
import { CLUB_CRESTS, NATION_CRESTS, type Crest } from "@/lib/club-logos";

function Pill({ crest }: { crest: Crest }) {
  return (
    <Link
      href={`/komanda/${crest.slug}`}
      aria-label={`${crest.name} formaları`}
      className="inline-flex shrink-0 items-center gap-2.5 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:border-gold hover:text-gold"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={crest.src}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-9 w-9 shrink-0 object-contain"
        draggable={false}
      />
      <span className="whitespace-nowrap">{crest.name}</span>
    </Link>
  );
}

function Row({ items, reverse }: { items: Crest[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  // Duration scales with the row length so both rows scroll at the same,
  // calm speed regardless of how many crests they hold.
  const durationSec = Math.max(60, Math.round(items.length * 2.2));
  return (
    <div className="pause-on-hover flex overflow-hidden">
      <div
        style={{
          animationDuration: `${durationSec}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
        className="animate-marquee-slow flex w-max gap-3 pr-3"
      >
        {doubled.map((c, i) => (
          <Pill key={`${c.src}-${i}`} crest={c} />
        ))}
      </div>
    </div>
  );
}

const ROW_COUNT = 4;

/** All crests spread evenly across the rows (round-robin keeps each row mixed). */
const ROWS: Crest[][] = Array.from({ length: ROW_COUNT }, () => []);
[...CLUB_CRESTS, ...NATION_CRESTS].forEach((crest, i) => {
  ROWS[i % ROW_COUNT].push(crest);
});

export function TeamsMarquee() {
  return (
    <section>
      <SectionHeading
        center
        kicker="Klublar & Milli komandalar"
        title="Sevimli komandan burada"
        description="Avropanın böyük klublarından milli komandalara qədər — istədiyin formanı WhatsApp-da soruş."
      />
      <div className="mt-10 space-y-3 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        {ROWS.map((items, i) => (
          <Row key={i} items={items} reverse={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}
