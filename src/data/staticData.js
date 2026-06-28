/**
 * Static dataset for offices that are poorly covered in OpenStreetMap.
 * These are merged with OSM results (duplicates are deduplicated by proximity).
 *
 * Format: { categoryId: [ { id, name, lat, lon, address, phone, website } ] }
 */
export const staticOffices = {
  pf_office: [
    // ── Tamil Nadu ──────────────────────────────────────────────────────────
    {
      id: "static-epfo-chennai-1",
      name: "EPFO Regional Office – Chennai (Narayana Pillai St)",
      lat: 13.0915,
      lon: 80.2847,
      address: "No. 37, Narayana Pillai Street, Chintadripet, Chennai – 600 002",
      phone: "044-28523596",
      website: "https://www.epfindia.gov.in",
    },
    {
      id: "static-epfo-chennai-2",
      name: "EPFO Sub Regional Office – Chennai (Gopalapuram)",
      lat: 13.0515,
      lon: 80.2650,
      address: "No. 4, Whites Road, Gopalapuram, Chennai – 600 086",
      phone: "044-28213816",
      website: "https://www.epfindia.gov.in",
    },
    {
      id: "static-epfo-chennai-3",
      name: "EPFO Sub Regional Office – Chennai (Ambattur)",
      lat: 13.1142,
      lon: 80.1548,
      address: "SIDCO Industrial Estate, Ambattur, Chennai – 600 058",
      phone: "044-26582845",
      website: "https://www.epfindia.gov.in",
    },
    {
      id: "static-epfo-coimbatore",
      name: "EPFO Sub Regional Office – Coimbatore",
      lat: 11.0045,
      lon: 76.9614,
      address: "No. 31, Race Course Road, Coimbatore – 641 018",
      phone: "0422-2220310",
      website: "https://www.epfindia.gov.in",
    },
    {
      id: "static-epfo-madurai",
      name: "EPFO Sub Regional Office – Madurai",
      lat: 9.9320,
      lon: 78.1198,
      address: "No. 2, Race Course Road, Madurai – 625 002",
      phone: "0452-2530020",
      website: "https://www.epfindia.gov.in",
    },

    // ── Karnataka ───────────────────────────────────────────────────────────
    {
      id: "static-epfo-bengaluru-1",
      name: "EPFO Regional Office – Bengaluru",
      lat: 12.9788,
      lon: 77.5996,
      address: "No. 1, EPFO Complex, Koramangala, Bengaluru – 560 034",
      phone: "080-25530015",
      website: "https://www.epfindia.gov.in",
    },
    {
      id: "static-epfo-bengaluru-2",
      name: "EPFO Sub Regional Office – Bengaluru (Rajajinagar)",
      lat: 12.9914,
      lon: 77.5540,
      address: "Rajajinagar, Bengaluru – 560 010",
      phone: "080-23155081",
      website: "https://www.epfindia.gov.in",
    },

    // ── Maharashtra ─────────────────────────────────────────────────────────
    {
      id: "static-epfo-mumbai-1",
      name: "EPFO Regional Office – Mumbai (Bandra)",
      lat: 19.0565,
      lon: 72.8360,
      address: "Bhavishya Nidhi Bhawan, Bandra East, Mumbai – 400 051",
      phone: "022-26590561",
      website: "https://www.epfindia.gov.in",
    },
    {
      id: "static-epfo-pune",
      name: "EPFO Regional Office – Pune",
      lat: 18.5314,
      lon: 73.8446,
      address: "Bhavishya Nidhi Bhawan, Pune – 411 001",
      phone: "020-26122237",
      website: "https://www.epfindia.gov.in",
    },

    // ── Telangana ───────────────────────────────────────────────────────────
    {
      id: "static-epfo-hyderabad-1",
      name: "EPFO Regional Office – Hyderabad",
      lat: 17.4065,
      lon: 78.4772,
      address: "Bhavishya Nidhi Bhawan, Secunderabad, Hyderabad – 500 003",
      phone: "040-27543939",
      website: "https://www.epfindia.gov.in",
    },

    // ── Delhi ───────────────────────────────────────────────────────────────
    {
      id: "static-epfo-delhi-1",
      name: "EPFO Regional Office – Delhi (Bhikaji Cama Place)",
      lat: 28.5684,
      lon: 77.1875,
      address: "Bhavishya Nidhi Bhawan, 14 Bhikaji Cama Place, New Delhi – 110 066",
      phone: "011-26196021",
      website: "https://www.epfindia.gov.in",
    },

    // ── West Bengal ─────────────────────────────────────────────────────────
    {
      id: "static-epfo-kolkata",
      name: "EPFO Regional Office – Kolkata",
      lat: 22.5586,
      lon: 88.3518,
      address: "Bhavishya Nidhi Bhawan, Salt Lake, Kolkata – 700 064",
      phone: "033-23591261",
      website: "https://www.epfindia.gov.in",
    },

    // ── Kerala ──────────────────────────────────────────────────────────────
    {
      id: "static-epfo-thiruvananthapuram",
      name: "EPFO Regional Office – Thiruvananthapuram",
      lat: 8.5000,
      lon: 76.9500,
      address: "Bhavishya Nidhi Bhawan, Pattom, Thiruvananthapuram – 695 004",
      phone: "0471-2548480",
      website: "https://www.epfindia.gov.in",
    },
    {
      id: "static-epfo-kochi",
      name: "EPFO Sub Regional Office – Kochi",
      lat: 9.9710,
      lon: 76.2880,
      address: "Bhavishya Nidhi Bhawan, Kochi – 682 016",
      phone: "0484-2395861",
      website: "https://www.epfindia.gov.in",
    },
  ],
};

/**
 * Returns static offices for a given category that are within ~20km of (lat, lon)
 */
export function getStaticOfficesNearby(categoryId, lat, lon) {
  const offices = staticOffices[categoryId];
  if (!offices) return [];

  return offices.filter((o) => {
    const dlat = o.lat - lat;
    const dlon = o.lon - lon;
    const distKm = Math.sqrt(dlat * dlat + dlon * dlon) * 111; // rough km
    return distKm <= 20;
  });
}

/**
 * Merge static offices into OSM results, skipping duplicates (within 200m of existing point)
 */
export function mergeWithStatic(osmResults, staticResults) {
  const merged = [...osmResults];

  for (const s of staticResults) {
    const isDuplicate = osmResults.some((o) => {
      const dlat = o.lat - s.lat;
      const dlon = o.lon - s.lon;
      return Math.sqrt(dlat * dlat + dlon * dlon) * 111000 < 200; // within 200m
    });
    if (!isDuplicate) merged.push(s);
  }

  return merged;
}
