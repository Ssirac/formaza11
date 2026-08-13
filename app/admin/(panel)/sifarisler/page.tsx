import Link from "next/link";
import { ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { getLeads } from "@/lib/admin-data";
import { PageHeader } from "@/components/admin/page-header";
import { LeadsTable } from "@/components/admin/leads-table";

export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const page = Math.max(
    1,
    Math.trunc(Number(typeof sp.sehife === "string" ? sp.sehife : 1)) || 1
  );
  const { leads, total, page: current, totalPages } = await getLeads({ page });

  const href = (p: number) => (p > 1 ? `/admin/sifarisler?sehife=${p}` : "/admin/sifarisler");

  return (
    <div>
      <PageHeader
        title="Sifarişlər"
        description="Müştərilərin “WhatsApp-da sifariş” düyməsi ilə göstərdiyi maraq — forma və ölçü üzrə."
      />

      {total > 0 && (
        <p className="mb-4 text-sm text-muted">
          {total} sorğu{totalPages > 1 ? ` · səhifə ${current}/${totalPages}` : ""}
        </p>
      )}

      {leads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line-strong bg-surface/50 px-6 py-16 text-center">
          <Inbox className="mx-auto h-10 w-10 text-line-strong" strokeWidth={1.2} />
          <p className="mt-4 font-display text-lg font-bold italic text-cream">
            Hələ sifariş sorğusu yoxdur
          </p>
          <p className="mt-1 text-sm text-muted">
            Müştəri məhsul səhifəsində “WhatsApp-da sifariş” düyməsinə basanda
            burada görünəcək.
          </p>
        </div>
      ) : (
        <LeadsTable leads={leads} />
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {current > 1 ? (
            <Link
              href={href(current - 1)}
              className="inline-flex h-10 items-center gap-1 rounded-lg border border-line-strong px-3 text-sm font-semibold text-cream hover:border-gold hover:text-gold"
            >
              <ChevronLeft className="h-4 w-4" /> Əvvəlki
            </Link>
          ) : null}
          <span className="px-2 text-sm text-muted">
            {current} / {totalPages}
          </span>
          {current < totalPages ? (
            <Link
              href={href(current + 1)}
              className="inline-flex h-10 items-center gap-1 rounded-lg border border-line-strong px-3 text-sm font-semibold text-cream hover:border-gold hover:text-gold"
            >
              Növbəti <ChevronRight className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
      )}
    </div>
  );
}
