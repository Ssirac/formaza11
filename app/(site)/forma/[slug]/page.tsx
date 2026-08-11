import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import {
  getProductBySlug,
  getSimilarProducts,
  getSettings,
} from "@/lib/queries";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductPurchase } from "@/components/product/product-purchase";
import { ProductGrid } from "@/components/product/product-grid";
import { SectionHeading } from "@/components/home/section-heading";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Forma tapılmadı" };
  return {
    title: product.name,
    description:
      product.description || `${product.name} — ${product.categoryName} forması.`,
    openGraph: {
      title: product.name,
      description: product.description || product.categoryName,
      images: product.images.slice(0, 1),
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [settings, similar] = await Promise.all([
    getSettings(),
    getSimilarProducts(product.categoryId, product.id, 4),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-8 sm:px-6 lg:px-8 lg:pb-16">
      {/* Breadcrumb */}
      <nav
        aria-label="breadcrumb"
        className="flex items-center gap-1.5 text-sm text-faint"
      >
        <Link href="/" className="hover:text-cream">
          Ana səhifə
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href={`/kataloq?kateqoriya=${product.categorySlug}`}
          className="hover:text-cream"
        >
          {product.categoryName}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="truncate text-muted">{product.name}</span>
      </nav>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
        <ProductGallery images={product.images} alt={product.name} />

        <div className="lg:py-4">
          <span className="inline-flex items-center rounded-full border border-line-strong bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-wide text-silver">
            {product.categoryName}
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold italic leading-tight text-cream sm:text-4xl">
            {product.name}
          </h1>

          {product.description && (
            <p className="mt-4 text-base leading-relaxed text-muted">
              {product.description}
            </p>
          )}

          <div className="mt-8 border-t border-line pt-8">
            <ProductPurchase
              productId={product.id}
              productName={product.name}
              sizes={product.sizes}
              whatsappNumber={settings.whatsappNumber}
            />
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-24">
          <SectionHeading kicker="Oxşar formalar" title="Bunlar da xoşuna gələ bilər" />
          <div className="mt-10">
            <ProductGrid
              products={similar}
              whatsappNumber={settings.whatsappNumber}
            />
          </div>
        </section>
      )}
    </div>
  );
}
