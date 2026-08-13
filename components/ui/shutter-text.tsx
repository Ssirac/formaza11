"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  type HTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface ShutterTextProps extends HTMLAttributes<HTMLDivElement> {
  text?: string;
  trigger?: "auto" | "scroll" | "click" | "hover";
  /** Colour of the settled/main glyphs. @default "text-zinc-900 dark:text-white" */
  baseClassName?: string;
  /** Colour of the top & bottom sliding slices. @default "text-indigo-600 dark:text-emerald-400" */
  accentClassName?: string;
}

/** Split into words (keeping spaces as tokens) so lines only break between
    words, never mid-word — each word is a nowrap group of animated glyphs. */
function toWords(text: string): { word: string; start: number }[] {
  const out: { word: string; start: number }[] = [];
  let i = 0;
  for (const token of text.split(/(\s+)/)) {
    // Keep real words only; spacing between them comes from the flex gap.
    if (token.length && token.trim().length) out.push({ word: token, start: i });
    i += token.length;
  }
  return out;
}

export default function ShutterText({
  text = "IMMERSE",
  trigger = "auto",
  baseClassName = "text-zinc-900 dark:text-white",
  accentClassName = "text-indigo-600 dark:text-emerald-400",
  className = "",
  ...props
}: ShutterTextProps) {
  const [count, setCount] = useState(0);
  const [animating, setAnimating] = useState(trigger === "auto");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  const words = toWords(text);

  useEffect(() => {
    if (trigger === "scroll" && isInView) {
      setAnimating(true);
      setCount((c) => c + 1);
    }
    if (trigger === "scroll" && !isInView) setAnimating(false);
  }, [trigger, isInView]);

  useEffect(() => {
    if (trigger === "auto") {
      setAnimating(true);
      setCount((c) => c + 1);
    }
  }, [trigger]);

  const handleClick = useCallback(() => {
    if (trigger === "click") {
      setAnimating(true);
      setCount((c) => c + 1);
    }
  }, [trigger]);

  const handleMouseEnter = useCallback(() => {
    if (trigger === "hover") {
      setAnimating(true);
      setCount((c) => c + 1);
    }
  }, [trigger]);

  const handleMouseLeave = useCallback(() => {
    if (trigger === "hover") setAnimating(false);
  }, [trigger]);

  const renderChar = (char: string, i: number) => {
    const glyph = char === " " ? " " : char;
    if (!animating) {
      return (
        <span
          key={i}
          className={`inline-block font-black leading-none tracking-tighter ${baseClassName}`}
        >
          {glyph}
        </span>
      );
    }
    return (
      <span key={i} className="relative inline-block overflow-hidden">
        <motion.span
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ delay: i * 0.04 + 0.3, duration: 0.8 }}
          className={`inline-block font-black leading-none tracking-tighter ${baseClassName}`}
        >
          {glyph}
        </motion.span>
        <motion.span
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: "100%", opacity: [0, 1, 0] }}
          transition={{ duration: 0.7, delay: i * 0.04, ease: "easeInOut" }}
          className={`pointer-events-none absolute inset-0 z-10 inline-block font-black leading-none ${accentClassName}`}
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 35%, 0 35%)" }}
        >
          {char}
        </motion.span>
        <motion.span
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: "-100%", opacity: [0, 1, 0] }}
          transition={{ duration: 0.7, delay: i * 0.04 + 0.1, ease: "easeInOut" }}
          className={`pointer-events-none absolute inset-0 z-10 inline-block font-black leading-none ${baseClassName}`}
          style={{ clipPath: "polygon(0 35%, 100% 35%, 100% 65%, 0 65%)" }}
        >
          {char}
        </motion.span>
        <motion.span
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: "100%", opacity: [0, 1, 0] }}
          transition={{ duration: 0.7, delay: i * 0.04 + 0.2, ease: "easeInOut" }}
          className={`pointer-events-none absolute inset-0 z-10 inline-block font-black leading-none ${accentClassName}`}
          style={{ clipPath: "polygon(0 65%, 100% 65%, 100% 100%, 0 100%)" }}
        >
          {char}
        </motion.span>
      </span>
    );
  };

  const content = (
    <span className="flex flex-wrap items-center justify-center gap-x-[0.3em] gap-y-1">
      {words.map(({ word, start }) => (
        <span key={start} className="inline-flex whitespace-nowrap">
          {word.split("").map((char, k) => renderChar(char, start + k))}
        </span>
      ))}
    </span>
  );

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-flex flex-wrap items-center justify-center ${className}`}
      {...props}
    >
      <AnimatePresence mode="wait">
        {animating ? (
          <motion.span key={count} className="contents">
            {content}
          </motion.span>
        ) : (
          content
        )}
      </AnimatePresence>
    </div>
  );
}
