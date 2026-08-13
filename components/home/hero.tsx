"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { ShaderAnimation } from "@/components/ui/shader-lines";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero({ title, subtitle }: { title: string; subtitle: string }) {
  const lines = title.split("\n").filter(Boolean);

  // magnetic primary CTA
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 250, damping: 15 });
  const y = useSpring(my, { stiffness: 250, damping: 15 });

  return (
    <section className="always-dark relative flex min-h-[92vh] items-center overflow-hidden bg-[#070b1a] text-cream">
      {/* Animated gold shader backdrop */}
      <ShaderAnimation className="opacity-[0.5]" />
      {/* Contrast overlays so the typography stays legible */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(65% 55% at 50% 42%, transparent 0%, rgba(8,8,10,0.55) 100%)",
        }}
        aria-hidden
      />
      <div className="spotlight pointer-events-none absolute inset-0" aria-hidden />
      <div className="pitch-lines pointer-events-none absolute inset-0 opacity-25" aria-hidden />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-silver backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            Azərbaycanın forma ünvanı
          </motion.span>

          <h1 className="mt-6 font-display text-[15vw] font-black italic uppercase leading-[0.86] tracking-tight sm:text-7xl lg:text-8xl">
            {lines.map((line, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.1 + i * 0.1 }}
                className="block text-metal-gold"
              >
                {line}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.4 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.55 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <motion.div
              style={{ x, y }}
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                mx.set((e.clientX - r.left - r.width / 2) * 0.35);
                my.set((e.clientY - r.top - r.height / 2) * 0.35);
              }}
              onMouseLeave={() => {
                mx.set(0);
                my.set(0);
              }}
            >
              <Link href="/kataloq" className={buttonClasses("gold", "lg")}>
                Kataloqa bax
                <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>
            <Link href="/#nece-sifaris" className={buttonClasses("outline", "lg")}>
              Necə sifariş?
            </Link>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.7 }}
            className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-silver-deep"
          >
            {["Orijinal dizayn", "Premium parça", "Sürətli çatdırılma"].map(
              (f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-gold" />
                  {f}
                </li>
              )
            )}
          </motion.ul>
        </div>

        {/* Emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
          className="relative mx-auto hidden aspect-square w-full max-w-md items-center justify-center lg:flex"
        >
          <div className="absolute inset-0 rounded-full border border-gold/20" />
          <div className="absolute inset-8 rounded-full border border-gold/10" />
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="glow-gold rounded-full"
          >
            <Image
              src="/brand/formaza11-badge.png"
              alt="FORMAZA11"
              width={224}
              height={224}
              priority
              className="h-56 w-56 rounded-full object-contain drop-shadow-[0_0_40px_rgba(59,130,246,0.45)]"
            />
          </motion.div>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
}
