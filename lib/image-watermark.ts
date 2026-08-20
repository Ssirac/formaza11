// One large, faded, centered "FORMAZA11" — scales to the image width.
export const WATERMARK =
  "l_text:Arial_40_bold:FORMAZA11,co_white,o_20,w_0.7,fl_relative,a_-18,g_center";

/**
 * Ensure a Cloudinary delivery URL carries the current watermark. Inserts it,
 * or replaces an older watermark segment, so changing the style updates every
 * image. No-op for non-Cloudinary URLs.
 */
export function withCloudinaryWatermark(url: string): string {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }
  const [pre, post] = url.split("/upload/");
  // Drop a previously-applied l_text watermark segment, if any.
  const cleaned = post.replace(/^l_text:[^/]*\//, "");
  return `${pre}/upload/${WATERMARK}/${cleaned}`;
}
