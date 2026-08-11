import { getSettings } from "@/lib/queries";
import { PageHeader } from "@/components/admin/page-header";
import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return (
    <div>
      <PageHeader
        title="Ayarlar"
        description="WhatsApp, sosial linklər və ana səhifə mətnləri — redeploy tələb olunmur."
      />
      <SettingsForm settings={settings} />
    </div>
  );
}
