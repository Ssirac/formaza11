import { cn } from "@/lib/utils";

export function SectionHeading({
  kicker,
  title,
  description,
  center,
  className,
}: {
  kicker?: string;
  title: React.ReactNode;
  description?: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        center && "mx-auto text-center",
        className
      )}
    >
      {kicker && (
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-gold">
          <span className="h-px w-6 bg-gold" />
          {kicker}
        </span>
      )}
      <h2 className="mt-4 font-display text-3xl font-extrabold italic leading-[1.05] text-cream sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted">{description}</p>
      )}
    </div>
  );
}
