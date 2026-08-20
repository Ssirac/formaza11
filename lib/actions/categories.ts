"use server";

import { z } from "zod";
import { revalidatePath, updateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { assertAdmin } from "@/lib/session";
import { slugify } from "@/lib/utils";
import { CACHE_TAGS } from "@/lib/queries";

export type ActionResult = { ok: boolean; error?: string; id?: string };

const CategoryInput = z.object({
  name: z.string().trim().min(1, "Ad boş ola bilməz"),
  order: z.number().int().optional(),
});

function revalidateAll() {
  updateTag(CACHE_TAGS.categories);
  updateTag(CACHE_TAGS.products);
  revalidatePath("/");
  revalidatePath("/kataloq");
  revalidatePath("/admin");
  revalidatePath("/admin/kateqoriyalar");
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const root = slugify(base) || "kateqoriya";
  let candidate = root;
  let i = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.category.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing || existing.id === excludeId) return candidate;
    candidate = `${root}-${i++}`;
  }
}

export async function createCategory(input: {
  name: string;
  order?: number;
}): Promise<ActionResult> {
  try {
    await assertAdmin();
    const data = CategoryInput.parse(input);
    const slug = await uniqueSlug(data.name);
    const count = await prisma.category.count();
    const created = await prisma.category.create({
      data: { name: data.name, slug, order: data.order ?? count + 1 },
    });
    revalidateAll();
    return { ok: true, id: created.id };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

/** One-click add of the extra sport categories, skipping any that exist. */
export async function seedSportCategories(): Promise<ActionResult> {
  try {
    await assertAdmin();
    const names = ["Basketbol", "F1", "UFC", "Hokkey", "Reqbi", "Amerikan futbolu"];
    let count = await prisma.category.count();
    let added = 0;
    for (const name of names) {
      const slug = slugify(name) || "kateqoriya";
      const exists = await prisma.category.findUnique({
        where: { slug },
        select: { id: true },
      });
      if (exists) continue;
      await prisma.category.create({ data: { name, slug, order: ++count } });
      added++;
    }
    revalidateAll();
    return { ok: true, id: String(added) };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function updateCategory(
  id: string,
  input: { name: string; order?: number }
): Promise<ActionResult> {
  try {
    await assertAdmin();
    const data = CategoryInput.parse(input);
    const slug = await uniqueSlug(data.name, id);
    await prisma.category.update({
      where: { id },
      data: { name: data.name, slug, ...(data.order != null ? { order: data.order } : {}) },
    });
    revalidateAll();
    return { ok: true, id };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    const count = await prisma.product.count({ where: { categoryId: id } });
    if (count > 0) {
      return {
        ok: false,
        error: `Bu kateqoriyada ${count} məhsul var. Əvvəlcə onları başqa kateqoriyaya keçirin və ya silin.`,
      };
    }
    await prisma.category.delete({ where: { id } });
    revalidateAll();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function moveCategory(
  id: string,
  direction: "up" | "down"
): Promise<ActionResult> {
  try {
    await assertAdmin();
    const cats = await prisma.category.findMany({ orderBy: { order: "asc" } });
    const idx = cats.findIndex((c) => c.id === id);
    if (idx === -1) return { ok: false, error: "Kateqoriya tapılmadı." };
    const swapWith = direction === "up" ? idx - 1 : idx + 1;
    if (swapWith < 0 || swapWith >= cats.length) return { ok: true };
    const a = cats[idx];
    const b = cats[swapWith];
    await prisma.$transaction([
      prisma.category.update({ where: { id: a.id }, data: { order: b.order } }),
      prisma.category.update({ where: { id: b.id }, data: { order: a.order } }),
    ]);
    revalidateAll();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

function errorMessage(e: unknown): string {
  if (e instanceof z.ZodError) return e.issues.map((i) => i.message).join(", ");
  if (e instanceof Error) return e.message;
  return "Naməlum xəta baş verdi.";
}
