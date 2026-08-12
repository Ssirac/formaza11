import "server-only";

export type Match = {
  home: string;
  away: string;
  homeScore: string | null;
  awayScore: string | null;
  date: string;
  league: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any */

// Recent match results (factual scores/fixtures) from TheSportsDB's free API.
// Failures degrade to an empty list so the section simply hides.
async function fetchLeague(id: string): Promise<Match[]> {
  try {
    const res = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/eventspastleague.php?id=${id}`,
      { next: { revalidate: 1800 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const events: any[] = Array.isArray(data?.events) ? data.events : [];
    return events.map((e) => ({
      home: e.strHomeTeam ?? "",
      away: e.strAwayTeam ?? "",
      homeScore: e.intHomeScore ?? null,
      awayScore: e.intAwayScore ?? null,
      date: e.dateEvent ?? "",
      league: e.strLeague ?? "",
    }));
  } catch {
    return [];
  }
}

export type NewsItem = {
  title: string;
  link: string;
  date: string;
  source: string;
};

function extractTag(block: string, tag: string): string {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  let v = m ? m[1].trim() : "";
  v = v
    .replace(/^<!\[CDATA\[/, "")
    .replace(/\]\]>$/, "")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();
  return v;
}

// Latest football headlines from a public RSS feed. We show the headline,
// date and source, linking out to the original article (aggregation only).
export async function getFootballNews(limit = 8): Promise<NewsItem[]> {
  try {
    const res = await fetch(
      "https://feeds.bbci.co.uk/sport/football/rss.xml",
      { next: { revalidate: 1800 } }
    );
    if (!res.ok) return [];
    const xml = await res.text();
    const items: NewsItem[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let m: RegExpExecArray | null;
    while ((m = itemRegex.exec(xml)) && items.length < limit) {
      const block = m[1];
      const title = extractTag(block, "title");
      const link = extractTag(block, "link");
      const date = extractTag(block, "pubDate");
      if (title && link) items.push({ title, link, date, source: "BBC Sport" });
    }
    return items;
  } catch {
    return [];
  }
}

export async function getRecentMatches(limit = 6): Promise<Match[]> {
  // English Premier League (4328) + La Liga (4335) for a fuller board.
  const [epl, laliga] = await Promise.all([
    fetchLeague("4328"),
    fetchLeague("4335"),
  ]);
  const all = [...epl, ...laliga].filter(
    (m) => m.home && m.away && m.homeScore != null && m.awayScore != null
  );
  all.sort((a, b) => (a.date < b.date ? 1 : -1));
  return all.slice(0, limit);
}
