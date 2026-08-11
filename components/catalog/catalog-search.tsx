"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

export function CatalogSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("axtar") ?? "");
  const [, startTransition] = useTransition();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const t = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim()) params.set("axtar", value.trim());
      else params.delete("axtar");
      startTransition(() => {
        router.replace(`/kataloq?${params.toString()}`, { scroll: false });
      });
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
      <input
        type="text"
        inputMode="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Forma adı ilə axtar…"
        className="h-11 w-full rounded-full border border-line-strong bg-surface pl-10 pr-10 text-sm text-cream placeholder:text-faint focus:border-gold focus:outline-none"
        aria-label="Forma axtar"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-faint hover:text-cream"
          aria-label="Təmizlə"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
