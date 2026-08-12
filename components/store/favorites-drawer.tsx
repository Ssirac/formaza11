"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, Heart, Trash2, Shirt, ArrowRight } from "lucide-react";
import { useFavorites, useStoreUI } from "./store";
import { buttonClasses } from "@/components/ui/button";

export function FavoritesDrawer() {
  const { items, remove } = useFavorites();
  const { favOpen, closeAll } = useStoreUI();

  return (
    <AnimatePresence>
      {favOpen && (
        <div className="fixed inset-0 z-[70]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAll}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-line bg-ink"
          >
            <header className="flex items-center justify-between border-b border-line px-5 py-4">
              <div className="flex items-center gap-2.5">
                <Heart className="h-5 w-5 text-gold" />
                <h2 className="font-display text-lg font-bold italic text-cream">
                  Favorilər
                </h2>
                {items.length > 0 && (
                  <span className="rounded-full bg-gold/15 px-2 py-0.5 text-xs font-bold text-gold">
                    {items.length}
                  </span>
                )}
              </div>
              <button
                onClick={closeAll}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted hover:text-cream"
                aria-label="Bağla"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-2xl border border-line-strong bg-surface text-faint">
                  <Heart className="h-8 w-8" />
                </span>
                <p className="font-display text-xl font-bold italic text-cream">
                  Hələ favorit yoxdur
                </p>
                <p className="text-sm text-muted">
                  Formaların üzərindəki ürək ikonuna basaraq favoritlərə əlavə et.
                </p>
                <Link
                  href="/kataloq"
                  onClick={closeAll}
                  className={buttonClasses("outline", "md", "mt-2")}
                >
                  Kataloqa bax
                </Link>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <ul className="space-y-3">
                  {items.map((it) => (
                    <li
                      key={it.id}
                      className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3"
                    >
                      <Link
                        href={`/forma/${it.slug}`}
                        onClick={closeAll}
                        className="relative h-16 w-13 shrink-0 overflow-hidden rounded-lg border border-line bg-ink-2"
                        style={{ width: "3.25rem" }}
                      >
                        {it.image ? (
                          <Image
                            src={it.image}
                            alt=""
                            fill
                            sizes="52px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="grid h-full w-full place-items-center">
                            <Shirt className="h-5 w-5 text-line-strong" />
                          </span>
                        )}
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/forma/${it.slug}`}
                          onClick={closeAll}
                          className="block truncate text-sm font-semibold text-cream hover:text-gold"
                        >
                          {it.name}
                        </Link>
                        {it.categoryName && (
                          <span className="text-xs text-muted">
                            {it.categoryName}
                          </span>
                        )}
                        <Link
                          href={`/forma/${it.slug}`}
                          onClick={closeAll}
                          className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-gold hover:underline"
                        >
                          Ölçü seç və sifariş et
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                      <button
                        onClick={() => remove(it.id)}
                        className="text-faint hover:text-red-300"
                        aria-label="Favoritlərdən sil"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
