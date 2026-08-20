"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2, Shirt, MousePointerClick } from "lucide-react";
import type { AdminProductListItem } from "@/lib/admin-data";
import {
  setProductHidden,
  setProductFeatured,
  setProductStock,
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
        <div className="hidden grid-cols-[1fr_128px_76px_76px_52px_100px_84px] gap-4 border-b border-line bg-ink-2/50 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-silver-deep lg:grid">
          <span>Məhsul</span>
          <span>Stok</span>
          <span className="text-center">Seçilmiş</span>
          <span className="text-center">Gizli</span>
          <span className="text-center">Klik</span>
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
  const [busy, setBusy] = useState(false);

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
    <li className="grid grid-cols-1 gap-4 px-5 py-4 lg:grid-cols-[1fr_128px_76px_76px_52px_100px_84px] lg:items-center">
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

      {/* clicks */}
      <div className="flex items-center gap-1.5 text-sm text-muted lg:justify-center">
        <MousePointerClick className="h-4 w-4 text-faint lg:hidden" />
        <span className={cn(product.clickCount > 0 && "text-gold")}>
          {product.clickCount}
        </span>
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
