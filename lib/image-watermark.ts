// Tiled, faded "FORMAZA11" text overlay, baked into Cloudinary delivery URLs.
const WATERMARK =
  "l_text:Arial_48_bold:FORMAZA11,co_white,o_18,a_-20,fl_tiled";

/**
 * Inject the watermark transformation into a Cloudinary delivery URL so the
 * served image carries it. Idempotent (skips if already applied) and a no-op
 * for non-Cloudinary URLs.
 */
export function withCloudinaryWatermark(url: string): string {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }
  if (url.includes("l_text:")) return url; // already watermarked
  return url.replace("/upload/", `/upload/${WATERMARK}/`);
}
