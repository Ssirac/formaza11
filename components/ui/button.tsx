import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "gold" | "outline" | "ghost" | "silver" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  gold: "bg-metal-gold text-ink btn-gloss hover:brightness-[1.06] active:scale-[0.98]",
  silver:
    "bg-gradient-to-b from-white to-silver-deep text-ink hover:brightness-105 active:scale-[0.98]",
  outline:
    "border border-line-strong text-cream hover:border-gold hover:text-gold bg-transparent",
  ghost: "text-muted hover:text-cream hover:bg-surface-2",
  danger:
    "border border-red-500/40 text-red-300 hover:bg-red-500/10 hover:border-red-500/60",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[15px]",
  lg: "h-14 px-8 text-base",
};

export function buttonClasses(
  variant: Variant = "gold",
  size: Size = "md",
  className?: string
) {
  return cn(base, variants[variant], sizes[size], className);
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "gold", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={buttonClasses(variant, size, className)}
      {...props}
    />
  )
);
Button.displayName = "Button";
