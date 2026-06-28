import { useRef, useEffect } from "react";
import { haversineDistance, formatDistance } from "../utils/distance";
import { buildingCategories } from "../data/locations";

export default function ResultsList({
  buildings,
  userLocation,
  selectedCategoryId,
  activeId,
  onSelect,
}) {
  const category = buildingCategories.find((c) => c.id === selectedCategoryId);
  const listRef = useRef(null);
  const activeRef = useRef(null);

  // Scroll active item into view when it changes
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [activeId]);

  if (!buildings.length) return null;

  // Sort by distance if user location is available
  const sorted = userLocation
    ? [...buildings].sort((a, b) => {
        const da = haversineDistance(userLocation.lat, userLocation.lon, a.lat, a.lon);
        const db = haversineDistance(userLocation.lat, userLocation.lon, b.lat, b.lon);
        return da - db;
      })
    : buildings;

  return (
    <div className="results-panel">
      <div className="results-header">
        <span className="results-icon">{category?.icon}</span>
        <span className="results-title">
          {buildings.length} {category?.label ?? "Results"}
        </span>
        {userLocation && (
          <span className="results-hint">sorted by distance</span>
        )}
      </div>

      <ul className="results-list" ref={listRef}>
        {sorted.map((b) => {
          const dist = userLocation
            ? haversineDistance(userLocation.lat, userLocation.lon, b.lat, b.lon)
            : null;
          const isActive = activeId === b.id;

          return (
            <li
              key={b.id}
              ref={isActive ? activeRef : null}
              className={`result-item ${isActive ? "active" : ""}`}
              onClick={() => onSelect(b)}
            >
              <div className="result-item-inner">
                <div className="result-name">{b.name}</div>
                {b.address && (
                  <div className="result-address">{b.address}</div>
                )}
                {dist !== null && (
                  <div
                    className="result-dist"
                    style={{ "--cat-color": category?.color ?? "#3388ff" }}
                  >
                    {formatDistance(dist)} away
                  </div>
                )}
              </div>
              <span className="result-arrow">›</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
