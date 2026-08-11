"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, LoaderCircle } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Sil",
  pending,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-sm rounded-2xl border border-line bg-surface p-6"
          >
            <span className="grid h-12 w-12 place-items-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-300">
              <AlertTriangle className="h-6 w-6" />
            </span>
            <h3 className="mt-4 font-display text-xl font-bold italic text-cream">
              {title}
            </h3>
            <p className="mt-2 text-sm text-muted">{message}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={pending}
                className={buttonClasses("ghost", "md")}
              >
                Ləğv et
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={pending}
                className={buttonClasses("danger", "md")}
              >
                {pending && <LoaderCircle className="h-4 w-4 animate-spin" />}
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
