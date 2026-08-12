import { SectionHeading } from "./section-heading";
import { cn } from "@/lib/utils";

const CLUBS = [
  "Real Madrid",
  "Barcelona",
  "Manchester United",
  "Manchester City",
  "Liverpool",
  "Arsenal",
  "Chelsea",
  "Bayern München",
  "Paris Saint-Germain",
  "Juventus",
  "AC Milan",
  "Inter",
  "Qarabağ FK",
  "Napoli",
  "Atlético Madrid",
  "Borussia Dortmund",
];

const NATIONS = [
  "Azərbaycan",
  "Argentina",
  "Braziliya",
  "Fransa",
  "Portuqaliya",
  "İspaniya",
  "Almaniya",
  "İtaliya",
  "İngiltərə",
  "Türkiyə",
  "Xorvatiya",
  "Niderland",
  "Belçika",
  "Uruqvay",
];

function Pill({ name }: { name: string }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-line-strong bg-surface px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:border-gold hover:text-gold">
      <span className="h-1.5 w-1.5 rounded-full bg-gold" />
      {name}
    </span>
  );
}

function Row({ items, reverse }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="pause-on-hover flex overflow-hidden">
      <div
        className={cn(
          "flex w-max gap-3 pr-3",
          reverse ? "animate-marquee-slow [animation-direction:reverse]" : "animate-marquee-slow"
        )}
      >
        {doubled.map((t, i) => (
          <Pill key={`${t}-${i}`} name={t} />
        ))}
      </div>
    </div>
  );
}

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
        <Row items={CLUBS} />
        <Row items={NATIONS} reverse />
      </div>
    </section>
  );
}
