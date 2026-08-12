import type { Metadata } from "next";
import { Archivo, Manrope } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-archivo",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://formaza11.az";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FORMAZA11 — Futbol formaları",
    template: "%s · FORMAZA11",
  },
  description:
    "Klub, milli komanda, retro və uşaq futbol formaları. Premium keyfiyyət, WhatsApp ilə asan sifariş.",
  keywords: [
    "futbol forması",
    "forma mağazası",
    "klub formaları",
    "retro forma",
    "milli komanda forması",
    "Azərbaycan forma",
  ],
  openGraph: {
    type: "website",
    locale: "az_AZ",
    siteName: "FORMAZA11",
    title: "FORMAZA11 — Futbol formaları",
    description:
      "Klub, milli komanda, retro və uşaq futbol formaları. WhatsApp ilə asan sifariş.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FORMAZA11 — Futbol formaları",
    description: "Premium futbol formaları. WhatsApp ilə sifariş.",
  },
  icons: {
    icon: "/brand/formaza11-badge.png",
    apple: "/brand/formaza11-badge.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="az"
      className={`${archivo.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-cream">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{if(localStorage.getItem('formaza11-theme')==='light')document.documentElement.classList.add('light');}catch(e){}})();",
          }}
        />
        {children}
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "#17171c",
              border: "1px solid #33333d",
              color: "#f5f4f0",
            },
          }}
        />
      </body>
    </html>
  );
}
