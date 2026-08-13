import { WhatsAppIcon, InstagramIcon, TikTokIcon } from "@/components/ui/icons";
import { buildContactUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type Item = {
  href: string;
  label: string;
  Icon: (p: { className?: string }) => React.ReactNode;
  cls: string;
};

/**
 * Fixed bottom-right stack of contact buttons: WhatsApp (always) plus
 * Instagram / TikTok when their URLs are set in admin settings.
 */
export function FloatingSocials({
  whatsappNumber,
  instagramUrl,
  tiktokUrl,
}: {
  whatsappNumber: string;
  instagramUrl?: string;
  tiktokUrl?: string;
}) {
  const items: Item[] = [
    {
      href: buildContactUrl(whatsappNumber),
      label: "WhatsApp",
      Icon: WhatsAppIcon,
      cls: "bg-[#25D366] text-white",
    },
  ];
  if (instagramUrl)
    items.push({
      href: instagramUrl,
      label: "Instagram",
      Icon: InstagramIcon,
      cls: "bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5] text-white",
    });
  if (tiktokUrl)
    items.push({
      href: tiktokUrl,
      label: "TikTok",
      Icon: TikTokIcon,
      cls: "bg-black text-white",
    });

  return (
    <div className="fixed bottom-5 right-4 z-40 flex flex-col gap-3 sm:bottom-6 sm:right-6 print:hidden">
      {items.map((it) => (
        <a
          key={it.label}
          href={it.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={it.label}
          className={cn(
            "pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full shadow-lg ring-1 ring-black/10 transition-transform duration-200 hover:scale-110 active:scale-95",
            it.cls,
          )}
        >
          <it.Icon className="h-6 w-6" />
        </a>
      ))}
    </div>
  );
}
