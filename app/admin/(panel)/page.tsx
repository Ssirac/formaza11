import Link from "next/link";
import {
  Shirt,
  EyeOff,
  Tags,
  MousePointerClick,
  Plus,
  TrendingUp,
  AlertTriangle,
  Wallet,
} from "lucide-react";
import {
  getAdminStats,
  getTopProducts,
  getRecentClicks,
  getPricingSummary,
} from "@/lib/admin-data";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { buttonClasses } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const includeOnWay = sp.anbar === "hamisi";

  const [stats, top, recent, pricing] = await Promise.all([
    getAdminStats(),
    getTopProducts(6),
    getRecentClicks(8),
    getPricingSummary({ includeOnWay }),
  ]);

  const money = (n: number) =>
    `${Math.round(n)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₼`;

  return (
    <div>
      <PageHeader
        title="İdarə paneli"
        description="Mağazanın ümumi vəziyyəti və maraq statistikası."
        action={
          <Link
            href="/admin/mehsullar/yeni"
            className={buttonClasses("gold", "md")}
          >
            <Plus className="h-4 w-4" />
            Yeni məhsul
          </Link>
        }
      />

      {!stats.connected && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            Verilənlər bazasına qoşulma yoxdur. <code>.env</code> faylında{" "}
            <code>DATABASE_URL</code> düzgün olduğundan və{" "}
            <code>npm run db:push</code> icra edildiyindən əmin olun.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Aktiv məhsul" value={stats.active} icon={Shirt} accent />
        <StatCard label="Gizli məhsul" value={stats.hidden} icon={EyeOff} />
        <StatCard label="Kateqoriya" value={stats.categories} icon={Tags} />
        <StatCard
          label="7 günlük klik"
          value={stats.clicks7d}
          icon={MousePointerClick}
        />
      </div>

      {/* Maliyyə xülasəsi (yalnız admin) */}
      <div className="mt-6 rounded-2xl border border-line bg-surface p-5">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-gold" />
          <h2 className="font-display text-base font-bold italic text-cream">
            Maliyyə xülasəsi
          </h2>
          <span className="ml-auto text-xs text-faint">
            {pricing.priced} qiymətli · {pricing.unpriced} qiymətsiz
          </span>
        </div>

        <div className="mt-3 inline-flex rounded-xl border border-line-strong p-1">
          <Link
            href="/admin"
            scroll={false}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
              !includeOnWay
                ? "bg-gold/15 text-gold"
                : "text-muted hover:text-cream"
            }`}
          >
            Yalnız Əldədə
          </Link>
          <Link
            href="/admin?anbar=hamisi"
            scroll={false}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
              includeOnWay
                ? "bg-gold/15 text-gold"
                : "text-muted hover:text-cream"
            }`}
          >
            Yolda olanlar da
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-xl border border-line bg-ink-2 px-4 py-3">
            <p className="text-xs text-muted">Anbar dəyəri</p>
            <p className="mt-1 font-display text-xl font-bold text-cream">
              {money(pricing.inventoryCost)}
            </p>
          </div>
          <div className="rounded-xl border border-line bg-ink-2 px-4 py-3">
            <p className="text-xs text-muted">Potensial gəlir</p>
            <p className="mt-1 font-display text-xl font-bold text-cream">
              {money(pricing.potentialRevenue)}
            </p>
          </div>
          <div className="rounded-xl border border-gold/30 bg-gold/10 px-4 py-3">
            <p className="text-xs text-gold/80">Potensial mənfəət</p>
            <p className="mt-1 font-display text-xl font-bold text-gold">
              {money(pricing.potentialProfit)}
            </p>
          </div>
          <div className="rounded-xl border border-line bg-ink-2 px-4 py-3">
            <p className="text-xs text-muted">Orta marja</p>
            <p className="mt-1 font-display text-xl font-bold text-cream">
              {pricing.avgMarginPct}%
            </p>
          </div>
        </div>
        <p className="mt-3 text-xs text-faint">
          Yalnız satış qiyməti təyin edilmiş məhsullar hesablanır. Bu rəqəmlər
          yalnız admin paneldə görünür.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        {/* Top products */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-line bg-surface">
            <div className="flex items-center gap-2 border-b border-line px-5 py-4">
              <TrendingUp className="h-4 w-4 text-gold" />
              <h2 className="font-display text-base font-bold italic text-cream">
                Ən çox maraq görən formalar
              </h2>
            </div>
            {top.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-muted">
                Hələ klik qeydə alınmayıb.
              </p>
            ) : (
              <ul className="divide-y divide-line">
                {top.map((p, i) => (
                  <li
                    key={p.id}
                    className="flex items-center gap-4 px-5 py-3.5"
                  >
                    <span className="w-5 font-display text-lg font-bold italic text-line-strong">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/forma/${p.slug}`}
                        target="_blank"
                        className="truncate font-medium text-cream hover:text-gold"
                      >
                        {p.name}
                      </Link>
                      <p className="text-xs text-faint">{p.categoryName}</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-2.5 py-1 text-xs font-semibold text-gold">
                      <MousePointerClick className="h-3.5 w-3.5" />
                      {p.clicks}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Recent clicks */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-line bg-surface">
            <div className="border-b border-line px-5 py-4">
              <h2 className="font-display text-base font-bold italic text-cream">
                Son kliklər
              </h2>
            </div>
            {recent.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-muted">
                Fəaliyyət yoxdur.
              </p>
            ) : (
              <ul className="divide-y divide-line">
                {recent.map((c) => (
                  <li key={c.id} className="px-5 py-3">
                    <p className="truncate text-sm text-cream">
                      {c.productName}
                    </p>
                    <div className="mt-0.5 flex items-center justify-between text-xs text-faint">
                      <span>Ölçü: {c.size}</span>
                      <span>{formatDate(c.createdAt)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
