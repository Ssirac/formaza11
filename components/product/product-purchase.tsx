"use client";

import { useState } from "react";
import { SizeChips } from "./size-chips";
import { trackAndOpen } from "./order-util";
import { WhatsAppIcon } from "@/components/ui/icons";
import { buttonClasses } from "@/components/ui/button";

export function ProductPurchase({
  productId,
  productName,
  sizes,
  whatsappNumber,
}: {
  productId: string;
  productName: string;
  sizes: string[];
  whatsappNumber: string;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [tip, setTip] = useState(false);

  const hasSizes = sizes.length > 0;

  function order() {
    if (hasSizes && !selected) {
      setShake(true);
      setTip(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setTip(false), 2200);
      return;
    }
    trackAndOpen({
      productId,
      productName,
      size: selected ?? "—",
      whatsappNumber,
    });
  }

  return (
    <>
      {/* Inline selector + CTA */}
      <div className="space-y-5">
        {hasSizes ? (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-cream">
                Ölçü seç
              </span>
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

        <div className="relative">
          {tip && (
            <span className="absolute -top-9 left-0 rounded-md bg-gold px-3 py-1.5 text-sm font-semibold text-ink shadow-lg">
              Əvvəlcə ölçünü seç
            </span>
          )}
          <button
            type="button"
            onClick={order}
            className={buttonClasses("gold", "lg", "w-full")}
          >
            <WhatsAppIcon className="h-5 w-5" />
            WhatsApp-da soruş
          </button>
          <p className="mt-3 text-center text-xs text-faint">
            Qiymət və sifariş detalları WhatsApp-da bildirilir.
          </p>
        </div>
      </div>

      {/* Sticky mobile CTA bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/95 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-faint">{productName}</p>
            <p className="text-sm font-semibold text-cream">
              {selected ? `Ölçü: ${selected}` : "Ölçü seçilməyib"}
            </p>
          </div>
          <button
            type="button"
            onClick={order}
            className={buttonClasses("gold", "md", "shrink-0")}
          >
            <WhatsAppIcon className="h-4 w-4" />
            Soruş
          </button>
        </div>
      </div>
    </>
  );
}
