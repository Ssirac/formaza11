import { notFound } from "next/navigation";
import { getProductForEdit, getAdminCategories } from "@/lib/admin-data";
import { ProductForm } from "@/components/admin/product-form";
import { PageHeader } from "@/components/admin/page-header";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductForEdit(id),
    getAdminCategories(),
  ]);
  if (!product) notFound();

  return (
    <div>
      <PageHeader title="Məhsulu redaktə et" description={product.name} />
      <ProductForm
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        initial={product}
      />
    </div>
  );
}
