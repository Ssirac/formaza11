import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchX } from "lucide-react";
import {
  getCategories,
  getVisibleProducts,
  getSettings,
} from "@/lib/queries";
import { FilterChips } from "@/components/catalog/filter-chips";
import { SizeFilter } from "@/components/catalog/size-filter";
import { CatalogSearch } from "@/components/catalog/catalog-search";
import { CatalogControls } from "@/components/catalog/catalog-controls";
import { CatalogSkeleton } from "@/components/catalog/catalog-skeleton";
import { Pagination } from "@/components/catalog/pagination";
import { ProductGrid } from "@/components/product/product-grid";
import type { ProductSort } from "@/lib/queries";

export const revalidate = 60; // ISR: keşlənir, admin dəyişəndə revalidatePath dərhal təzələyir

export const metadata: Metadata = {
  title: "Kataloq",
  description:
    "Bütün futbol formaları — klub, milli komanda, retro və uşaq dəstləri. Kateqoriyaya görə seç, WhatsApp ilə sifariş et.",
};

type SP = Record<string, string | string[] | undefined>;

async function Results({
  categorySlug,
  q,
  size,
  sort,
  inStock,
  page,
  whatsappNumber,
}: {
  categorySlug?: string;
  q?: string;
  size?: string;
  sort?: ProductSort;
  inStock?: boolean;
  page: number;
  whatsappNumber: string;
}) {
  const { products, total, page: current, totalPages } = await getVisibleProducts({
    categorySlug,
    q,
    size,
    sort,
    inStock,
    page,
  });

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line-strong bg-surface/50 px-6 py-20 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl border border-line-strong bg-ink-2 text-faint">
          <SearchX className="h-7 w-7" />
        </span>
        <h3 className="mt-5 font-display text-2xl font-bold italic text-cream">
          {q ? `"${q}" üzrə nəticə yoxdur` : "Bu bölmə hələ boşdur"}
        </h3>
        <p className="mt-2 max-w-md text-sm text-muted">
          {q
            ? "Başqa açar söz yoxla və ya filtri dəyiş."
            : "Bu kateqoriyaya tezliklə yeni formalar əlavə olunacaq."}
        </p>
      </div>
    );
  }

  return (
    <>
      <p className="mb-6 text-sm text-muted">
        {total} forma tapıldı
        {totalPages > 1 ? ` · səhifə ${current}/${totalPages}` : ""}
      </p>
      <ProductGrid products={products} whatsappNumber={whatsappNumber} />
      <Pagination
        page={current}
        totalPages={totalPages}
        params={{
          kateqoriya: categorySlug,
          axtar: q,
          olcu: size,
          sirala: sort && sort !== "yeni" ? sort : undefined,
          stok: inStock ? "eldedir" : undefined,
        }}
      />
    </>
  );
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const categorySlug =
    typeof sp.kateqoriya === "string" ? sp.kateqoriya : undefined;
  const q = typeof sp.axtar === "string" ? sp.axtar : undefined;
  const size = typeof sp.olcu === "string" ? sp.olcu : undefined;
  const sortRaw = typeof sp.sirala === "string" ? sp.sirala : undefined;
  const sort: ProductSort =
    sortRaw === "ad" || sortRaw === "populyar" ? sortRaw : "yeni";
  const inStock = sp.stok === "eldedir";
  const page = Math.max(
    1,
    Math.trunc(Number(typeof sp.sehife === "string" ? sp.sehife : 1)) || 1
  );

  const [categories, settings] = await Promise.all([
    getCategories(),
    getSettings(),
  ]);

  const key = `${categorySlug ?? ""}|${q ?? ""}|${size ?? ""}|${sort}|${
    inStock ? "1" : "0"
  }|${page}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <header>
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-gold">
          <span className="h-px w-6 bg-gold" />
          Kataloq
        </span>
        <h1 className="mt-4 font-display text-4xl font-extrabold italic text-cream sm:text-5xl">
          Bütün <span className="text-metal-gold">formalar</span>
        </h1>
      </header>

      <div className="mt-8 space-y-4 border-b border-line pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <FilterChips categories={categories} active={categorySlug} q={q} />
          <CatalogSearch />
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SizeFilter />
          <CatalogControls />
        </div>
      </div>

      <div className="mt-10">
        <Suspense key={key} fallback={<CatalogSkeleton />}>
          <Results
            categorySlug={categorySlug}
            q={q}
            size={size}
            sort={sort}
            inStock={inStock}
            page={page}
            whatsappNumber={settings.whatsappNumber}
          />
        </Suspense>
      </div>
    </div>
  );
}
