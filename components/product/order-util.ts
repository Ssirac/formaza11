import { buildWhatsAppUrl } from "@/lib/whatsapp";

/**
 * Fire-and-forget click tracking, then open WhatsApp in a new tab.
 * Tracking never blocks or delays the navigation.
 */
export function trackAndOpen(params: {
  productId: string;
  productName: string;
  size: string;
  whatsappNumber: string;
  slug?: string;
  phone?: string;
  price?: number | null;
}) {
  const { productId, productName, size, whatsappNumber, slug, phone, price } =
    params;
  try {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, size, phone: phone || undefined }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // tracking must never surface an error
  }
  const productUrl =
    slug && typeof window !== "undefined"
      ? `${window.location.origin}/forma/${slug}`
      : undefined;
  const url = buildWhatsAppUrl(
    whatsappNumber,
    productName,
    size,
    productUrl,
    phone,
    price
  );
  window.open(url, "_blank", "noopener,noreferrer");
}
