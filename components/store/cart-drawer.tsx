"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, Shirt } from "lucide-react";
import { useCart, useStoreUI, buildCartWhatsAppUrl } from "./store";
import { WhatsAppIcon } from "@/components/ui/icons";
import { buttonClasses } from "@/components/ui/button";

export function CartDrawer({ whatsappNumber }: { whatsappNumber: string }) {
  const { items, count, setQty, remove, clear } = useCart();
  const { cartOpen, closeAll } = useStoreUI();

  function checkout() {
    if (items.length === 0) return;
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://formaza11.vercel.app";
    window.open(
      buildCartWhatsAppUrl(whatsappNumber, items, origin),
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <AnimatePresence>
      {cartOpen && (
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
                <ShoppingBag className="h-5 w-5 text-gold" />
                <h2 className="font-display text-lg font-bold italic text-cream">
                  Səbət
                </h2>
                {count > 0 && (
                  <span className="rounded-full bg-gold/15 px-2 py-0.5 text-xs font-bold text-gold">
                    {count}
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
                  <ShoppingBag className="h-8 w-8" />
                </span>
                <p className="font-display text-xl font-bold italic text-cream">
                  Səbət boşdur
                </p>
                <p className="text-sm text-muted">
                  Bəyəndiyin formaları ölçü seçib səbətə at.
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
              <>
                <div className="flex-1 overflow-y-auto px-4 py-4">
                  <ul className="space-y-3">
                    {items.map((it) => (
                      <li
                        key={`${it.id}-${it.size}`}
                        className="flex gap-3 rounded-xl border border-line bg-surface p-3"
                      >
                        <Link
                          href={`/forma/${it.slug}`}
                          onClick={closeAll}
                          className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg border border-line bg-ink-2"
                        >
                          {it.image ? (
                            <Image
                              src={it.image}
                              alt=""
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="grid h-full w-full place-items-center">
                              <Shirt className="h-5 w-5 text-line-strong" />
                            </span>
                          )}
                        </Link>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <Link
                            href={`/forma/${it.slug}`}
                            onClick={closeAll}
                            className="truncate text-sm font-semibold text-cream hover:text-gold"
                          >
                            {it.name}
                          </Link>
                          <span className="mt-0.5 text-xs text-muted">
                            Ölçü: <span className="text-gold">{it.size}</span>
                          </span>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex items-center gap-1 rounded-lg border border-line-strong">
                              <button
                                onClick={() => setQty(it.id, it.size, it.qty - 1)}
                                className="grid h-7 w-7 place-items-center text-muted hover:text-cream"
                                aria-label="Azalt"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="min-w-6 text-center text-sm font-semibold text-cream">
                                {it.qty}
                              </span>
                              <button
                                onClick={() => setQty(it.id, it.size, it.qty + 1)}
                                className="grid h-7 w-7 place-items-center text-muted hover:text-cream"
                                aria-label="Artır"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <button
                              onClick={() => remove(it.id, it.size)}
                              className="text-faint hover:text-red-300"
                              aria-label="Sil"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={clear}
                    className="mt-4 text-xs text-faint hover:text-red-300"
                  >
                    Səbəti təmizlə
                  </button>
                </div>

                <footer className="border-t border-line px-4 py-4">
                  <button
                    onClick={checkout}
                    className={buttonClasses("gold", "lg", "w-full")}
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                    WhatsApp-da sifariş et ({count})
                  </button>
                  <p className="mt-2 text-center text-xs text-faint">
                    Bütün məhsullar linki, ölçüsü və sayı ilə WhatsApp-a göndərilir.
                  </p>
                </footer>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
