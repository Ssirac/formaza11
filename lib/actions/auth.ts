"use server";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export type LoginState = { error: string | null };

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = String(formData.get("password") || "");
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return { error: "ADMIN_PASSWORD təyin edilməyib (.env faylını yoxlayın)." };
  }
  if (!password) {
    return { error: "Parolu daxil edin." };
  }
  if (password !== expected) {
    return { error: "Parol yanlışdır." };
  }

  const session = await getSession();
  session.isAdmin = true;
  await session.save();

  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  const session = await getSession();
  session.destroy();
  redirect("/admin/login");
}
