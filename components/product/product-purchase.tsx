"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Minus, Plus } from "lucide-react";
import { SizeChips } from "./size-chips";
import { trackAndOpen } from "./order-util";
import { WhatsAppIcon } from "@/components/ui/icons";
import { buttonClasses } from "@/components/ui/button";
import { FavoriteButton } from "@/components/store/favorite-button";
import { useCart, useStoreUI } from "@/components/store/store";

export function ProductPurchase({
  productId,
  slug,
  productName,
  image,
  sizes,
  whatsappNumber,
  salePrice,
  categorySlug,
}: {
  productId: string;
  slug: string;
  productName: string;
  image?: string;
  sizes: string[];
  whatsappNumber: string;
  salePrice?: number | null;
  categorySlug?: string;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [phone, setPhone] = useState("");
  const [shake, setShake] = useState(false);
  const [tip, setTip] = useState(false);

  const { add } = useCart();
  const { openCart } = useStoreUI();
  const hasSizes = sizes.length > 0;

  function requireSize(): boolean {
    if (hasSizes && !selected) {
      setShake(true);
      setTip(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setTip(false), 2200);
      return false;
    }
    return true;
  }

  function addToCart() {
    if (!requireSize()) return;
    add(
      { id: productId, slug, name: productName, image, size: selected ?? "—" },
      qty
    );
    toast.success("Səbətə əlavə olundu");
    openCart();
  }

  function orderNow() {
    if (!requireSize()) return;
    trackAndOpen({
      productId,
      productName,
      size: selected ?? "—",
      whatsappNumber,
      slug,
      phone,
      price: salePrice,
      categorySlug,
    });
  }

  return (
    <>
      <div className="space-y-5">
        {hasSizes ? (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-cream">Ölçü seç</span>
              {selected && (
                <span className="text-sm text-gold">Seçilmiş: {selected}</span>
              )}
            </div>
            <SizeChips
              sizes={sizes}
              selected={selected}
              onSelect={setSelected}
              shake={shake}
            />
          </div>
        ) : (
          <p className="rounded-lg border border-line bg-surface px-4 py-3 text-sm text-muted">
            Bu forma üçün hazırda ölçü mövcud deyil — WhatsApp-da soruş.
          </p>
        )}

        {/* Quantity */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-cream">Say</span>
          <div className="flex items-center gap-1 rounded-lg border border-line-strong">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="grid h-10 w-10 place-items-center text-muted hover:text-cream"
              aria-label="Azalt"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-8 text-center font-semibold text-cream">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              className="grid h-10 w-10 place-items-center text-muted hover:text-cream"
              aria-label="Artır"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Optional contact number — logged with the order */}
        <div>
          <label
            htmlFor="order-phone"
            className="mb-2 block text-sm font-semibold text-cream"
          >
            Nömrəniz{" "}
            <span className="font-normal text-faint">(istəyə bağlı)</span>
          </label>
          <input
            id="order-phone"
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+994 __ ___ __ __"
            className="w-full rounded-lg border border-line-strong bg-surface px-4 py-3 text-sm text-cream outline-none transition-colors focus:border-gold"
          />
        </div>

        <div className="relative space-y-3">
          {tip && (
            <span className="absolute -top-9 left-0 rounded-md bg-gold px-3 py-1.5 text-sm font-semibold text-ink shadow-lg">
              Əvvəlcə ölçünü seç
            </span>
          )}
          <button
            type="button"
            onClick={addToCart}
            className={buttonClasses("gold", "lg", "w-full")}
          >
            Səbətə at
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={orderNow}
              className={buttonClasses("outline", "md", "flex-1")}
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp-da soruş
            </button>
            <FavoriteButton
              variant="solid"
              item={{ id: productId, slug, name: productName, image }}
            />
          </div>
          <p className="text-center text-xs text-faint">
            Qiymət və çatdırılma WhatsApp-da bildirilir.
          </p>
        </div>
      </div>

      {/* Sticky mobile bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/95 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-faint">{productName}</p>
            <p className="text-sm font-semibold text-cream">
              {selected ? `Ölçü: ${selected} · ${qty} ədəd` : "Ölçü seçilməyib"}
            </p>
          </div>
          <button
            type="button"
            onClick={addToCart}
            className={buttonClasses("gold", "md", "shrink-0")}
          >
            Səbətə at
          </button>
        </div>
      </div>
    </>
  );
}
