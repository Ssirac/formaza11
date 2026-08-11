export type ProductDTO = {
  id: string;
  slug: string;
  name: string;
  description: string;
  images: string[];
  sizes: string[];
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  isHidden: boolean;
  isFeatured: boolean;
  clickCount: number;
  createdAt: string;
};

export type CategoryDTO = {
  id: string;
  name: string;
  slug: string;
  order: number;
  productCount: number;
};

export function asStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string");
  return [];
}
