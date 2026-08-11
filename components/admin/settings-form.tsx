"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { updateSettings } from "@/lib/actions/settings";
import { Field, inputClass, textareaClass } from "@/components/ui/field";
import { buttonClasses } from "@/components/ui/button";

export function SettingsForm({
  settings,
}: {
  settings: Record<string, string>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    whatsappNumber: settings.whatsappNumber ?? "",
    instagramUrl: settings.instagramUrl ?? "",
    tiktokUrl: settings.tiktokUrl ?? "",
    heroTitle: settings.heroTitle ?? "",
    heroSubtitle: settings.heroSubtitle ?? "",
  });

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function save() {
    startTransition(async () => {
      const res = await updateSettings(form);
      if (res.ok) {
        toast.success("Ayarlar yadda saxlanıldı");
        router.refresh();
      } else {
        toast.error(res.error ?? "Xəta baş verdi");
      }
    });
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="space-y-5 rounded-2xl border border-line bg-surface p-6">
        <h3 className="font-display text-lg font-bold italic text-cream">
          Əlaqə
        </h3>
        <Field
          label="WhatsApp nömrəsi"
          htmlFor="wa"
          hint="Beynəlxalq formatda, məs: +994777457080"
        >
          <input
            id="wa"
            value={form.whatsappNumber}
            onChange={(e) => set("whatsappNumber", e.target.value)}
            placeholder="+994XXXXXXXXX"
            className={inputClass}
          />
        </Field>
        <Field label="Instagram URL" htmlFor="ig">
          <input
            id="ig"
            value={form.instagramUrl}
            onChange={(e) => set("instagramUrl", e.target.value)}
            placeholder="https://instagram.com/formaza11"
            className={inputClass}
          />
        </Field>
        <Field label="TikTok URL" htmlFor="tt">
          <input
            id="tt"
            value={form.tiktokUrl}
            onChange={(e) => set("tiktokUrl", e.target.value)}
            placeholder="https://tiktok.com/@formaza11"
            className={inputClass}
          />
        </Field>
      </div>

      <div className="space-y-5 rounded-2xl border border-line bg-surface p-6">
        <h3 className="font-display text-lg font-bold italic text-cream">
          Ana səhifə (Hero)
        </h3>
        <Field
          label="Başlıq"
          htmlFor="ht"
          hint="Hər sətir ayrıca göstərilir (böyük tipoqrafiya)."
        >
          <textarea
            id="ht"
            value={form.heroTitle}
            onChange={(e) => set("heroTitle", e.target.value)}
            rows={3}
            className={textareaClass}
          />
        </Field>
        <Field label="Alt başlıq" htmlFor="hs">
          <textarea
            id="hs"
            value={form.heroSubtitle}
            onChange={(e) => set("heroSubtitle", e.target.value)}
            className={textareaClass}
          />
        </Field>
      </div>

      <button
        type="button"
        onClick={save}
        disabled={pending}
        className={buttonClasses("gold", "md")}
      >
        {pending && <LoaderCircle className="h-4 w-4 animate-spin" />}
        Yadda saxla
      </button>
    </div>
  );
}
