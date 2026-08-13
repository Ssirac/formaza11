"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, ExternalLink } from "lucide-react";
import type { Lead } from "@/lib/admin-data";
import { deleteLead, clearAllLeads } from "@/lib/actions/leads";
import { ConfirmDialog } from "./confirm-dialog";
import { formatDate } from "@/lib/utils";

export function LeadsTable({ leads }: { leads: Lead[] }) {
  const router = useRouter();
  const [target, setTarget] = useState<Lead | null>(null);
  const [clearing, setClearing] = useState(false);
  const [pending, start] = useTransition();

  function removeOne() {
    if (!target) return;
    const l = target;
    start(async () => {
      const res = await deleteLead(l.id);
      if (res.ok) {
        toast.success("Sifariş silindi");
        setTarget(null);
        router.refresh();
      } else {
        toast.error(res.error ?? "Silinmədi");
      }
    });
  }

  function removeAll() {
    start(async () => {
      const res = await clearAllLeads();
      if (res.ok) {
        toast.success("Bütün sifarişlər silindi");
        setClearing(false);
        router.refresh();
      } else {
        toast.error(res.error ?? "Silinmədi");
      }
    });
  }

  return (
    <>
      <div className="mb-3 flex justify-end">
        <button
          type="button"
          onClick={() => setClearing(true)}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-red-500/40 px-3.5 text-sm font-semibold text-red-300 transition-colors hover:border-red-500/60 hover:bg-red-500/10"
        >
          <Trash2 className="h-4 w-4" />
          Hamısını sil
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="hidden grid-cols-[1fr_84px_100px_150px_56px] gap-4 border-b border-line bg-ink-2/50 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-silver-deep lg:grid">
          <span>Forma</span>
          <span className="text-center">Ölçü</span>
          <span className="text-right">Qiymət (₼)</span>
          <span className="text-right">Tarix</span>
          <span className="text-right">Sil</span>
        </div>
        <ul className="divide-y divide-line">
          {leads.map((l) => (
            <li
              key={l.id}
              className="grid grid-cols-1 gap-2 px-5 py-4 lg:grid-cols-[1fr_84px_100px_150px_56px] lg:items-center"
            >
              <div className="flex items-center gap-2">
                {l.slug ? (
                  <Link
                    href={`/forma/${l.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 font-medium text-cream hover:text-gold"
                  >
                    {l.productName}
                    <ExternalLink className="h-3.5 w-3.5 text-faint" />
                  </Link>
                ) : (
                  <span className="font-medium text-cream">{l.productName}</span>
                )}
              </div>
              <div className="text-sm lg:text-center">
                <span className="text-xs text-muted lg:hidden">Ölçü: </span>
                <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md border border-line-strong px-2 text-xs font-semibold text-cream">
                  {l.size}
                </span>
              </div>
              <div className="text-sm lg:text-right">
                <span className="text-xs text-muted lg:hidden">Qiymət: </span>
                <span className="font-semibold text-cream">
                  {l.salePrice != null ? `${l.salePrice} ₼` : "—"}
                </span>
              </div>
              <div className="text-xs text-faint lg:text-right">
                {formatDate(l.createdAt)}
              </div>
              <div className="lg:flex lg:justify-end">
                <button
                  type="button"
                  onClick={() => setTarget(l)}
                  aria-label="Sifarişi sil"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line-strong text-muted transition-colors hover:border-red-500/60 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <ConfirmDialog
        open={!!target}
        title="Sifarişi sil"
        message={`"${target?.productName}" (${target?.size}) sorğusu silinəcək.`}
        pending={pending}
        onConfirm={removeOne}
        onCancel={() => setTarget(null)}
      />
      <ConfirmDialog
        open={clearing}
        title="Bütün sifarişləri sil"
        message="Bütün sifariş sorğuları birdəfəlik silinəcək. Bu əməliyyat geri qaytarıla bilməz."
        pending={pending}
        onConfirm={removeAll}
        onCancel={() => setClearing(false)}
      />
    </>
  );
}
