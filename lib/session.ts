import "server-only";
import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  isAdmin?: boolean;
}

const password = process.env.SESSION_SECRET || "";

// In production a real secret is mandatory — never fall back to a known value.
if (process.env.NODE_ENV === "production" && password.length < 32) {
  throw new Error(
    "SESSION_SECRET təyin edilməyib (ən azı 32 simvol olmalıdır)."
  );
}

const sessionPassword =
  password || "dev-only-insecure-session-secret-change-me-01234567890";

export const sessionOptions: SessionOptions = {
  password: sessionPassword,
  cookieName: "formaza11_admin",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session.isAdmin === true;
}

export async function assertAdmin(): Promise<void> {
  if (!(await isAuthenticated())) {
    throw new Error("İcazə yoxdur. Zəhmət olmasa admin kimi daxil olun.");
  }
}
