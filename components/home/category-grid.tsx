import Link from "next/link";
import {
  Trophy,
  Flag,
  History,
  Baby,
  ArrowUpRight,
  Car,
  Swords,
  Snowflake,
  Shield,
  Zap,
  Target,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CategoryDTO } from "@/lib/types";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  klublar: Trophy,
  "milli-komandalar": Flag,
  retro: History,
  "usaq-destleri": Baby,
  basketbol: Target,
  f1: Car,
  ufc: Swords,
  hokkey: Snowflake,
  reqbi: Shield,
  "amerikan-futbolu": Zap,
};

export function CategoryGrid({ categories }: { categories: CategoryDTO[] }) {
  if (categories.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((c, i) => {
        const Icon = ICONS[c.slug] ?? Trophy;
        const featured = i === 0;
        return (
          <Reveal
            key={c.id}
            delay={i * 0.06}
            className={cn(featured && "sm:col-span-2 lg:col-span-2")}
          >
            <Link
              href={`/kataloq?kateqoriya=${c.slug}`}
              className={cn(
                "group relative flex h-full min-h-44 flex-col justify-between overflow-hidden rounded-2xl border border-line bg-surface p-6 transition-all duration-300 hover:border-gold/50",
                featured && "min-h-56"
              )}
            >
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle, rgba(227,178,60,0.25), transparent 70%)",
                }}
                aria-hidden
              />
              <div className="flex items-center justify-between">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-line-strong bg-ink-2 text-gold transition-colors group-hover:border-gold/50">
                  <Icon className="h-6 w-6" strokeWidth={1.6} />
                </span>
                <ArrowUpRight className="h-5 w-5 text-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold" />
              </div>
              <div className="relative">
                <h3
                  className={cn(
                    "font-display font-extrabold italic text-cream transition-colors group-hover:text-gold",
                    featured ? "text-3xl" : "text-2xl"
                  )}
                >
                  {c.name}
                </h3>
                <p className="mt-1 text-sm text-muted">
                  {c.productCount > 0
                    ? `${c.productCount} forma`
                    : "Tezliklə"}
                </p>
              </div>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}
