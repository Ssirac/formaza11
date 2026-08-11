import { Truck, ShieldCheck, MessageCircle } from "lucide-react";

const ITEMS = [
  { icon: Truck, text: "Bütün Azərbaycana çatdırılma" },
  { icon: ShieldCheck, text: "Orijinal dizayn · premium parça" },
  { icon: MessageCircle, text: "WhatsApp ilə 1 dəqiqəyə sifariş" },
];

export function AnnouncementBar() {
  return (
    <div className="relative z-50 border-b border-line/70 bg-ink-2">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-6 px-4 py-2 sm:gap-10">
        {ITEMS.map((it, i) => (
          <span
            key={i}
            className={`items-center gap-2 text-[11px] font-medium tracking-wide text-silver-deep sm:text-xs ${
              i === 0 ? "flex" : "hidden sm:flex"
            }`}
          >
            <it.icon className="h-3.5 w-3.5 text-gold" />
            {it.text}
          </span>
        ))}
      </div>
    </div>
  );
}
