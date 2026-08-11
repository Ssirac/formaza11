"use client";

import { useActionState } from "react";
import { Lock, LoaderCircle } from "lucide-react";
import { loginAction, type LoginState } from "@/lib/actions/auth";
import { Logo } from "@/components/ui/logo";
import { inputClass } from "@/components/ui/field";
import { buttonClasses } from "@/components/ui/button";

const initial: LoginState = { error: null };

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initial);

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <div className="spotlight pointer-events-none absolute inset-0" aria-hidden />
      <div className="pitch-lines pointer-events-none absolute inset-0 opacity-40" aria-hidden />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-2xl border border-line bg-surface/80 p-8 backdrop-blur-xl">
          <div className="mb-6 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl border border-gold/30 bg-ink-2 text-gold">
              <Lock className="h-6 w-6" />
            </span>
            <h1 className="mt-4 font-display text-2xl font-bold italic text-cream">
              Admin panel
            </h1>
            <p className="mt-1 text-sm text-muted">Davam etmək üçün daxil ol</p>
          </div>

          <form action={formAction} className="space-y-4">
            <div>
              <input
                type="password"
                name="password"
                required
                autoFocus
                placeholder="Parol"
                className={inputClass}
              />
            </div>

            {state.error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className={buttonClasses("gold", "md", "w-full")}
            >
              {pending && <LoaderCircle className="h-4 w-4 animate-spin" />}
              Daxil ol
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
