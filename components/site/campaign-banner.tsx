import { Megaphone } from "lucide-react";

/** Highlighted promo strip at the very top; hidden when no campaign text is set. */
export function CampaignBanner({ text }: { text?: string }) {
  if (!text || !text.trim()) return null;
  return (
    <div className="relative z-50 bg-metal-gold text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs font-semibold sm:text-sm">
        <Megaphone className="h-4 w-4 shrink-0" />
        <span>{text}</span>
      </div>
    </div>
  );
}
