"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { assertAdmin } from "@/lib/session";

export type ActionResult = { ok: boolean; error?: string };

function err(e: unknown): string {
  return e instanceof Error ? e.message : "Əməliyyat baş tutmadı";
}

/** Admin edit of the customer's phone on an order. */
export async function setLeadPhone(
  id: string,
  phone: string
): Promise<ActionResult> {
  try {
    await assertAdmin();
    const value = phone.trim().slice(0, 40) || null;
    await prisma.clickEvent.update({ where: { id }, data: { phone: value } });
    revalidatePath("/admin/sifarisler");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: err(e) };
  }
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
