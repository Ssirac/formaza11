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
