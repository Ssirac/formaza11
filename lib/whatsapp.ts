// Framework-agnostic WhatsApp helpers — safe to import on client & server.

import { categoryEmoji } from "@/lib/constants";

export function buildWhatsAppMessage(
  productName: string,
  size: string,
  productUrl?: string,
  phone?: string,
  price?: number | null,
  categorySlug?: string
): string {
  const emoji = categoryEmoji(categorySlug);
  // Jersey categories read as "forması"; shorts/accessories/etc. stay generic.
  const notJersey = /şort|köyn[əe]k|aksesuar|çanta|papaq|corab|[əe]lc[əe]k|tayt|bandaj/i;
  const isJersey =
    !notJersey.test(productName) && categorySlug !== "aksesuar";

  let msg: string;
  if (price != null && price > 0) {
    msg = isJersey
      ? `Salam 👋🏼 ${productName} formasının qiyməti ${price} AZN-dir. ${emoji}`
      : `Salam 👋🏼 ${productName} — qiyməti ${price} AZN-dir. ${emoji}`;
  } else {
    msg = isJersey
      ? `Salam 👋🏼 ${productName} forması. ${emoji}`
      : `Salam 👋🏼 ${productName} ${emoji}`;
  }
  msg +=
    size && size !== "—"
      ? `\nSeçdiyim ölçü: ${size} 📦`
      : `\nSifariş üçün ölçünüzü qeyd edə bilərsiniz. 📦`;
  if (phone && phone.trim()) msg += `\nNömrəm: ${phone.trim()}`;
  if (productUrl) msg += `\n${productUrl}`;
  return msg;
}

export function normalizePhone(raw: string): string {
  return (raw || "").replace(/[^0-9]/g, "");
}

export function buildWhatsAppUrl(
  rawNumber: string,
  productName: string,
  size: string,
  productUrl?: string,
  phone?: string,
  price?: number | null,
  categorySlug?: string
): string {
  const number = normalizePhone(rawNumber);
  const text = encodeURIComponent(
    buildWhatsAppMessage(productName, size, productUrl, phone, price, categorySlug)
  );
  return `https://wa.me/${number}?text=${text}`;
}

// Generic contact link (no product context) for footer / navbar.
export function buildContactUrl(rawNumber: string, message?: string): string {
  const number = normalizePhone(rawNumber);
  const base = `https://wa.me/${number}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
