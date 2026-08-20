"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2, Shirt, Eye, EyeOff, Copy } from "lucide-react";
import type { AdminProductListItem } from "@/lib/admin-data";
import { buildWhatsAppMessage } from "@/lib/whatsapp";
import {
  setProductHidden,
  setProductFeatured,
  setProductStock,
  setProductQuantity,
  setProductStockAlert,
  deleteProduct,
} from "@/lib/actions/products";
import { STOCK_STATUSES } from "@/lib/constants";
import { Switch } from "./switch";
import { ConfirmDialog } from "./confirm-dialog";
import { cn } from "@/lib/utils";

export function ProductTable({ products }: { products: AdminProductListItem[] }) {
  const router = useRouter();
  const [target, setTarget] = useState<AdminProductListItem | null>(null);
  const [deleting, startDelete] = useTransition();

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line-strong bg-surface/50 px-6 py-16 text-center">
        <Shirt className="mx-auto h-10 w-10 text-line-strong" strokeWidth={1.2} />
        <p className="mt-4 font-display text-lg font-bold italic text-cream">
          Məhsul tapılmadı
        </p>
        <p className="mt-1 text-sm text-muted">
          Filtri dəyiş və ya yeni məhsul əlavə et.
        </p>
      </div>
    );
  }

  function confirmDelete() {
    if (!target) return;
    const p = target;
    startDelete(async () => {
      const res = await deleteProduct(p.id);
      if (res.ok) {
        toast.success(`"${p.name}" silindi`);
        setTarget(null);
        router.refresh();
      } else {
        toast.error(res.error ?? "Silinmədi");
      }
    });
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        {/* header (desktop) */}
        <div className="hidden grid-cols-[1fr_112px_64px_64px_120px_84px_116px] gap-4 border-b border-line bg-ink-2/50 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-silver-deep lg:grid">
          <span>Məhsul</span>
          <span>Stok</span>
          <span className="text-center">Seçilmiş</span>
          <span className="text-center">Gizli</span>
          <span className="text-center">Say / Göstər</span>
          <span className="text-right">Qiymət (₼)</span>
          <span className="text-right">Əməliyyat</span>
        </div>

        <ul className="divide-y divide-line">
          {products.map((p) => (
            <ProductRow key={p.id} product={p} onDelete={() => setTarget(p)} />
          ))}
        </ul>
      </div>

      <ConfirmDialog
        open={!!target}
        title="Məhsulu sil"
        message={`"${target?.name}" birdəfəlik silinəcək. Bu əməliyyat geri qaytarıla bilməz.`}
        pending={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setTarget(null)}
      />
    </>
  );
}

function ProductRow({
  product,
  onDelete,
}: {
  product: AdminProductListItem;
  onDelete: () => void;
}) {
  const router = useRouter();
  const [featured, setFeatured] = useState(product.isFeatured);
  const [hidden, setHidden] = useState(product.isHidden);
  const [stock, setStock] = useState(product.stockStatus);
  const [qty, setQty] = useState(
    product.quantity == null ? "" : String(product.quantity)
  );
  const [alert, setAlert] = useState(product.stockAlert);
  const [busy, setBusy] = useState(false);

  async function toggleAlert() {
    const next = !alert;
    setAlert(next);
    const res = await setProductStockAlert(product.id, next);
    if (!res.ok) {
      setAlert(!next);
      toast.error(res.error ?? "Dəyişmədi");
    } else {
      toast.success(
        next ? "Kataloqda “Son X ədəd” göstərilir" : "Gizlədildi"
      );
      router.refresh();
    }
  }

  async function copyMsg() {
    const msg = buildWhatsAppMessage(
      product.name,
      "—",
      undefined,
      undefined,
      product.salePrice
    );
    try {
      await navigator.clipboard.writeText(msg);
      toast.success("Mesaj kopyalandı");
    } catch {
      toast.error("Kopyalanmadı");
    }
  }

  async function saveQty() {
    const t = qty.trim();
    const num = t === "" ? null : Number(t);
    if (num !== null && (!Number.isFinite(num) || num < 0)) {
      setQty(product.quantity == null ? "" : String(product.quantity));
      return;
    }
    if (num === product.quantity) return;
    const res = await setProductQuantity(product.id, num);
    if (!res.ok) toast.error(res.error ?? "Dəyişmədi");
    else {
      toast.success("Say yeniləndi");
      router.refresh();
    }
  }

  async function changeStock(value: string) {
    const prev = stock;
    setStock(value);
    setBusy(true);
    const res = await setProductStock(
      product.id,
      value as "in_stock" | "on_way" | "pre_order"
    );
    setBusy(false);
    if (!res.ok) {
      setStock(prev);
      toast.error(res.error ?? "Dəyişmədi");
    } else {
      toast.success("Stok yeniləndi");
      router.refresh();
    }
  }

  const { costPrice, shippingCost, salePrice } = product.pricing;
  const profit =
    salePrice != null ? salePrice - (costPrice ?? 0) - (shippingCost ?? 0) : null;

  async function toggleFeatured(v: boolean) {
    setFeatured(v);
    setBusy(true);
    const res = await setProductFeatured(product.id, v);
    setBusy(false);
    if (!res.ok) {
      setFeatured(!v);
      toast.error(res.error ?? "Dəyişmədi");
    } else {
      toast.success(v ? "Seçilmişlərə əlavə olundu" : "Seçilmişlərdən çıxarıldı");
      router.refresh();
    }
  }

  async function toggleHidden(v: boolean) {
    setHidden(v);
    setBusy(true);
    const res = await setProductHidden(product.id, v);
    setBusy(false);
    if (!res.ok) {
      setHidden(!v);
      toast.error(res.error ?? "Dəyişmədi");
    } else {
      toast.success(v ? "Məhsul gizlədildi" : "Məhsul göründü");
      router.refresh();
    }
  }

  return (
    <li className="grid grid-cols-1 gap-4 px-5 py-4 lg:grid-cols-[1fr_112px_64px_64px_120px_84px_116px] lg:items-center">
      {/* product */}
      <div className="flex items-center gap-3">
        <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg border border-line bg-ink-2">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt=""
              fill
              sizes="44px"
              className="object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center">
              <Shirt className="h-5 w-5 text-line-strong" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <Link
            href={`/admin/mehsullar/${product.id}`}
            className="block truncate font-medium text-cream hover:text-gold"
          >
            {product.name}
          </Link>
          <p className="truncate text-xs text-faint">/{product.slug}</p>
          <p className="mt-0.5 text-xs text-muted">
            {product.categoryName} · {product.sizes.length} ölçü
          </p>
        </div>
      </div>

      {/* stock status */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted lg:hidden">Stok:</span>
        <select
          value={stock}
          onChange={(e) => changeStock(e.target.value)}
          disabled={busy}
          className={cn(
            "h-9 w-full rounded-lg border border-line-strong bg-ink-2 px-2 text-xs font-semibold outline-none transition-colors hover:border-gold/50 disabled:opacity-50",
            stock === "in_stock"
              ? "text-pitch"
              : stock === "on_way"
                ? "text-sky-400"
                : "text-red-400"
          )}
        >
          {STOCK_STATUSES.map((s) => (
            <option key={s.value} value={s.value} className="bg-ink-2 text-cream">
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* featured */}
      <div className="flex items-center gap-2 lg:justify-center">
        <span className="text-xs text-muted lg:hidden">Seçilmiş</span>
        <Switch
          checked={featured}
          onChange={toggleFeatured}
          disabled={busy}
          label="Seçilmiş"
        />
      </div>

      {/* hidden */}
      <div className="flex items-center gap-2 lg:justify-center">
        <span className="text-xs text-muted lg:hidden">Gizli</span>
        <Switch
          checked={hidden}
          onChange={toggleHidden}
          disabled={busy}
          label="Gizli"
        />
      </div>

      {/* quantity + catalog "Son X ədəd" toggle */}
      <div className="flex items-center gap-2 lg:justify-center">
        <span className="text-xs text-muted lg:hidden">Say:</span>
        <input
          type="number"
          min="0"
          inputMode="numeric"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          onBlur={saveQty}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          }}
          placeholder="—"
          className="h-9 w-14 rounded-lg border border-line-strong bg-ink-2 px-2 text-center text-sm text-cream outline-none transition-colors hover:border-gold/50 focus:border-gold"
        />
        <button
          type="button"
          onClick={toggleAlert}
          aria-pressed={alert}
          title={
            alert ? "Kataloqda “Son X ədəd” göstərilir" : "Kataloqda gizli"
          }
          className={cn(
            "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors",
            alert
              ? "border-red-500/50 bg-red-500/10 text-red-400"
              : "border-line-strong text-muted hover:border-gold/50 hover:text-cream"
          )}
        >
          {alert ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </button>
      </div>

      {/* price (admin-only) */}
      <div className="flex items-baseline gap-2 text-sm lg:flex-col lg:items-end lg:gap-0.5">
        <span className="text-xs text-muted lg:hidden">Qiymət:</span>
        {salePrice != null ? (
          <>
            <span className="font-semibold text-cream">{salePrice} ₼</span>
            {profit != null && (
              <span
                className={cn(
                  "text-xs font-medium",
                  profit >= 0 ? "text-pitch" : "text-red-400"
                )}
              >
                {profit >= 0 ? "+" : ""}
                {Number.isInteger(profit) ? profit : profit.toFixed(2)} ₼
              </span>
            )}
          </>
        ) : (
          <span className="text-faint">—</span>
        )}
      </div>

      {/* actions */}
      <div className="flex items-center gap-2 lg:justify-end">
        <button
          type="button"
          onClick={copyMsg}
          title="WhatsApp mesajını kopyala"
          aria-label="Mesajı kopyala"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line-strong text-muted transition-colors hover:border-pitch/60 hover:text-pitch"
        >
          <Copy className="h-4 w-4" />
        </button>
        <Link
          href={`/admin/mehsullar/${product.id}`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line-strong text-muted transition-colors hover:border-gold hover:text-gold"
          aria-label="Redaktə et"
        >
          <Pencil className="h-4 w-4" />
        </Link>
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line-strong text-muted transition-colors hover:border-red-500/60 hover:text-red-300"
          aria-label="Sil"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}
