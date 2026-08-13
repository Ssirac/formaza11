import "server-only";
import { prisma } from "@/lib/db";
import { asStringArray, type ProductDTO } from "@/lib/types";

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

export type AdminStats = {
  active: number;
  hidden: number;
  categories: number;
  clicks7d: number;
  connected: boolean;
};

export async function getAdminStats(): Promise<AdminStats> {
  try {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [active, hidden, categories, clicks7d] = await Promise.all([
      prisma.product.count({ where: { isHidden: false } }),
      prisma.product.count({ where: { isHidden: true } }),
      prisma.category.count(),
      prisma.clickEvent.count({ where: { createdAt: { gte: since } } }),
    ]);
    return { active, hidden, categories, clicks7d, connected: true };
  } catch {
    return { active: 0, hidden: 0, categories: 0, clicks7d: 0, connected: false };
  }
}

export type TopProduct = {
  id: string;
  name: string;
  slug: string;
  categoryName: string;
  clicks: number;
};

export async function getTopProducts(limit = 6): Promise<TopProduct[]> {
  try {
    const grouped = await prisma.clickEvent.groupBy({
      by: ["productId"],
      _count: { productId: true },
      orderBy: { _count: { productId: "desc" } },
      take: limit,
    });
    if (grouped.length === 0) return [];
    const products = await prisma.product.findMany({
      where: { id: { in: grouped.map((g) => g.productId) } },
      include: { category: true },
    });
    const map = new Map(products.map((p) => [p.id, p]));
    return grouped
      .map((g) => {
        const p = map.get(g.productId);
        if (!p) return null;
        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          categoryName: p.category?.name ?? "",
          clicks: g._count.productId,
        };
      })
      .filter(Boolean) as TopProduct[];
  } catch {
    return [];
  }
}

export type RecentClick = {
  id: string;
  productName: string;
  slug: string;
  size: string;
  createdAt: string;
};

export async function getRecentClicks(limit = 8): Promise<RecentClick[]> {
  try {
    const clicks = await prisma.clickEvent.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { product: { select: { name: true, slug: true } } },
    });
    return clicks.map((c) => ({
      id: c.id,
      productName: c.product?.name ?? "—",
      slug: c.product?.slug ?? "",
      size: c.size,
      createdAt: c.createdAt.toISOString(),
    }));
  } catch {
    return [];
  }
}

export type AdminProductListItem = ProductDTO & { pricing: ProductPricing };

export async function getAdminProducts(opts?: {
  q?: string;
  categoryId?: string;
  hidden?: "all" | "visible" | "hidden";
}): Promise<AdminProductListItem[]> {
  try {
    const where: any = {};
    if (opts?.q?.trim())
      where.name = { contains: opts.q.trim(), mode: "insensitive" };
    if (opts?.categoryId) where.categoryId = opts.categoryId;
    if (opts?.hidden === "visible") where.isHidden = false;
    if (opts?.hidden === "hidden") where.isHidden = true;

    const products = await prisma.product.findMany({
      where,
      include: { category: true, _count: { select: { clicks: true } } },
      orderBy: [{ createdAt: "desc" }],
    });
    return products.map((p) => ({
      ...toProductDTO(p),
      pricing: {
        costPrice: (p as any).costPrice ?? null,
        shippingCost: (p as any).shippingCost ?? null,
        salePrice: (p as any).salePrice ?? null,
      },
    }));
  } catch {
    return [];
  }
}

export type ProductPricing = {
  costPrice: number | null;
  shippingCost: number | null;
  salePrice: number | null;
};

export type AdminProductForEdit = ProductDTO & { pricing: ProductPricing };

export async function getProductForEdit(
  id: string
): Promise<AdminProductForEdit | null> {
  try {
    const p = await prisma.product.findUnique({
      where: { id },
      include: { category: true, _count: { select: { clicks: true } } },
    });
    if (!p) return null;
    return {
      ...toProductDTO(p),
      pricing: {
        costPrice: (p as any).costPrice ?? null,
        shippingCost: (p as any).shippingCost ?? null,
        salePrice: (p as any).salePrice ?? null,
      },
    };
  } catch {
    return null;
  }
}

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  order: number;
  productCount: number;
};

export async function getAdminCategories(): Promise<AdminCategory[]> {
  try {
    const cats = await prisma.category.findMany({
      orderBy: { order: "asc" },
      include: { _count: { select: { products: true } } },
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
