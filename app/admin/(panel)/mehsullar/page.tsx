import Link from "next/link";
import { Plus } from "lucide-react";
import { getAdminProducts, getAdminCategories } from "@/lib/admin-data";
import { PageHeader } from "@/components/admin/page-header";
import { ProductFilters } from "@/components/admin/product-filters";
import { ProductTable } from "@/components/admin/product-table";
import { BulkRenameButton } from "@/components/admin/bulk-rename-button";
import { buttonClasses } from "@/components/ui/button";

export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const q = typeof sp.axtar === "string" ? sp.axtar : undefined;
  const categoryId = typeof sp.kateqoriya === "string" ? sp.kateqoriya : undefined;
  const hidden =
    sp.gizli === "hidden" ? "hidden" : sp.gizli === "visible" ? "visible" : "all";

  const [products, categories] = await Promise.all([
    getAdminProducts({ q, categoryId, hidden }),
    getAdminCategories(),
  ]);

  return (
    <div>
      <PageHeader
        title="Məhsullar"
        description={`${products.length} məhsul göstərilir.`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <BulkRenameButton />
            <Link
              href="/admin/mehsullar/yeni"
              className={buttonClasses("gold", "md")}
            >
              <Plus className="h-4 w-4" />
              Yeni məhsul
            </Link>
          </div>
        }
      />
      <ProductFilters categories={categories} />
      <ProductTable products={products} />
    </div>
  );
}
