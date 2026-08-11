"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import type { AdminCategory } from "@/lib/admin-data";
import { inputClass, selectClass } from "@/components/ui/field";

export function ProductFilters({
  categories,
}: {
  categories: AdminCategory[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("axtar") ?? "");
  const first = useRef(true);

  function push(next: URLSearchParams) {
    const qs = next.toString();
    router.replace(qs ? `/admin/mehsullar?${qs}` : "/admin/mehsullar", {
      scroll: false,
    });
  }

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const t = setTimeout(() => {
      const next = new URLSearchParams(params.toString());
      if (q.trim()) next.set("axtar", q.trim());
      else next.delete("axtar");
      push(next);
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function onCategory(v: string) {
    const next = new URLSearchParams(params.toString());
    if (v) next.set("kateqoriya", v);
    else next.delete("kateqoriya");
    push(next);
  }

  function onHidden(v: string) {
    const next = new URLSearchParams(params.toString());
    if (v && v !== "all") next.set("gizli", v);
    else next.delete("gizli");
    push(next);
  }

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ad ilə axtar…"
          className={`${inputClass} pl-10`}
          aria-label="Məhsul axtar"
        />
      </div>
      <select
        defaultValue={params.get("kateqoriya") ?? ""}
        onChange={(e) => onCategory(e.target.value)}
        className={`${selectClass} sm:w-52`}
        aria-label="Kateqoriya filtri"
      >
        <option value="">Bütün kateqoriyalar</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <select
        defaultValue={params.get("gizli") ?? "all"}
        onChange={(e) => onHidden(e.target.value)}
        className={`${selectClass} sm:w-40`}
        aria-label="Görünmə filtri"
      >
        <option value="all">Hamısı</option>
        <option value="visible">Yalnız aktiv</option>
        <option value="hidden">Yalnız gizli</option>
      </select>
    </div>
  );
}
