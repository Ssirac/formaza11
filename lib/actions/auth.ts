"use server";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export type LoginState = { error: string | null };

// Simple in-memory brute-force throttle. Single-admin site → one global bucket.
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 dəqiqə
let attempts: { count: number; first: number } = { count: 0, first: 0 };

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const now = Date.now();
  // Reset the window if it has elapsed.
  if (now - attempts.first > WINDOW_MS) attempts = { count: 0, first: now };
  if (attempts.count >= MAX_ATTEMPTS) {
    const mins = Math.ceil((WINDOW_MS - (now - attempts.first)) / 60000);
    return {
      error: `Çox sayda cəhd. ${mins} dəqiqə sonra yenidən yoxlayın.`,
    };
  }

  const password = String(formData.get("password") || "");
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return { error: "ADMIN_PASSWORD təyin edilməyib (.env faylını yoxlayın)." };
  }
  if (!password) {
    return { error: "Parolu daxil edin." };
  }
  if (password !== expected) {
    attempts.count += 1;
    if (attempts.first === 0) attempts.first = now;
    // Slow down automated guessing a little.
    await new Promise((r) => setTimeout(r, 400));
    return { error: "Parol yanlışdır." };
  }

  attempts = { count: 0, first: 0 };

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
