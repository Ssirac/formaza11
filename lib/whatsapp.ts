// Framework-agnostic WhatsApp helpers — safe to import on client & server.

export function buildWhatsAppMessage(
  productName: string,
  size: string,
  productUrl?: string
): string {
  const base = `Salam! Formaza11 saytından yazıram. "${productName}" (${size} ölçü) — qiymət və sifariş haqqında məlumat almaq istəyirəm.`;
  return productUrl ? `${base}\n${productUrl}` : base;
}

export function normalizePhone(raw: string): string {
  return (raw || "").replace(/[^0-9]/g, "");
}

export function buildWhatsAppUrl(
  rawNumber: string,
  productName: string,
  size: string,
  productUrl?: string
): string {
  const number = normalizePhone(rawNumber);
  const text = encodeURIComponent(
    buildWhatsAppMessage(productName, size, productUrl)
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
