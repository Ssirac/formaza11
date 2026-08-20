"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Shirt,
  Tags,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Inbox,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { logoutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "İdarə paneli", icon: LayoutDashboard, exact: true },
  { href: "/admin/mehsullar", label: "Məhsullar", icon: Shirt },
  { href: "/admin/sifarisler", label: "Sifarişlər", icon: Inbox },
  { href: "/admin/kateqoriyalar", label: "Kateqoriyalar", icon: Tags },
  { href: "/admin/ayarlar", label: "Ayarlar", icon: Settings },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-1 flex-col gap-1">
      {NAV.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-gold/15 text-gold"
                : "text-muted hover:bg-surface-2 hover:text-cream"
            )}
          >
            <item.icon className="h-[18px] w-[18px]" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function Bottom() {
  return (
    <div className="mt-auto space-y-1 border-t border-line pt-3">
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-cream"
      >
        <ExternalLink className="h-[18px] w-[18px]" />
        Saytı gör
      </Link>
      <form action={logoutAction}>
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Çıxış
        </button>
      </form>
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[220px_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen flex-col gap-6 border-r border-line bg-ink-2/40 p-5 lg:flex">
        <Link href="/admin">
          <Logo showText={false} />
        </Link>
        <NavLinks />
        <Bottom />
      </aside>

      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-line bg-ink-2/40 px-4 py-3 lg:hidden">
        <Link href="/admin">
          <Logo showText={false} />
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line text-cream"
          aria-label="Menyu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-full w-72 flex-col gap-6 border-r border-line bg-ink p-5">
            <div className="flex items-center justify-between">
              <Logo showText={false} />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line text-cream"
                aria-label="Bağla"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
            <Bottom />
          </div>
        </div>
      )}

      <main className="min-w-0 p-4 sm:p-6 lg:py-8 lg:pl-6 lg:pr-5">{children}</main>
    </div>
  );
}
