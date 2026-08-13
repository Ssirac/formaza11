/**
 * Full-width brand video band — the clip plays muted on a loop, clean, with
 * no text or controls over it.
 */
export function VideoShowcase() {
  return (
    <section className="overflow-hidden rounded-3xl border border-line bg-ink-2">
      <video
        className="block h-auto w-full"
        src="/formaza11video.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
      />
    </section>
  );
}
