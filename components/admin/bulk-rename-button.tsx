"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Wand2, LoaderCircle } from "lucide-react";
import { renameAllFromDescriptions } from "@/lib/actions/products";
import { ConfirmDialog } from "./confirm-dialog";
import { buttonClasses } from "@/components/ui/button";

export function BulkRenameButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();

  function run() {
    start(async () => {
      const res = await renameAllFromDescriptions();
      if (res.ok) {
        const n = Number(res.id ?? 0);
        toast.success(
          n > 0 ? `${n} məhsulun adı yeniləndi` : "Yenilənəcək ad tapılmadı"
        );
        setOpen(false);
        router.refresh();
      } else {
        toast.error(res.error ?? "Xəta");
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={buttonClasses("outline", "md")}
      >
        {pending ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <Wand2 className="h-4 w-4" />
        )}
        Adları yenilə
      </button>

      <ConfirmDialog
        open={open}
        title="Bütün adları yenilə"
        message="Hər məhsulun adı təsvirindən yenidən qurulacaq (Komanda + növ + sezon). Slug/URL-lər dəyişmir. Cədvəl formatı olmayan məhsullar toxunulmaz qalır."
        confirmLabel="Yenilə"
        pending={pending}
        onConfirm={run}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
