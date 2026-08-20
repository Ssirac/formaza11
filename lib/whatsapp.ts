// Framework-agnostic WhatsApp helpers — safe to import on client & server.

export function buildWhatsAppMessage(
  productName: string,
  size: string,
  productUrl?: string,
  phone?: string
): string {
  let msg = `Salam! Formaza11 saytından yazıram. "${productName}" (${size} ölçü) — qiymət və sifariş haqqında məlumat almaq istəyirəm.`;
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
  phone?: string
): string {
  const number = normalizePhone(rawNumber);
  const text = encodeURIComponent(
    buildWhatsAppMessage(productName, size, productUrl, phone)
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
