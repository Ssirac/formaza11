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
}) {
  const { productId, productName, size, whatsappNumber } = params;
  try {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, size }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // tracking must never surface an error
  }
  const url = buildWhatsAppUrl(whatsappNumber, productName, size);
  window.open(url, "_blank", "noopener,noreferrer");
}
