import Link from "next/link";
import { Home, LayoutGrid } from "lucide-react";
import { BadgeMark } from "@/components/ui/logo";
import { buttonClasses } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4 text-center">
      <div className="spotlight pointer-events-none absolute inset-0" aria-hidden />
      <div className="pitch-lines pointer-events-none absolute inset-0 opacity-50" aria-hidden />

      <div className="relative">
        <div className="mx-auto mb-6 w-fit opacity-90">
          <BadgeMark className="h-16 w-16" />
        </div>
        <p className="font-display text-[24vw] font-black italic leading-none text-metal-gold sm:text-[12rem]">
          404
        </p>
        <h1 className="mt-2 font-display text-2xl font-extrabold italic text-cream sm:text-3xl">
          Bu forma oyundan çıxıb
        </h1>
        <p className="mx-auto mt-3 max-w-md text-muted">
          Axtardığın səhifə ya köçürülüb, ya da heç vaxt meydana çıxmayıb.
          Gəl səni kataloqa qaytaraq.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className={buttonClasses("gold", "md")}>
            <Home className="h-4 w-4" />
            Ana səhifə
          </Link>
          <Link href="/kataloq" className={buttonClasses("outline", "md")}>
            <LayoutGrid className="h-4 w-4" />
            Kataloq
          </Link>
        </div>
      </div>
    </div>
  );
}
