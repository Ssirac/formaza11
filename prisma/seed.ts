import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const CATEGORIES = [
  { name: "Klublar", slug: "klublar", order: 1 },
  { name: "Milli komandalar", slug: "milli-komandalar", order: 2 },
  { name: "Retro", slug: "retro", order: 3 },
];

const SETTINGS: Record<string, string> = {
  whatsappNumber: "+994777457080",
  instagramUrl: "https://instagram.com/",
  tiktokUrl: "https://tiktok.com/",
  heroTitle: "OYUN\nSƏNİN\nRƏNGLƏRİNDƏ",
  heroSubtitle:
    "Klub, milli komanda, retro və uşaq formaları. Orijinala sadiq keyfiyyət — qiymət və sifariş üçün WhatsApp-da yaz.",
};

async function main() {
  console.log("🌱 Seed başladı...");

  for (const c of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, order: c.order },
      create: c,
    });
    console.log(`  ✔ Kateqoriya: ${c.name}`);
  }

  for (const [key, value] of Object.entries(SETTINGS)) {
    await prisma.setting.upsert({
      where: { key },
      update: {}, // don't overwrite values the admin may have edited
      create: { key, value },
    });
    console.log(`  ✔ Ayar: ${key}`);
  }

  console.log("✅ Seed tamamlandı (məhsullar boş — admin paneldən əlavə et).");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
