import { WhatsAppIcon } from "@/components/ui/icons";
import { buildContactUrl } from "@/lib/whatsapp";
import { buttonClasses } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export function CtaBand({ whatsappNumber }: { whatsappNumber: string }) {
  const href = buildContactUrl(
    whatsappNumber,
    "Salam! Axtardığım formanı tapa bilmədim, kömək edə bilərsiniz?"
  );

  return (
    <Reveal>
      <section className="always-dark relative overflow-hidden rounded-3xl border border-gold/20 bg-[#0d0d10] text-cream">
        <div className="spotlight pointer-events-none absolute inset-0" aria-hidden />
        <div className="pitch-lines pointer-events-none absolute inset-0 opacity-50" aria-hidden />
        <div className="relative flex flex-col items-center gap-6 px-6 py-14 text-center sm:px-10">
          <h2 className="max-w-2xl font-display text-3xl font-extrabold italic leading-tight text-cream sm:text-4xl">
            Axtardığın formanı tapmadın?
            <span className="block text-metal-gold">Bizə yaz, tapaq.</span>
          </h2>
          <p className="max-w-lg text-muted">
            İstədiyin klub, milli komanda və ya retro forma — adını WhatsApp-da
            yaz, mövcudluğu və qiyməti dərhal bildirək.
          </p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses("gold", "lg")}
          >
            <WhatsAppIcon className="h-5 w-5" />
            WhatsApp-da yaz
          </a>
        </div>
      </section>
    </Reveal>
  );
}
