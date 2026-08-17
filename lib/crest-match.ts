import { CLUB_CRESTS, NATION_CRESTS, type Crest } from "@/lib/club-logos";

// Longest names first so "Real Madrid" wins over a shorter partial match.
const ALL: Crest[] = [...CLUB_CRESTS, ...NATION_CRESTS].sort(
  (a, b) => b.name.length - a.name.length
);

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // fold accents: ü→u, ö→o, é→e …
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Find the club/nation crest whose name appears (as a whole word run) inside a
 * jersey's name, e.g. "Real Madrid Ev 24/25" -> Real Madrid crest. Returns null
 * when nothing matches confidently.
 */
export function findCrestForName(productName: string): Crest | null {
  const hay = ` ${norm(productName)} `;
  for (const c of ALL) {
    const needle = norm(c.name);
    if (needle.length < 3) continue;
    if (hay.includes(` ${needle} `)) return c;
  }
  return null;
}
