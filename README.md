# 🇮🇳 GovLocator India

An interactive map to find government offices and public facilities across Indian cities — built with React, Leaflet, and OpenStreetMap.

---

## What It Does

GovLocator India helps citizens quickly locate government buildings in their city. Select a state, pick a city, choose the type of facility you're looking for, and the app pins all matching locations on a zoomable, interactive map. Click any pin to see the facility name and a direct link to get directions via Google Maps. Address and phone details are shown where available in OpenStreetMap — static curated entries (like EPFO offices) always include full details.

---

## Features

- **10 facility categories** covering the most commonly needed government offices
- **Interactive map** powered by Leaflet and OpenStreetMap — fully zoomable and pannable
- **Live data** fetched from OpenStreetMap's Overpass API — no API key required
- **Client-side government filtering** — results are filtered by name keywords and `operator:type` tags to surface only public/government facilities
- **Static curated data** for offices with thin OSM coverage (e.g. EPFO sub-regional offices), including full address and phone details
- **Pin popups** — click any marker to see the facility name, address and phone where available, distance from your location, and a Get Directions link to Google Maps
- **Your location** — click "Use My Location" to drop a pulsing blue dot on the map
- **Distance display** — every pin popup shows straight-line distance from your current location
- **Results list panel** — all results listed alongside the map, sorted nearest-first when your location is shared
- **Click to zoom** — clicking any item in the results list flies the map to that pin and opens its popup
- **Auto fit-bounds** — when your location is known, after a search the map automatically zooms to frame your location and the 10 nearest results
- **10 states, 50 cities** pre-configured with coordinates

---

## Facility Categories

| Icon | Category | Data Source |
|------|----------|-------------|
| 🏥 | Government Hospitals | OpenStreetMap (`amenity=hospital`) |
| 🩺 | UPHC / Primary Health Centres | OpenStreetMap (`healthcare=centre`) |
| 🏛️ | PF / EPFO Offices | OpenStreetMap + static curated data |
| 📋 | Revenue Department / Tahsildar | OpenStreetMap (`office=government`) |
| 📝 | Registration Department | OpenStreetMap (`office=government`) |
| 🏪 | Ration Shops / PDS Offices | OpenStreetMap (`office=government`, TNPDS) |
| 👮 | Police Stations | OpenStreetMap (`amenity=police`) |
| 📮 | Post Offices | OpenStreetMap (`amenity=post_office`) |
| ⚖️ | Courts | OpenStreetMap (`amenity=courthouse`) |
| 🏦 | Government Banks | OpenStreetMap (`amenity=bank`) |
| 🏫 | Government Schools | OpenStreetMap (`amenity=school`) |

---

## States & Cities Covered

| State | Cities |
|-------|--------|
| Tamil Nadu | Chennai, Coimbatore, Madurai, Tiruchirappalli, Salem |
| Karnataka | Bengaluru, Mysuru, Mangaluru, Hubballi, Belagavi |
| Maharashtra | Mumbai, Pune, Nagpur, Nashik, Aurangabad |
| Telangana | Hyderabad, Warangal, Nizamabad, Karimnagar, Khammam |
| Delhi | New Delhi, Dwarka, Rohini, Noida, Gurugram |
| West Bengal | Kolkata, Howrah, Durgapur, Asansol, Siliguri |
| Gujarat | Ahmedabad, Surat, Vadodara, Rajkot, Bhavnagar |
| Rajasthan | Jaipur, Jodhpur, Udaipur, Kota, Ajmer |
| Uttar Pradesh | Lucknow, Kanpur, Agra, Varanasi, Allahabad |
| Kerala | Thiruvananthapuram, Kochi, Kozhikode, Thrissur, Kollam |

---

## Tech Stack

- **React 18** + **Vite** — frontend framework and build tool
- **Leaflet** + **react-leaflet** — interactive map rendering
- **OpenStreetMap** — map tiles (free, no API key)
- **Overpass API** — querying OSM data by location and tag
- **Browser Geolocation API** — user's current position
- **Haversine formula** — straight-line distance calculation

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app runs at `http://localhost:5173` by default.

---

## How Data Works

Results come from two sources that are merged together:

1. **OpenStreetMap via Overpass API** — a live query is made for each search within a 15 km radius of the city centre. Results are filtered client-side using name keywords (e.g. `"govt"`, `"corporation"`, `"uphc"`, `"sbi"`) and `operator:type` tags to keep only government/public facilities.

2. **Static curated data** (`src/data/staticData.js`) — for offices that are known to exist but aren't mapped in OSM yet (primarily EPFO sub-regional offices). These are merged with OSM results and duplicates within 200 m are automatically skipped.

### Known Limitations

- OSM coverage varies by city. Major cities have good data for hospitals, police stations, post offices, and schools. Smaller offices (registration, revenue) may have gaps.
- Ration shops (PDS) are sparsely mapped in OSM — only TNPDS service offices and similar district-level offices appear, not individual fair price shops.
- Distances shown are straight-line (as the crow flies), not road distances.

---

## Project Structure

```
src/
├── components/
│   ├── MapView.jsx       # Leaflet map, markers, popups
│   ├── Sidebar.jsx       # State/city/category selectors
│   └── ResultsList.jsx   # Scrollable results panel
├── data/
│   ├── locations.js      # States, cities, coordinates, category definitions
│   └── staticData.js     # Curated static office data (EPFO etc.)
├── utils/
│   ├── overpass.js       # Overpass API query builder and fetcher
│   └── distance.js       # Haversine distance, geolocation helper
├── App.jsx               # Main app state and layout
└── App.css               # All styles
```

---

## Contributing

Adding a new city is as simple as adding an entry to `cityCenters` and `statesAndCities` in `src/data/locations.js`. Adding a new facility category requires a new entry in `buildingCategories` with the appropriate OSM tags and name keywords.

For offices missing from OSM, add them to `src/data/staticData.js` under the relevant category ID.

---

## License

MIT
