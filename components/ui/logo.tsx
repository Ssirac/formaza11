import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Inline SVG badge — gold ring, "F11" mark. Dependency-free so the brand
 * always renders crisply. The photographic PNG badge (public/brand/…png) is
 * used for favicon / OG image.
 */
export function BadgeMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("h-9 w-9", className)}
      role="img"
      aria-label="FORMAZA11 nişanı"
    >
      <defs>
        <linearGradient id="fmz-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9cc0ff" />
          <stop offset="0.5" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#12307a" />
        </linearGradient>
        <linearGradient id="fmz-silver" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7da8ff" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="47" fill="#0b0b0d" />
      <circle
        cx="50"
        cy="50"
        r="47"
        fill="none"
        stroke="url(#fmz-gold)"
        strokeWidth="3"
      />
      <text
        x="30"
        y="66"
        fontFamily="var(--font-kanit), sans-serif"
        fontSize="46"
        fontStyle="italic"
        fontWeight="900"
        fill="url(#fmz-gold)"
      >
        F
      </text>
      <text
        x="52"
        y="66"
        fontFamily="var(--font-kanit), sans-serif"
        fontSize="30"
        fontStyle="italic"
        fontWeight="900"
        fill="url(#fmz-silver)"
      >
        11
      </text>
    </svg>
  );
}

export function Logo({
  className,
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src="/brand/formaza11-badge.png"
        alt="FORMAZA11"
        width={40}
        height={40}
        priority
        className="h-9 w-9 shrink-0 rounded-xl object-contain"
      />
      {showText && (
        <span className="font-display text-xl font-extrabold italic tracking-tight leading-none">
          <span className="text-metal-gold">FORMAZA</span>
          <span className="text-gold">11</span>
        </span>
      )}
    </span>
  );
}
