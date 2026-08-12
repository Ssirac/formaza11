import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Football3D } from "./football-3d";
import { SectionHeading } from "./section-heading";
import { buttonClasses } from "@/components/ui/button";

export function PitchShowcase() {
  return (
    <section className="always-dark relative overflow-hidden rounded-3xl border border-gold/15 bg-[#0a0a0c] text-cream">
      <div className="spotlight pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pitch-lines pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
      />
      <div className="relative grid items-center gap-6 p-8 sm:p-12 lg:grid-cols-2 lg:gap-4 lg:p-16">
        <div>
          <SectionHeading
            kicker="Meydan səninlə başlayır"
            title={
              <>
                Rəngləri gey,{" "}
                <span className="text-metal-gold">oyunu yaşa</span>
              </>
            }
            description="Klub, milli və retro formalar — hər tikişi orijinala sadiq. Bəyəndiyini seç, WhatsApp-da yaz, 15–20 günə əlində olsun."
          />
          <div className="mt-8">
            <Link href="/kataloq" className={buttonClasses("gold", "lg")}>
              Kataloqa bax
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
        <div className="relative mx-auto h-72 w-full max-w-md sm:h-96 lg:h-[440px]">
          <Football3D />
        </div>
      </div>
    </section>
  );
}
