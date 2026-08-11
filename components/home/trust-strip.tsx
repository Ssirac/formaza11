import { Truck, ShieldCheck, RefreshCw, Headset } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ITEMS: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Truck,
    title: "15–20 günə çatdırılma",
    text: "Bütün bölgələrə göndəririk",
  },
  {
    icon: ShieldCheck,
    title: "Orijinal keyfiyyət",
    text: "Səliqəli tikiş və emblemlər",
  },
  {
    icon: RefreshCw,
    title: "Dəyişdirmə imkanı",
    text: "Ölçü uyğun gəlməsə həll edirik",
  },
  {
    icon: Headset,
    title: "Canlı WhatsApp dəstəyi",
    text: "Sualına dərhal cavab veririk",
  },
];

export function TrustStrip() {
  return (
    <section className="border-y border-line bg-surface/40">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
        {ITEMS.map((it, i) => (
          <div
            key={i}
            className="flex items-start gap-3 px-2 py-6 sm:px-5"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-gold/25 bg-ink-2 text-gold">
              <it.icon className="h-5 w-5" strokeWidth={1.7} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-cream">{it.title}</p>
              <p className="mt-0.5 text-xs text-muted">{it.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
