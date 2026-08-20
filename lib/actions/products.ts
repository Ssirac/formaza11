"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { assertAdmin } from "@/lib/session";
import { slugify } from "@/lib/utils";
import { uploadImage, isCloudinaryConfigured } from "@/lib/cloudinary";
import { deriveNameFromDescription } from "@/lib/jersey-description";

const price = z.number().nonnegative().nullable().optional();

const ProductInput = z.object({
  name: z.string().trim().min(1, "Ad boş ola bilməz"),
  slug: z.string().trim().optional().default(""),
  categoryId: z.string().trim().min(1, "Kateqoriya seçin"),
  description: z.string().trim().optional().default(""),
  sizes: z.array(z.string()).default([]),
  images: z.array(z.string().url()).default([]),
  isFeatured: z.boolean().default(false),
  isHidden: z.boolean().default(false),
  stockStatus: z.enum(["in_stock", "on_way", "pre_order"]).default("in_stock"),
  // Admin-only pricing (never shown on the public site).
  costPrice: price,
  shippingCost: price,
  salePrice: price,
});

export type ProductInputData = z.infer<typeof ProductInput>;
export type ActionResult = { ok: boolean; error?: string; id?: string };

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const root = slugify(base) || "forma";
  let candidate = root;
  let i = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.product.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing || existing.id === excludeId) return candidate;
    candidate = `${root}-${i++}`;
  }
}

function revalidateAll(slug?: string) {
  revalidatePath("/");
  revalidatePath("/kataloq");
  revalidatePath("/admin");
  revalidatePath("/admin/mehsullar");
  if (slug) revalidatePath(`/forma/${slug}`);
}

export async function createProduct(
  input: ProductInputData
): Promise<ActionResult> {
  try {
    await assertAdmin();
    const data = ProductInput.parse(input);
    const slug = await uniqueSlug(data.slug || data.name);
    const created = await prisma.product.create({
      data: {
        slug,
        name: data.name,
        description: data.description,
        images: data.images,
        sizes: data.sizes,
        categoryId: data.categoryId,
        isFeatured: data.isFeatured,
        isHidden: data.isHidden,
        stockStatus: data.stockStatus,
        costPrice: data.costPrice ?? null,
        shippingCost: data.shippingCost ?? null,
        salePrice: data.salePrice ?? null,
      },
    });
    revalidateAll(slug);
    return { ok: true, id: created.id };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function updateProduct(
  id: string,
  input: ProductInputData
): Promise<ActionResult> {
  try {
    await assertAdmin();
    const data = ProductInput.parse(input);
    const slug = await uniqueSlug(data.slug || data.name, id);
    await prisma.product.update({
      where: { id },
      data: {
        slug,
        name: data.name,
        description: data.description,
        images: data.images,
        sizes: data.sizes,
        categoryId: data.categoryId,
        isFeatured: data.isFeatured,
        isHidden: data.isHidden,
        stockStatus: data.stockStatus,
        costPrice: data.costPrice ?? null,
        shippingCost: data.shippingCost ?? null,
        salePrice: data.salePrice ?? null,
      },
    });
    revalidateAll(slug);
    return { ok: true, id };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

/**
 * Rebuild every product's name from its formatted description. Slugs (and thus
 * URLs) are left untouched. Products without a spec-sheet description are skipped.
 */
export async function renameAllFromDescriptions(): Promise<ActionResult> {
  try {
    await assertAdmin();
    const products = await prisma.product.findMany({
      select: { id: true, name: true, description: true },
    });
    let updated = 0;
    for (const p of products) {
      const next = deriveNameFromDescription(p.description ?? "");
      if (next && next !== p.name) {
        await prisma.product.update({
          where: { id: p.id },
          data: { name: next },
        });
        updated++;
      }
    }
    revalidateAll();
    return { ok: true, id: String(updated) };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    await prisma.product.delete({ where: { id } });
    revalidateAll();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function setProductHidden(
  id: string,
  isHidden: boolean
): Promise<ActionResult> {
  try {
    await assertAdmin();
    const p = await prisma.product.update({
      where: { id },
      data: { isHidden },
      select: { slug: true },
    });
    revalidateAll(p.slug);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function setProductFeatured(
  id: string,
  isFeatured: boolean
): Promise<ActionResult> {
  try {
    await assertAdmin();
    const p = await prisma.product.update({
      where: { id },
      data: { isFeatured },
      select: { slug: true },
    });
    revalidateAll(p.slug);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function setProductStock(
  id: string,
  stockStatus: "in_stock" | "on_way" | "pre_order"
): Promise<ActionResult> {
  try {
    await assertAdmin();
    const p = await prisma.product.update({
      where: { id },
      data: { stockStatus },
      select: { slug: true },
    });
    revalidateAll(p.slug);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function setProductQuantity(
  id: string,
  quantity: number | null
): Promise<ActionResult> {
  try {
    await assertAdmin();
    const q =
      quantity == null || !Number.isFinite(quantity)
        ? null
        : Math.max(0, Math.trunc(quantity));
    const p = await prisma.product.update({
      where: { id },
      data: { quantity: q },
      select: { slug: true },
    });
    revalidateAll(p.slug);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function setProductStockAlert(
  id: string,
  stockAlert: boolean
): Promise<ActionResult> {
  try {
    await assertAdmin();
    const p = await prisma.product.update({
      where: { id },
      data: { stockAlert },
      select: { slug: true },
    });
    revalidateAll(p.slug);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

/** Upload a base64 data URI via Cloudinary; returns the hosted URL. */
export async function uploadProductImage(
  dataUri: string
): Promise<{ ok: boolean; url?: string; error?: string }> {
  try {
    await assertAdmin();
    if (!isCloudinaryConfigured()) {
      return {
        ok: false,
        error:
          "Cloudinary açarları təyin edilməyib. Şəkil URL-i yapışdırın və ya .env-ə açarları əlavə edin.",
      };
    }
    const url = await uploadImage(dataUri);
    return { ok: true, url };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

function errorMessage(e: unknown): string {
  if (e instanceof z.ZodError) {
    return e.issues.map((i) => i.message).join(", ");
  }
  if (e instanceof Error) return e.message;
  return "Naməlum xəta baş verdi.";
}
