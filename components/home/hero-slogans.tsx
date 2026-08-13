"use client";

import { useEffect, useState } from "react";
import ShutterText from "@/components/ui/shutter-text";

/** Slogans cycled in the hero headline, one after another. */
const SLOGANS = [
  "FORMANI SEÇ. OYUNU YAŞA.",
  "SƏNİN KOMANDAN. SƏNİN FORMAN.",
  "MEYDANDA RƏNGİNİ GÖSTƏR.",
  "KLUBUNU ÜRƏYİNDƏ DAŞI.",
  "SƏNİN FORMAN. SƏNİN HEKAYƏN.",
  "MEYDAN SƏNİ GÖZLƏYİR.",
  "SƏDAQƏTİN RƏNGİ VAR.",
  "HƏR FORMA BİR HEKAYƏDİR.",
  "ƏFSANƏLƏRİ GEYİN.",
  "KEÇMİŞİN ƏFSANƏSİ. BUGÜNÜN STİLİ.",
];

export function HeroSlogans({ className }: { className?: string }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setI((n) => (n + 1) % SLOGANS.length),
      3800,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <ShutterText
      // Remount on each slogan so the shutter animation replays in sequence.
      key={i}
      text={SLOGANS[i]}
      trigger="auto"
      baseClassName="text-cream"
      accentClassName="text-gold"
      className={className}
    />
  );
}
