import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, SearchX } from "lucide-react";
import { CLUB_CRESTS, NATION_CRESTS, type Crest } from "@/lib/club-logos";
import { getVisibleProducts, getSettings } from "@/lib/queries";
import { ProductGrid } from "@/components/product/product-grid";
import { Pagination } from "@/components/catalog/pagination";
import { buttonClasses } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const ALL: Crest[] = [...CLUB_CRESTS, ...NATION_CRESTS];
const findCrest = (slug: string) => ALL.find((c) => c.slug === slug);

type Params = Promise<{ slug: string }>;
type SP = Record<string, string | string[] | undefined>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const crest = findCrest(slug);
  if (!crest) return { title: "Komanda tapılmadı" };
  return {
    title: `${crest.name} formaları`,
    description: `${crest.name} klub və milli komanda formaları — FORMAZA11-də seç, WhatsApp ilə sifariş et.`,
  };
}

export default async function TeamPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<SP>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const crest = findCrest(slug);
  if (!crest) notFound();

  const page = Math.max(
    1,
    Math.trunc(Number(typeof sp.sehife === "string" ? sp.sehife : 1)) || 1
  );

  const [{ products, total, page: current, totalPages }, settings] =
    await Promise.all([
      getVisibleProducts({ q: crest.name, page }),
      getSettings(),
    ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <nav
        aria-label="breadcrumb"
        className="flex items-center gap-1.5 text-sm text-faint"
      >
        <Link href="/" className="hover:text-cream">
          Ana səhifə
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/kataloq" className="hover:text-cream">
          Kataloq
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="truncate text-muted">{crest.name}</span>
      </nav>

      <header className="mt-8 flex items-center gap-5">
        <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl border border-line bg-surface p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={crest.src}
            alt={crest.name}
            className="h-full w-full object-contain"
          />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
            Komanda
          </span>
          <h1 className="mt-1 font-display text-3xl font-extrabold italic text-cream sm:text-4xl">
            {crest.name}
          </h1>
          <p className="mt-1 text-sm text-muted">{total} forma tapıldı</p>
        </div>
      </header>

      <div className="mt-10">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line-strong bg-surface/50 px-6 py-20 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl border border-line-strong bg-ink-2 text-faint">
              <SearchX className="h-7 w-7" />
            </span>
            <h2 className="mt-5 font-display text-2xl font-bold italic text-cream">
              {crest.name} üzrə forma tapılmadı
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted">
              Bu komandanın forması tezliklə əlavə oluna bilər. Bütün formalara
              baxın və ya WhatsApp-da soruşun.
            </p>
            <Link
              href="/kataloq"
              className={buttonClasses("outline", "md", "mt-6")}
            >
              Kataloqa bax
            </Link>
          </div>
        ) : (
          <>
            <ProductGrid
              products={products}
              whatsappNumber={settings.whatsappNumber}
            />
            <Pagination
              page={current}
              totalPages={totalPages}
              params={{}}
              basePath={`/komanda/${crest.slug}`}
            />
          </>
        )}
      </div>
    </div>
  );
}
