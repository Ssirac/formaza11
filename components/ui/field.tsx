import { cn } from "@/lib/utils";

export const inputClass =
  "h-11 w-full rounded-lg border border-line-strong bg-surface px-3.5 text-sm text-cream placeholder:text-faint transition-colors focus:border-gold focus:outline-none";

export const textareaClass =
  "min-h-28 w-full rounded-lg border border-line-strong bg-surface p-3.5 text-sm text-cream placeholder:text-faint transition-colors focus:border-gold focus:outline-none";

export const selectClass =
  "h-11 w-full rounded-lg border border-line-strong bg-surface px-3 text-sm text-cream transition-colors focus:border-gold focus:outline-none";

export function Field({
  label,
  hint,
  htmlFor,
  children,
  className,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-semibold text-cream"
      >
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-faint">{hint}</p>}
    </div>
  );
}
