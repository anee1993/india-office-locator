/**
 * Vercel serverless function — proxies Overpass API requests.
 * Runs server-side so there are no CORS or browser-based 406 issues.
 * Tries multiple Overpass mirrors in order until one succeeds.
 */

const MIRRORS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Missing query parameter" });
  }

  const body = `data=${encodeURIComponent(query)}`;

  for (const mirror of MIRRORS) {
    try {
      const response = await fetch(mirror, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "GovLocatorIndia/1.0 (https://github.com/anee1993/india-office-locator)",
          "Accept": "*/*",
        },
        body,
        signal: AbortSignal.timeout(28000),
      });

      if (response.ok) {
        const data = await response.json();
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
        return res.status(200).json(data);
      }

      console.warn(`Mirror ${mirror} returned ${response.status}, trying next...`);
    } catch (err) {
      console.warn(`Mirror ${mirror} failed: ${err.message}, trying next...`);
    }
  }

  return res.status(502).json({ error: "All Overpass API mirrors failed. Please try again." });
}
