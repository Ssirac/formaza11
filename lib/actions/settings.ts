"use server";

import { revalidatePath, updateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { assertAdmin } from "@/lib/session";
import { SETTING_KEYS } from "@/lib/constants";
import { CACHE_TAGS } from "@/lib/queries";

export type ActionResult = { ok: boolean; error?: string };

export async function updateSettings(
  input: Record<string, string>
): Promise<ActionResult> {
  try {
    await assertAdmin();
    const entries = Object.entries(input).filter(([k]) =>
      SETTING_KEYS.includes(k)
    );
    await prisma.$transaction(
      entries.map(([key, value]) =>
        prisma.setting.upsert({
          where: { key },
          update: { value: value ?? "" },
          create: { key, value: value ?? "" },
        })
      )
    );
    updateTag(CACHE_TAGS.settings);
    revalidatePath("/");
    revalidatePath("/kataloq");
    revalidatePath("/admin/ayarlar");
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Naməlum xəta baş verdi.",
    };
  }
}
