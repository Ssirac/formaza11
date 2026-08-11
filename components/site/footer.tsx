import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { WhatsAppIcon, TikTokIcon, InstagramIcon } from "@/components/ui/icons";
import { buildContactUrl } from "@/lib/whatsapp";

export function Footer({
  whatsappNumber,
  instagramUrl,
  tiktokUrl,
}: {
  whatsappNumber: string;
  instagramUrl?: string;
  tiktokUrl?: string;
}) {
  const contact = buildContactUrl(whatsappNumber);
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 border-t border-line bg-ink-2/60">
      <div className="pitch-lines absolute inset-0 opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              Klub, milli komanda, retro və uşaq futbol formaları. Orijinala
              sadiq keyfiyyət, WhatsApp ilə sürətli və rahat sifariş.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-cream">
              Keçidlər
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                { label: "Kataloq", href: "/kataloq" },
                { label: "Necə sifariş edilir", href: "/#nece-sifaris" },
                { label: "Ölçü bələdçisi", href: "/#olcu-beledcisi" },
                { label: "FAQ", href: "/#faq" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-muted transition-colors hover:text-gold"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-cream">
              Əlaqə
            </h4>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={contact}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line-strong text-cream transition-colors hover:border-gold hover:text-gold"
              >
                <WhatsAppIcon className="h-5 w-5" />
              </a>
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line-strong text-cream transition-colors hover:border-gold hover:text-gold"
                >
                  <InstagramIcon className="h-5 w-5" />
                </a>
              )}
              {tiktokUrl && (
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line-strong text-cream transition-colors hover:border-gold hover:text-gold"
                >
                  <TikTokIcon className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-xs text-faint sm:flex-row">
          <p>© {year} FORMAZA11. Bütün hüquqlar qorunur.</p>
          <p>forma + mağaza + starting eleven</p>
        </div>
      </div>
    </footer>
  );
}
