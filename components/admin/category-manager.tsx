"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  ArrowUp,
  ArrowDown,
  Pencil,
  Trash2,
  Check,
  X,
  LoaderCircle,
} from "lucide-react";
import type { AdminCategory } from "@/lib/admin-data";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  moveCategory,
  seedSportCategories,
} from "@/lib/actions/categories";
import { ConfirmDialog } from "./confirm-dialog";
import { inputClass } from "@/components/ui/field";
import { buttonClasses } from "@/components/ui/button";

export function CategoryManager({
  categories,
}: {
  categories: AdminCategory[];
}) {
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [adding, startAdd] = useTransition();
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [target, setTarget] = useState<AdminCategory | null>(null);
  const [deleting, startDelete] = useTransition();
  const [seeding, startSeed] = useTransition();

  function seedSports() {
    startSeed(async () => {
      const res = await seedSportCategories();
      if (res.ok) {
        const n = Number(res.id ?? 0);
        toast.success(
          n > 0 ? `${n} idman kateqoriyası əlavə olundu` : "Hamısı artıq mövcuddur"
        );
        router.refresh();
      } else {
        toast.error(res.error ?? "Xəta");
      }
    });
  }

  function add() {
    if (!newName.trim()) return;
    startAdd(async () => {
      const res = await createCategory({ name: newName.trim() });
      if (res.ok) {
        toast.success("Kateqoriya əlavə olundu");
        setNewName("");
        router.refresh();
      } else {
        toast.error(res.error ?? "Xəta");
      }
    });
  }

  async function saveEdit(id: string) {
    if (!editName.trim()) return;
    setSavingId(id);
    const res = await updateCategory(id, { name: editName.trim() });
    setSavingId(null);
    if (res.ok) {
      toast.success("Yeniləndi");
      setEditId(null);
      router.refresh();
    } else {
      toast.error(res.error ?? "Xəta");
    }
  }

  async function move(id: string, dir: "up" | "down") {
    const res = await moveCategory(id, dir);
    if (res.ok) router.refresh();
    else toast.error(res.error ?? "Xəta");
  }

  function confirmDelete() {
    if (!target) return;
    const c = target;
    startDelete(async () => {
      const res = await deleteCategory(c.id);
      if (res.ok) {
        toast.success(`"${c.name}" silindi`);
        setTarget(null);
        router.refresh();
      } else {
        toast.error(res.error ?? "Silinmədi");
        setTarget(null);
      }
    });
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Add */}
      <div className="flex gap-2 rounded-2xl border border-line bg-surface p-4">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Yeni kateqoriya adı…"
          className={inputClass}
        />
        <button
          type="button"
          onClick={add}
          disabled={adding || !newName.trim()}
          className={buttonClasses("gold", "md")}
        >
          {adding ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Əlavə et
        </button>
      </div>

      {/* Quick add: other sports */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-surface/60 px-4 py-3">
        <p className="text-sm text-muted">
          Digər idman növləri (Basketbol, F1, UFC, Hokkey, Reqbi, Amerikan
          futbolu):
        </p>
        <button
          type="button"
          onClick={seedSports}
          disabled={seeding}
          className={buttonClasses("outline", "sm")}
        >
          {seeding ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          İdman kateqoriyalarını əlavə et
        </button>
      </div>

      {/* List */}
      {categories.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line-strong bg-surface/50 px-4 py-10 text-center text-sm text-muted">
          Hələ kateqoriya yoxdur.
        </p>
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
          {categories.map((c, i) => (
            <li key={c.id} className="flex items-center gap-3 px-4 py-3">
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => move(c.id, "up")}
                  disabled={i === 0}
                  className="text-faint hover:text-cream disabled:opacity-30"
                  aria-label="Yuxarı"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(c.id, "down")}
                  disabled={i === categories.length - 1}
                  className="text-faint hover:text-cream disabled:opacity-30"
                  aria-label="Aşağı"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>

              <div className="min-w-0 flex-1">
                {editId === c.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit(c.id)}
                      autoFocus
                      className={`${inputClass} h-9`}
                    />
                    <button
                      type="button"
                      onClick={() => saveEdit(c.id)}
                      disabled={savingId === c.id}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gold/40 text-gold"
                      aria-label="Yadda saxla"
                    >
                      {savingId === c.id ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditId(null)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line-strong text-muted"
                      aria-label="Ləğv et"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="truncate font-medium text-cream">{c.name}</p>
                    <p className="truncate text-xs text-faint">
                      /{c.slug} · {c.productCount} məhsul
                    </p>
                  </>
                )}
              </div>

              {editId !== c.id && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditId(c.id);
                      setEditName(c.name);
                    }}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line-strong text-muted transition-colors hover:border-gold hover:text-gold"
                    aria-label="Redaktə et"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setTarget(c)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line-strong text-muted transition-colors hover:border-red-500/60 hover:text-red-300"
                    aria-label="Sil"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={!!target}
        title="Kateqoriyanı sil"
        message={`"${target?.name}" silinəcək. İçində məhsul varsa əvvəlcə onları köçür.`}
        pending={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setTarget(null)}
      />
    </div>
  );
}
