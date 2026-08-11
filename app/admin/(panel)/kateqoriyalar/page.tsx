import { getAdminCategories } from "@/lib/admin-data";
import { PageHeader } from "@/components/admin/page-header";
import { CategoryManager } from "@/components/admin/category-manager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();
  return (
    <div>
      <PageHeader
        title="Kateqoriyalar"
        description="Kataloq bölmələrini idarə et və sırala."
      />
      <CategoryManager categories={categories} />
    </div>
  );
}
