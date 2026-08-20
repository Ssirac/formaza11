import { WATERMARK } from "@/lib/image-watermark";

/**
 * next/image loader for Cloudinary-hosted images. The browser fetches an
 * optimized variant straight from Cloudinary's CDN — auto format (AVIF/WebP),
 * auto quality, and the exact width next/image requests — instead of proxying
 * the full-size original through Next's optimizer. The FORMAZA11 watermark is
 * (re)applied so the delivered image always carries it.
 *
 * Non-Cloudinary URLs are returned unchanged.
 */
export function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  if (!src.includes("res.cloudinary.com") || !src.includes("/upload/")) {
    return src;
  }
  const [pre, postRaw] = src.split("/upload/");
  // Strip any watermark and any transform we added before, so re-runs are idempotent.
  const post = postRaw
    .replace(/^l_text:[^/]*\//, "")
    .replace(/^f_auto,q_[^/]*,w_\d+,c_limit\/(l_text:[^/]*\/)?/, "");
  const delivery = `f_auto,q_${quality ?? "auto"},w_${width},c_limit`;
  return `${pre}/upload/${delivery}/${WATERMARK}/${post}`;
}
