import { getAdminCategories } from "@/lib/admin-data";
import { ProductForm } from "@/components/admin/product-form";
import { PageHeader } from "@/components/admin/page-header";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await getAdminCategories();
  return (
    <div>
      <PageHeader
        title="Yeni məhsul"
        description="Kataloqa yeni forma əlavə et."
      />
      <ProductForm
        categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
      />
    </div>
  );
}
