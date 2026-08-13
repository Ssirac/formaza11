"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { assertAdmin } from "@/lib/session";

export type ActionResult = { ok: boolean; error?: string };

function err(e: unknown): string {
  return e instanceof Error ? e.message : "Əməliyyat baş tutmadı";
}

/** Delete a single order-intent (ClickEvent). */
export async function deleteLead(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    await prisma.clickEvent.delete({ where: { id } });
    revalidatePath("/admin/sifarisler");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: err(e) };
  }
}

/** Delete every recorded order-intent. */
export async function clearAllLeads(): Promise<ActionResult> {
  try {
    await assertAdmin();
    await prisma.clickEvent.deleteMany({});
    revalidatePath("/admin/sifarisler");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: err(e) };
  }
}
