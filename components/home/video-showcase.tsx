"use client";

/**
 * Full-width brand video band — plays muted on a loop, no text or controls.
 * The 2.3MB clip is NOT fetched on page load: preload="none" plus an
 * IntersectionObserver defers loading/playing until the band scrolls into view,
 * so it never competes with the hero for bandwidth (big LCP win on mobile).
 */
import { useEffect, useRef } from "react";

export function VideoShowcase() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Start loading + playing only once it's near the viewport.
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="overflow-hidden rounded-3xl border border-line bg-ink-2">
      <video
        ref={ref}
        className="block h-auto w-full"
        src="/formaza11video.mp4"
        muted
        loop
        playsInline
        preload="none"
        aria-hidden
      />
    </section>
  );
}
