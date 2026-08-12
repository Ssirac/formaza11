"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoaderCircle, Star, EyeOff } from "lucide-react";
import type { ProductDTO } from "@/lib/types";
import { SIZE_GROUPS, STOCK_STATUSES } from "@/lib/constants";
import { createProduct, updateProduct } from "@/lib/actions/products";
import { slugify } from "@/lib/utils";
import { ImageManager } from "./image-manager";
import { Switch } from "./switch";
import { Field, inputClass, textareaClass, selectClass } from "@/components/ui/field";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Category = { id: string; name: string };

export function ProductForm({
  categories,
  initial,
}: {
  categories: Category[];
  initial?: ProductDTO;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [categoryId, setCategoryId] = useState(
    initial?.categoryId ?? categories[0]?.id ?? ""
  );
  const [description, setDescription] = useState(initial?.description ?? "");
  const [sizes, setSizes] = useState<string[]>(initial?.sizes ?? []);
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [isFeatured, setIsFeatured] = useState(initial?.isFeatured ?? false);
  const [isHidden, setIsHidden] = useState(initial?.isHidden ?? false);
  const [stockStatus, setStockStatus] = useState<string>(
    initial?.stockStatus ?? "in_stock"
  );

  const finalSlug = (slugTouched ? slug : slugify(name)) || "forma";

  function toggleSize(s: string) {
    setSizes((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  function submit() {
    if (!name.trim()) {
      toast.error("Məhsulun adını daxil et");
      return;
    }
    if (!categoryId) {
      toast.error("Kateqoriya seç");
      return;
    }
    const data = {
      name: name.trim(),
      slug: slugTouched ? slug.trim() : "",
      categoryId,
      description: description.trim(),
      sizes,
      images,
      isFeatured,
      isHidden,
      stockStatus: stockStatus as "in_stock" | "on_way",
    };
    startTransition(async () => {
      const res = initial
        ? await updateProduct(initial.id, data)
        : await createProduct(data);
      if (res.ok) {
        toast.success(initial ? "Məhsul yeniləndi" : "Məhsul əlavə olundu");
        router.push("/admin/mehsullar");
        router.refresh();
      } else {
        toast.error(res.error ?? "Xəta baş verdi");
      }
    });
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-sm text-amber-200">
        Əvvəlcə ən azı bir kateqoriya yarat.{" "}
        <Link href="/admin/kateqoriyalar" className="font-semibold underline">
          Kateqoriyalara keç
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {/* Main */}
      <div className="space-y-6">
        <div className="space-y-5 rounded-2xl border border-line bg-surface p-6">
          <Field label="Ad" htmlFor="name">
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Məs: Real Madrid Ev 24/25"
              className={inputClass}
            />
          </Field>

          <Field
            label="Slug (URL)"
            htmlFor="slug"
            hint={`Sayt ünvanı: /forma/${finalSlug}`}
          >
            <input
              id="slug"
              value={slugTouched ? slug : slugify(name)}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              placeholder="avtomatik yaranır"
              className={inputClass}
            />
          </Field>

          <Field label="Kateqoriya" htmlFor="category">
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={selectClass}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Təsvir" htmlFor="description" hint="İstəyə bağlı.">
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Forma haqqında qısa məlumat…"
              className={textareaClass}
            />
          </Field>
        </div>

        <div className="space-y-4 rounded-2xl border border-line bg-surface p-6">
          <h3 className="font-display text-lg font-bold italic text-cream">
            Ölçülər
          </h3>
          {SIZE_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-silver-deep">
                {group.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {group.sizes.map((s) => {
                  const active = sizes.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSize(s)}
                      className={cn(
                        "h-10 min-w-11 rounded-lg border px-3 text-sm font-semibold transition-all",
                        active
                          ? "border-gold bg-gold/15 text-gold"
                          : "border-line-strong text-muted hover:border-gold/50 hover:text-cream"
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4 rounded-2xl border border-line bg-surface p-6">
          <h3 className="font-display text-lg font-bold italic text-cream">
            Şəkillər
          </h3>
          <ImageManager value={images} onChange={setImages} />
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <div className="rounded-2xl border border-line bg-surface p-6">
          <p className="text-sm font-semibold text-cream">Mövcudluq</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {STOCK_STATUSES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setStockStatus(s.value)}
                className={cn(
                  "h-10 rounded-lg border text-sm font-semibold transition-all",
                  stockStatus === s.value
                    ? "border-gold bg-gold/15 text-gold"
                    : "border-line-strong text-muted hover:border-gold/50 hover:text-cream"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-line bg-surface p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Star className="h-4 w-4 text-gold" />
              <div>
                <p className="text-sm font-semibold text-cream">Seçilmiş</p>
                <p className="text-xs text-faint">Ana səhifədə göstər</p>
              </div>
            </div>
            <Switch checked={isFeatured} onChange={setIsFeatured} />
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-line pt-4">
            <div className="flex items-center gap-2.5">
              <EyeOff className="h-4 w-4 text-silver" />
              <div>
                <p className="text-sm font-semibold text-cream">Gizli</p>
                <p className="text-xs text-faint">Saytdan gizlət</p>
              </div>
            </div>
            <Switch checked={isHidden} onChange={setIsHidden} />
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-6">
          <button
            type="button"
            onClick={submit}
            disabled={pending}
            className={buttonClasses("gold", "md", "w-full")}
          >
            {pending && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {initial ? "Dəyişiklikləri yadda saxla" : "Məhsulu əlavə et"}
          </button>
          <Link
            href="/admin/mehsullar"
            className={buttonClasses("ghost", "md", "w-full")}
          >
            Ləğv et
          </Link>
        </div>
      </div>
    </div>
  );
}
