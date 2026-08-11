import { HOW_TO_STEPS } from "@/lib/constants";
import { SectionHeading } from "./section-heading";
import { Reveal } from "@/components/motion/reveal";

export function HowTo() {
  return (
    <section id="nece-sifaris" className="scroll-mt-24">
      <SectionHeading
        kicker="Sadə 3 addım"
        title="Necə sifariş edilir?"
        description="Qeydiyyat yoxdur, səbət yoxdur — birbaşa WhatsApp üzərindən sürətli sifariş."
      />

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {HOW_TO_STEPS.map((step, i) => (
          <Reveal key={step.n} delay={i * 0.1}>
            <div className="relative h-full overflow-hidden rounded-2xl border border-line bg-surface p-7">
              <span className="font-display text-6xl font-black italic text-line-strong/70">
                {step.n}
              </span>
              <h3 className="mt-4 font-display text-xl font-bold italic text-cream">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.text}
              </p>
              <span className="absolute right-6 top-6 h-2 w-2 rounded-full bg-gold" />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
