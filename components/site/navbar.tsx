"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { WhatsAppIcon } from "@/components/ui/icons";
import { buildContactUrl } from "@/lib/whatsapp";
import { buttonClasses } from "@/components/ui/button";
import { StoreButtons } from "@/components/store/store-buttons";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Kataloq", href: "/kataloq" },
  { label: "Xəbərlər", href: "/xeber" },
  { label: "Necə sifariş", href: "/#nece-sifaris" },
  { label: "Ölçü bələdçisi", href: "/#olcu-beledcisi" },
  { label: "FAQ", href: "/#faq" },
];

export function Navbar({ whatsappNumber }: { whatsappNumber: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const contact = buildContactUrl(
    whatsappNumber,
    "Salam! Formaza11 haqqında məlumat almaq istəyirəm."
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-line bg-ink/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="FORMAZA11 ana səhifə"
          className="shrink-0"
          onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
            setOpen(false);
          }}
        >
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-cream"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <StoreButtons />
          <a
            href={contact}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses("gold", "sm", "hidden md:inline-flex")}
          >
            <WhatsAppIcon className="h-4 w-4" />
            Əlaqə
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line text-cream md:hidden"
            aria-label="Menyu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-ink/95 backdrop-blur-xl md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-cream hover:bg-surface-2"
              >
                {l.label}
              </Link>
            ))}
            <a
              href={contact}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses("gold", "md", "mt-2 w-full")}
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp əlaqə
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
