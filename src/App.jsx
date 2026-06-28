import { useState, useCallback, useRef } from "react";
import Sidebar from "./components/Sidebar";
import MapView from "./components/MapView";
import ResultsList from "./components/ResultsList";
import { cityCenters, buildingCategories } from "./data/locations";
import { fetchBuildings } from "./utils/overpass";
import { getUserLocation, haversineDistance } from "./utils/distance";
import "./App.css";

const DEFAULT_CENTER = [20.5937, 78.9629]; // Centre of India
const DEFAULT_ZOOM = 5;

export default function App() {
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultCount, setResultCount] = useState(null);
  const [error, setError] = useState(null);
  const [activeId, setActiveId] = useState(null);

  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);

  const mapRef = useRef(null);

  const mapCenter = selectedCity && cityCenters[selectedCity]
    ? cityCenters[selectedCity]
    : DEFAULT_CENTER;
  const mapZoom = selectedCity ? 13 : DEFAULT_ZOOM;

  const handleSearch = useCallback(async () => {
    if (!selectedCity || !selectedCategory) return;

    const coords = cityCenters[selectedCity];
    if (!coords) { setError(`Coordinates not found for ${selectedCity}`); return; }

    const category = buildingCategories.find((c) => c.id === selectedCategory);
    if (!category) return;

    setLoading(true);
    setError(null);
    setBuildings([]);
    setResultCount(null);
    setActiveId(null);

    try {
      const results = await fetchBuildings(category, coords[0], coords[1]);
      setBuildings(results);
      setResultCount(results.length);

      // If user location is known, zoom to fit user + 10 nearest results
      if (userLocation && results.length > 0) {
        const sorted = [...results].sort((a, b) => {
          const da = haversineDistance(userLocation.lat, userLocation.lon, a.lat, a.lon);
          const db = haversineDistance(userLocation.lat, userLocation.lon, b.lat, b.lon);
          return da - db;
        });
        const top10 = sorted.slice(0, 10);
        const points = [
          [userLocation.lat, userLocation.lon],
          ...top10.map((b) => [b.lat, b.lon]),
        ];
        // Small delay so markers have time to render before fitBounds
        setTimeout(() => mapRef.current?.fitPoints(points), 150);
      }
    } catch (err) {
      setError(`Failed to fetch data: ${err.message}`);
      setResultCount(0);
    } finally {
      setLoading(false);
    }
  }, [selectedCity, selectedCategory]);

  const handleLocateMe = useCallback(async () => {
    setLocating(true);
    try {
      const loc = await getUserLocation();
      setUserLocation(loc);
    } catch (err) {
      setError(`Could not get location: ${err.message}`);
    } finally {
      setLocating(false);
    }
  }, []);

  // Called when a list item or marker is clicked
  const handleSelectBuilding = useCallback((building) => {
    setActiveId(building.id);
    mapRef.current?.flyTo(building.lat, building.lon, 17);
  }, []);

  // Clicking a marker also highlights the list item
  const handleMarkerClick = useCallback((building) => {
    setActiveId(building.id);
  }, []);

  return (
    <div className="app-layout">
      <Sidebar
        selectedState={selectedState}
        setSelectedState={(s) => { setSelectedState(s); setBuildings([]); setResultCount(null); setActiveId(null); }}
        selectedCity={selectedCity}
        setSelectedCity={(c) => { setSelectedCity(c); setBuildings([]); setResultCount(null); setActiveId(null); }}
        selectedCategory={selectedCategory}
        setSelectedCategory={(c) => { setSelectedCategory(c); setBuildings([]); setResultCount(null); setActiveId(null); }}
        onSearch={handleSearch}
        loading={loading}
        resultCount={resultCount}
        userLocation={userLocation}
        onLocateMe={handleLocateMe}
        locating={locating}
      />

      <main className="map-wrapper">
        {error && (
          <div className="error-toast">
            ⚠️ {error}
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        <MapView
          ref={mapRef}
          center={mapCenter}
          zoom={mapZoom}
          buildings={buildings}
          userLocation={userLocation}
          selectedCategoryId={selectedCategory}
          activeId={activeId}
          onMarkerClick={handleMarkerClick}
        />

        {/* Results list panel — overlays bottom of map */}
        {buildings.length > 0 && !loading && (
          <ResultsList
            buildings={buildings}
            userLocation={userLocation}
            selectedCategoryId={selectedCategory}
            activeId={activeId}
            onSelect={handleSelectBuilding}
          />
        )}

        {loading && (
          <div className="map-loading-overlay">
            <div className="loading-card">
              <div className="spinner large" />
              <p>Querying OpenStreetMap…</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
