import { MARQUEE_ITEMS } from "@/lib/constants";

export function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="pause-on-hover relative overflow-hidden border-y border-line bg-ink-2/60 py-3">
      <div className="flex w-max animate-marquee">
        {items.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="px-6 font-display text-sm font-extrabold uppercase italic tracking-[0.2em] text-silver-deep">
              {item}
            </span>
            <span className="text-gold" aria-hidden>
              ✦
            </span>
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-ink to-transparent" />
    </div>
  );
}
