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

export async function getVisibleProducts(opts?: {
  categorySlug?: string;
  q?: string;
  size?: string;
  page?: number;
  pageSize?: number;
}): Promise<PagedProducts> {
  const page = Math.max(1, Math.trunc(opts?.page ?? 1));
  const pageSize = Math.min(60, Math.max(1, Math.trunc(opts?.pageSize ?? 24)));
  try {
    const where: any = { isHidden: false };
    if (opts?.categorySlug) where.category = { slug: opts.categorySlug };
    if (opts?.q && opts.q.trim()) {
      const term = opts.q.trim();
      where.OR = [
        { name: { contains: term, mode: "insensitive" } },
        { description: { contains: term, mode: "insensitive" } },
      ];
    }
    if (opts?.size) where.sizes = { array_contains: opts.size };

    const [rows, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products: rows.map(toProductDTO),
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  } catch {
    return { products: [], total: 0, page, pageSize, totalPages: 1 };
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
