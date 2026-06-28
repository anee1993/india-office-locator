import { getStaticOfficesNearby, mergeWithStatic } from "../data/staticData";

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const SEARCH_RADIUS = 15000; // 15 km

/**
 * Build an Overpass QL query from a category's tag list
 */
function buildQuery(category, lat, lon) {
  const r = SEARCH_RADIUS;
  const stmts = [];

  for (const rule of category.overpassTags) {
    const tagStr = Object.entries(rule.tags)
      .map(([k, v]) => `["${k}"="${v}"]`)
      .join("");
    if (rule.node) stmts.push(`node${tagStr}(around:${r},${lat},${lon});`);
    if (rule.way)  stmts.push(`way${tagStr}(around:${r},${lat},${lon});`);
  }

  return `[out:json][timeout:25];\n(\n  ${stmts.join("\n  ")}\n);\nout center;`;
}

/**
 * Fetch and filter government buildings for a given category + city centre
 */
export async function fetchBuildings(category, lat, lon) {
  const query = buildQuery(category, lat, lon);

  const response = await fetch(OVERPASS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    body: `data=${encodeURIComponent(query)}`,
  });

  if (!response.ok) {
    throw new Error(`Overpass API returned ${response.status}`);
  }

  const data = await response.json();
  const parsed = parseElements(data.elements);
  const filtered = filterGovPlaces(parsed, category);

  // Merge in static curated data (fills gaps where OSM coverage is thin)
  const staticNearby = getStaticOfficesNearby(category.id, lat, lon);
  return mergeWithStatic(filtered, staticNearby);
}

/**
 * Parse OSM elements into a consistent flat format
 */
function parseElements(elements) {
  return elements
    .map((el) => {
      const lat = el.lat ?? el.center?.lat;
      const lon = el.lon ?? el.center?.lon;
      if (lat === undefined || lon === undefined) return null;

      const tags = el.tags || {};
      return {
        id: `${el.type}-${el.id}`,
        lat,
        lon,
        name: tags.name || tags["name:en"] || "Unnamed",
        address: buildAddress(tags),
        phone: tags.phone || tags["contact:phone"] || null,
        website: tags.website || tags["contact:website"] || null,
        openingHours: tags.opening_hours || null,
        operator: tags.operator || null,
        operatorType: tags["operator:type"] || null,
      };
    })
    .filter(Boolean);
}

/**
 * Filter elements to keep only government/public ones
 */
function filterGovPlaces(places, category) {
  if (!category.filterByGovKeywords) return places;

  const keywords = category.nameKeywords || defaultGovKeywords();

  return places.filter((p) => {
    if (p.operatorType === "government" || p.operatorType === "public") return true;
    if (p.operatorType === "private") return false;
    const nameLower = p.name.toLowerCase();
    return keywords.some((kw) => nameLower.includes(kw));
  });
}

function defaultGovKeywords() {
  return [
    "government", "govt", "corporation", "municipal", "district",
    "collectorate", "collector", "taluk", "tahsildar", "panchayat",
    "primary health", "community health", "phc", "chc",
    "civil hospital", "general hospital", "public hospital",
    "esi ", "esic", "medical college", "kilpauk", "jipmer", "aiims",
    "military", "army", "railway", "secretariat", "zilla",
  ];
}

function buildAddress(tags) {
  const parts = [
    tags["addr:housenumber"],
    tags["addr:street"],
    tags["addr:suburb"],
    tags["addr:city"],
    tags["addr:postcode"],
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : null;
}
