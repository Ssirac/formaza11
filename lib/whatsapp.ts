// Framework-agnostic WhatsApp helpers — safe to import on client & server.

export function buildWhatsAppMessage(
  productName: string,
  size: string
): string {
  return `Salam! Formaza11 saytından yazıram. "${productName}" (${size} ölçü) — qiymət və sifariş haqqında məlumat almaq istəyirəm.`;
}

export function normalizePhone(raw: string): string {
  return (raw || "").replace(/[^0-9]/g, "");
}

export function buildWhatsAppUrl(
  rawNumber: string,
  productName: string,
  size: string
): string {
  const number = normalizePhone(rawNumber);
  const text = encodeURIComponent(buildWhatsAppMessage(productName, size));
  return `https://wa.me/${number}?text=${text}`;
}

// Generic contact link (no product context) for footer / navbar.
export function buildContactUrl(rawNumber: string, message?: string): string {
  const number = normalizePhone(rawNumber);
  const base = `https://wa.me/${number}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
