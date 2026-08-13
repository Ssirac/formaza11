import Link from "next/link";
import { ChevronLeft, ChevronRight, Inbox, ExternalLink } from "lucide-react";
import { getLeads } from "@/lib/admin-data";
import { PageHeader } from "@/components/admin/page-header";
import { formatDate } from "@/lib/utils";

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
        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          <div className="hidden grid-cols-[1fr_90px_110px_160px] gap-4 border-b border-line bg-ink-2/50 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-silver-deep lg:grid">
            <span>Forma</span>
            <span className="text-center">Ölçü</span>
            <span className="text-right">Qiymət (₼)</span>
            <span className="text-right">Tarix</span>
          </div>
          <ul className="divide-y divide-line">
            {leads.map((l) => (
              <li
                key={l.id}
                className="grid grid-cols-1 gap-2 px-5 py-4 lg:grid-cols-[1fr_90px_110px_160px] lg:items-center"
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
              </li>
            ))}
          </ul>
        </div>
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
