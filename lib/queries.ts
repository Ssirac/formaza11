import "server-only";
import { prisma } from "@/lib/db";
import { DEFAULT_SETTINGS } from "@/lib/constants";
import { asStringArray, type ProductDTO, type CategoryDTO } from "@/lib/types";

/* eslint-disable @typescript-eslint/no-explicit-any */

function toProductDTO(p: any): ProductDTO {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description ?? "",
    images: asStringArray(p.images),
    sizes: asStringArray(p.sizes),
    categoryId: p.categoryId,
    categoryName: p.category?.name ?? "",
    categorySlug: p.category?.slug ?? "",
    isHidden: p.isHidden,
    isFeatured: p.isFeatured,
    stockStatus: p.stockStatus ?? "in_stock",
    clickCount: p._count?.clicks ?? 0,
    createdAt:
      p.createdAt instanceof Date ? p.createdAt.toISOString() : String(p.createdAt),
  };
}

export async function getSettings(): Promise<Record<string, string>> {
  try {
    const rows = await prisma.setting.findMany();
    const map: Record<string, string> = { ...DEFAULT_SETTINGS };
    for (const r of rows) map[r.key] = r.value;
    return map;
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function getWhatsappNumber(): Promise<string> {
  const s = await getSettings();
  return s.whatsappNumber || DEFAULT_SETTINGS.whatsappNumber;
}

export async function getCategories(): Promise<CategoryDTO[]> {
  try {
    const cats = await prisma.category.findMany({
      orderBy: { order: "asc" },
      include: { _count: { select: { products: { where: { isHidden: false } } } } },
    });
    return cats.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      order: c.order,
      productCount: c._count.products,
    }));
  } catch {
    return [];
  }
}

export async function getFeaturedProducts(limit = 8): Promise<ProductDTO[]> {
  try {
    const products = await prisma.product.findMany({
      where: { isHidden: false, isFeatured: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return products.map(toProductDTO);
  } catch {
    return [];
  }
}

export type PagedProducts = {
  products: ProductDTO[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type ProductSort = "yeni" | "ad" | "populyar";

function orderByFor(sort?: ProductSort): any {
  if (sort === "ad") return [{ name: "asc" }];
  if (sort === "populyar")
    return [{ clicks: { _count: "desc" } }, { createdAt: "desc" }];
  return [{ isFeatured: "desc" }, { createdAt: "desc" }];
}

/**
 * One image per product (featured first, then newest) for the hero corridor —
 * so it shows many DIFFERENT jerseys instead of one jersey's many angles.
 */
export async function getHeroImages(limit = 16): Promise<string[]> {
  try {
    const products = await prisma.product.findMany({
      where: { isHidden: false },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: 60,
      select: { images: true },
    });
    const out: string[] = [];
    for (const p of products) {
      const first = asStringArray(p.images)[0];
      if (first) out.push(first);
      if (out.length >= limit) break;
    }
    return out;
  } catch {
    return [];
  }
}

export async function getVisibleProducts(opts?: {
  categorySlug?: string;
  q?: string;
  size?: string;
  sort?: ProductSort;
  inStock?: boolean;
  page?: number;
  pageSize?: number;
}): Promise<PagedProducts> {
  let page = Math.max(1, Math.trunc(opts?.page ?? 1));
  const pageSize = Math.min(60, Math.max(1, Math.trunc(opts?.pageSize ?? 24)));
  try {
    const where: any = { isHidden: false };
    if (opts?.categorySlug) where.category = { slug: opts.categorySlug };
    if (opts?.inStock) where.stockStatus = "in_stock";
    if (opts?.q && opts.q.trim()) {
      const term = opts.q.trim();
      where.OR = [
        { name: { contains: term, mode: "insensitive" } },
        { description: { contains: term, mode: "insensitive" } },
      ];
    }
    if (opts?.size) where.sizes = { array_contains: opts.size };

    // Count first so an out-of-range page (e.g. after changing a filter)
    // clamps to the last page instead of showing an empty result.
    const total = await prisma.product.count({ where });
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    if (page > totalPages) page = totalPages;

    const rows = await prisma.product.findMany({
      where,
      include: { category: true, _count: { select: { clicks: true } } },
      orderBy: orderByFor(opts?.sort),
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      products: rows.map(toProductDTO),
      total,
      page,
      pageSize,
      totalPages,
    };
  } catch {
    return { products: [], total: 0, page, pageSize, totalPages: 1 };
  }
}

export async function getMostViewedProducts(limit = 8): Promise<ProductDTO[]> {
  try {
    const products = await prisma.product.findMany({
      where: { isHidden: false, clicks: { some: {} } },
      include: { category: true, _count: { select: { clicks: true } } },
      orderBy: [{ clicks: { _count: "desc" } }, { createdAt: "desc" }],
      take: limit,
    });
    return products.map(toProductDTO);
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<ProductDTO | null> {
  try {
    const product = await prisma.product.findFirst({
      where: { slug, isHidden: false },
      include: { category: true },
    });
    return product ? toProductDTO(product) : null;
  } catch {
    return null;
  }
}

export async function getSimilarProducts(
  categoryId: string,
  excludeId: string,
  limit = 4
): Promise<ProductDTO[]> {
  try {
    const products = await prisma.product.findMany({
      where: { isHidden: false, categoryId, id: { not: excludeId } },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return products.map(toProductDTO);
  } catch {
    return [];
  }
}

export async function getVisibleSlugs(): Promise<string[]> {
  try {
    const rows = await prisma.product.findMany({
      where: { isHidden: false },
      select: { slug: true },
    });
    return rows.map((r) => r.slug);
  } catch {
    return [];
  }
}
