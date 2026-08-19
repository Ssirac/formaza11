// Parses a pasted jersey "spec sheet" (Team / Season / Type / Colors / …)
// and rewrites it as a formatted Azerbaijani product description with emojis.
// Returns null when the text doesn't look like a jersey spec sheet.

const COLOR_MAP: Record<string, { az: string; emoji: string }> = {
  white: { az: "Ağ", emoji: "⚪" },
  black: { az: "Qara", emoji: "⚫" },
  blue: { az: "Mavi", emoji: "🔵" },
  navy: { az: "Tünd mavi", emoji: "🔵" },
  sky: { az: "Göy", emoji: "🔵" },
  red: { az: "Qırmızı", emoji: "🔴" },
  maroon: { az: "Tünd qırmızı", emoji: "🔴" },
  green: { az: "Yaşıl", emoji: "🟢" },
  yellow: { az: "Sarı", emoji: "🟡" },
  gold: { az: "Qızılı", emoji: "🟡" },
  orange: { az: "Narıncı", emoji: "🟠" },
  purple: { az: "Bənövşəyi", emoji: "🟣" },
  brown: { az: "Qəhvəyi", emoji: "🟤" },
  grey: { az: "Boz", emoji: "⚪" },
  gray: { az: "Boz", emoji: "⚪" },
  pink: { az: "Çəhrayı", emoji: "🩷" },
  "sky blue": { az: "Göy", emoji: "🔵" },
  "light blue": { az: "Açıq mavi", emoji: "🔵" },
  "dark blue": { az: "Tünd mavi", emoji: "🔵" },
  "royal blue": { az: "Mavi", emoji: "🔵" },
  "navy blue": { az: "Tünd mavi", emoji: "🔵" },
};

const TYPE_MAP: Record<string, string> = {
  home: "Ev forması",
  away: "Səfər forması",
  third: "Üçüncü forma",
  fourth: "Dördüncü forma",
  goalkeeper: "Qapıçı forması",
  gk: "Qapıçı forması",
  special: "Özəl forma",
  fourth_kit: "Dördüncü forma",
};

const KEYS = [
  "team",
  "season",
  "type",
  "design",
  "colors",
  "brand",
  "sponsor",
  "competitions",
  "rating",
  "players",
];

const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

function normalizeSeason(raw: string): string {
  const m = raw.match(/(\d{2,4})\s*[-/]\s*(\d{2,4})/);
  if (m) {
    const full = (y: string) =>
      y.length === 4 ? y : Number(y) >= 30 ? `19${y}` : `20${y}`;
    const y1 = full(m[1]);
    const y2 = m[2].length === 4 ? m[2].slice(2) : m[2];
    return `${y1}/${y2}`;
  }
  const single = raw.match(/\b(19|20)\d{2}\b/);
  return single ? single[0] : raw;
}

function firstYear(raw: string): number | null {
  const m = raw.match(/(\d{2,4})/);
  if (!m) return null;
  const y = m[1];
  return y.length === 4 ? Number(y) : Number(y) >= 30 ? 1900 + Number(y) : 2000 + Number(y);
}

function parseColors(raw: string): { emoji: string; az: string } {
  const parts = raw
    .split(/[/,+&]| and /i)
    .map((p) => p.trim())
    .filter(Boolean);
  const emoji: string[] = [];
  const az: string[] = [];
  for (const p of parts) {
    const hit = COLOR_MAP[p.toLowerCase()];
    if (hit) {
      emoji.push(hit.emoji);
      az.push(hit.az);
    } else {
      az.push(cap(p));
    }
  }
  return { emoji: emoji.join(""), az: az.join(" / ") };
}

function formatPlayers(raw: string): string {
  let s = raw
    .replace(/\band\b/gi, "və")
    .replace(/\s*\.+\s*$/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  if (s) s += ".";
  return s;
}

export function formatJerseyDescription(raw: string): string | null {
  if (!raw || !/team/i.test(raw)) return null;

  const lines = raw
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.trim());

  const map: Record<string, string[]> = {};
  let cur: string | null = null;
  for (const line of lines) {
    if (!line) continue;
    let matched: string | null = null;
    let rest = "";
    for (const k of KEYS) {
      const mm = line.match(new RegExp("^" + k + "\\b\\s*[:\\t]?\\s*(.*)$", "i"));
      if (mm) {
        matched = k;
        rest = mm[1].trim();
        break;
      }
    }
    if (matched) {
      cur = matched;
      map[cur] = map[cur] || [];
      if (rest) map[cur].push(rest);
    } else if (cur) {
      // Skip obvious noise lines (e.g. "4.18 / 151 votes").
      if (cur === "rating") continue;
      map[cur].push(line);
    }
  }

  const team = map.team?.[0]?.trim();
  if (!team) return null;

  const seasonRaw = map.season?.[0]?.trim() ?? "";
  const season = seasonRaw ? normalizeSeason(seasonRaw) : "";
  const typeRaw = map.type?.[0]?.trim() ?? "";
  const typeAz = typeRaw ? TYPE_MAP[typeRaw.toLowerCase()] ?? cap(typeRaw) : "";
  const design = map.design?.[0]?.trim() ?? "";
  const colorsRaw = map.colors?.[0]?.trim() ?? "";
  const { emoji: colorEmoji, az: colorsAz } = colorsRaw
    ? parseColors(colorsRaw)
    : { emoji: "", az: "" };
  const brand = map.brand?.[0]?.trim() ?? "";
  const sponsorRaw = map.sponsor?.[0]?.trim() ?? "";
  const sponsor = /^[-–—]+$/.test(sponsorRaw) ? "" : sponsorRaw;
  const champions = (map.competitions ?? [])
    .filter((c) => /champion/i.test(c))
    .map((c) => c.replace(/\s*\(\s*champion\s*\)/i, "").trim());
  const players = formatPlayers((map.players ?? []).join(" "));

  const y = firstYear(seasonRaw);
  const retro = y !== null && y <= 2015 ? " Retro" : "";
  const titleType = typeAz ? ` — ${typeAz}` : "";
  const prefix = colorEmoji ? `${colorEmoji} ` : "";
  const title = `${prefix}${team}${season ? ` ${season}` : ""}${retro}${titleType}`;

  const bullets: string[] = [`🏟️ Komanda: ${team}`];
  if (season) bullets.push(`📅 Sezon: ${season}`);
  if (typeAz) bullets.push(`👕 Növ: ${typeAz}`);
  if (design) bullets.push(`🎨 Dizayn: ${design}`);
  if (colorsAz) bullets.push(`${colorEmoji} Rənglər: ${colorsAz}`);
  if (brand) bullets.push(`👕 Brend: ${brand}`);
  if (sponsor) bullets.push(`🏷️ Sponsor: ${sponsor}`);
  for (const ch of champions) bullets.push(`🏆 ${ch} — Çempion`);

  let out = `${title}\n\n${bullets.join("\n")}`;
  if (players) out += `\n\n⭐ Dövrün məşhur futbolçuları\n\n${players}`;
  return out;
}
