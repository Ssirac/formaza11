# FORMAZA11 ⚽

Futbol formaları üçün kataloq + brend saytı (Azərbaycan bazarı).
**Qiymət yoxdur** — hər məhsulda “WhatsApp-da soruş” CTA-sı seçilmiş forma + ölçü ilə hazır mesaj açır. Sifariş WhatsApp-da baş verir.

Next.js 16 · React 19 · TypeScript · Tailwind v4 · Prisma 7 (Postgres) · Framer Motion · Cloudinary · iron-session

---

## 🎨 Brend

- Palitra: **qara + qızıl + gümüş** (loqoya uyğun premium look)
- Şrift: **Kanit** (display, italik) + **Manrope** (mətn)
- Loqo: `public/brand/formaza11-badge.png` faylını ora at (favicon + OG üçün). Navbar-da vektor nişan (SVG) istifadə olunur, ona görə fayl olmasa belə sayt düzgün görünür.

---

## 🚀 Lokal işə salma

```bash
npm install
```

`.env` faylını doldur (nümunə: `.env.example`):

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"
ADMIN_PASSWORD="güclü-parol"
SESSION_SECRET="ən-azı-32-simvolluq-təsadüfi-string"
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

Bazanı hazırla və işə sal:

```bash
npm run db:push     # sxemi bazaya tətbiq et
npm run db:seed     # 4 kateqoriya + default ayarlar (məhsul əlavə etmir)
npm run dev         # http://localhost:3000
```

Admin panel: **http://localhost:3000/admin** → `ADMIN_PASSWORD` ilə daxil ol.

---

## 📦 Skriptlər

| Skript | İş |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | `prisma generate` + production build |
| `npm run start` | Production server |
| `npm run db:push` | Prisma sxemini bazaya tətbiq et |
| `npm run db:migrate` | Miqrasiya yarat (dev) |
| `npm run db:seed` | Kateqoriya + ayarları seed et |
| `npm run db:studio` | Prisma Studio |

---

## 🔑 Environment dəyişənləri

| Dəyişən | Təsvir |
|---|---|
| `DATABASE_URL` | Neon/Postgres bağlantı stringi |
| `ADMIN_PASSWORD` | Admin panel parolu |
| `SESSION_SECRET` | Sessiya cookie-sinin imzalanması (**32+ simvol**) |
| `CLOUDINARY_CLOUD_NAME` / `_API_KEY` / `_API_SECRET` | Admin şəkil yükləməsi (server) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Client tərəf (istəyə bağlı) |
| `NEXT_PUBLIC_SITE_URL` | Tam domen (SEO, sitemap, OG) |

> Cloudinary açarları boş olsa, admin **şəkil URL-i yapışdırmaqla** məhsul əlavə edə bilər — kod hazırdır.

---

## ☁️ Vercel + Neon deploy

1. **Neon**: [neon.tech](https://neon.tech) — pulsuz Postgres yarat, connection string-i götür.
2. **GitHub**: layihəni push et.
3. **Vercel**: “New Project” → reponu import et.
4. Vercel → Settings → Environment Variables: yuxarıdakı bütün dəyişənləri əlavə et (`NEXT_PUBLIC_SITE_URL` = real domen).
5. Deploy et. İlk deploy-dan sonra sxemi tətbiq et:
   ```bash
   # lokal maşından, prod DATABASE_URL ilə:
   npx prisma db push
   npm run db:seed
   ```
   (və ya Neon SQL editor / `prisma migrate deploy` istifadə et)
6. `/admin` → daxil ol → məhsulları əlavə et.

---

## 🗂 Struktur

```
app/
  (site)/            → public sayt (navbar + footer)
    page.tsx         → ana səhifə
    kataloq/         → kataloq (filter + axtarış)
    forma/[slug]/    → məhsul detalı
  admin/
    login/           → giriş
    (panel)/         → qorunan panel (dashboard, məhsullar, kateqoriyalar, ayarlar)
  api/track/         → klik logu (fire-and-forget)
  sitemap.ts, robots.ts, not-found.tsx
components/          → ui, site, home, product, catalog, admin, motion
lib/
  db.ts, queries.ts, admin-data.ts, session.ts, cloudinary.ts, whatsapp.ts
  actions/           → server actions (products, categories, settings, auth)
  generated/prisma/  → Prisma client (git-ignored)
prisma/schema.prisma, prisma/seed.ts
proxy.ts             → /admin/* qapısı (Next 16 “proxy” konvensiyası)
```

---

## ✅ İş məntiqi

- **Gizli məhsul** (`isHidden`) heç yerdə görünmür: ana səhifə, kataloq, axtarış, sitemap, birbaşa URL → 404.
- **WhatsApp**: `wa.me/<nömrə>?text=...` yeni tab-da açılır; əvvəlcə `POST /api/track` (bloklamadan) klik loglayır. Ölçü seçilməyibsə → çip shake + “Əvvəlcə ölçünü seç”.
- **Ayarlar** (WhatsApp nömrəsi, sosial linklər, hero mətnləri) bazadadır — redeploy tələb olunmur.
- Admin: dashboard statistikası, məhsul data-table (inline gizli/seçilmiş switch, silmə), kateqoriya CRUD + sıralama, Cloudinary şəkil yükləmə (drag-reorder).
