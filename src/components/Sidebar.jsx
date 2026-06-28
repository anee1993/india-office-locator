import { statesAndCities, buildingCategories } from "../data/locations";

export default function Sidebar({
  selectedState,
  setSelectedState,
  selectedCity,
  setSelectedCity,
  selectedCategory,
  setSelectedCategory,
  onSearch,
  loading,
  resultCount,
  userLocation,
  onLocateMe,
  locating,
}) {
  const cities = selectedState ? statesAndCities[selectedState] : [];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-logo">🇮🇳</span>
        <div>
          <h1>GovLocator India</h1>
          <p>Find government offices near you</p>
        </div>
      </div>

      <div className="sidebar-section">
        <label htmlFor="state-select">State</label>
        <select
          id="state-select"
          value={selectedState}
          onChange={(e) => {
            setSelectedState(e.target.value);
            setSelectedCity("");
          }}
        >
          <option value="">— Select State —</option>
          {Object.keys(statesAndCities).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="sidebar-section">
        <label htmlFor="city-select">City</label>
        <select
          id="city-select"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          disabled={!selectedState}
        >
          <option value="">— Select City —</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="sidebar-section">
        <label>Building Type</label>
        <div className="category-grid">
          {buildingCategories.map((cat) => (
            <button
              key={cat.id}
              className={`category-btn ${selectedCategory === cat.id ? "active" : ""}`}
              style={{
                "--cat-color": cat.color,
              }}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-label">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        className="search-btn"
        onClick={onSearch}
        disabled={!selectedCity || !selectedCategory || loading}
      >
        {loading ? (
          <>
            <span className="spinner" /> Searching…
          </>
        ) : (
          <>🔍 Search</>
        )}
      </button>

      {resultCount !== null && (
        <div className="result-badge">
          {resultCount === 0
            ? "No results found — try a different category or city"
            : `${resultCount} location${resultCount !== 1 ? "s" : ""} found`}
        </div>
      )}

      <div className="divider" />

      <div className="sidebar-section">
        <label>Your Location</label>
        {userLocation ? (
          <div className="location-status success">
            📍 Location acquired
            <br />
            <small>
              {userLocation.lat.toFixed(4)}, {userLocation.lon.toFixed(4)}
            </small>
          </div>
        ) : (
          <div className="location-status neutral">
            Location not set — distances won't show
          </div>
        )}
        <button
          className="locate-btn"
          onClick={onLocateMe}
          disabled={locating}
        >
          {locating ? (
            <>
              <span className="spinner" /> Locating…
            </>
          ) : (
            <>🎯 Use My Location</>
          )}
        </button>
      </div>
    </aside>
  );
}
