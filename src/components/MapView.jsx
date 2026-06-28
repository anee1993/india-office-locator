import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { haversineDistance, formatDistance } from "../utils/distance";
import { buildingCategories } from "../data/locations";

// Fix Leaflet default icon path issue with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/** Creates a custom colored SVG pin marker */
function createColoredIcon(color, emoji, isActive = false) {
  const size = isActive ? 44 : 36;
  const shadow = isActive ? `drop-shadow(0 0 6px ${color})` : "none";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 48" width="${size}" height="${size * 1.33}">
      <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 30 18 30s18-16.5 18-30C36 8.06 27.94 0 18 0z"
        fill="${color}" stroke="white" stroke-width="${isActive ? 3 : 2}"
        style="filter:${shadow}"/>
      <text x="18" y="24" text-anchor="middle" font-size="16" dominant-baseline="middle">${emoji}</text>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [size, size * 1.33],
    iconAnchor: [size / 2, size * 1.33],
    popupAnchor: [0, -(size * 1.33)],
  });
}

/** Pulse dot for user location */
function createUserIcon() {
  return L.divIcon({
    html: `<div class="user-location-marker"><div class="pulse"></div></div>`,
    className: "",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

/** Fly map to a new center/zoom — controlled by ref from outside */
function MapController({ controlRef }) {
  const map = useMap();

  useEffect(() => {
    if (controlRef) {
      controlRef.current = {
        flyTo: (lat, lon, zoom = 17) => {
          map.flyTo([lat, lon], zoom, { duration: 0.8 });
        },
        flyToCity: (center, zoom) => {
          map.flyTo(center, zoom, { duration: 1.2 });
        },
        fitPoints: (points) => {
          // points: array of [lat, lon]
          if (!points || points.length === 0) return;
          const bounds = L.latLngBounds(points);
          map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15, animate: true, duration: 1.0 });
        },
      };
    }
  }, [map, controlRef]);

  return null;
}

const MapView = forwardRef(function MapView(
  { center, zoom, buildings, userLocation, selectedCategoryId, activeId, onMarkerClick },
  ref
) {
  const controlRef = useRef(null);

  // Expose flyTo + fitPoints to parent via ref
  useImperativeHandle(ref, () => ({
    flyTo: (lat, lon, z) => controlRef.current?.flyTo(lat, lon, z),
    flyToCity: (center, z) => controlRef.current?.flyToCity(center, z),
    fitPoints: (points) => controlRef.current?.fitPoints(points),
  }));

  const category = buildingCategories.find((c) => c.id === selectedCategoryId);
  const color = category?.color ?? "#3388ff";
  const emoji = category?.icon ?? "📌";
  const userIcon = createUserIcon();

  // Fly to city when center/zoom changes from outside
  const prevCenter = useRef(null);
  useEffect(() => {
    if (
      center &&
      controlRef.current &&
      (!prevCenter.current ||
        prevCenter.current[0] !== center[0] ||
        prevCenter.current[1] !== center[1])
    ) {
      controlRef.current.flyToCity(center, zoom);
      prevCenter.current = [...center];
    }
  }, [center, zoom]);

  // Marker refs so we can open popups programmatically
  const markerRefs = useRef({});

  // When activeId changes, open that marker's popup
  useEffect(() => {
    if (activeId && markerRefs.current[activeId]) {
      markerRefs.current[activeId].openPopup();
    }
  }, [activeId]);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="map-container"
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapController controlRef={controlRef} />

      {/* User location */}
      {userLocation && (
        <>
          <Marker position={[userLocation.lat, userLocation.lon]} icon={userIcon}>
            <Popup><strong>Your Location</strong></Popup>
          </Marker>
          <Circle
            center={[userLocation.lat, userLocation.lon]}
            radius={300}
            pathOptions={{ color: "#3498db", fillColor: "#3498db", fillOpacity: 0.1, weight: 1 }}
          />
        </>
      )}

      {/* Building markers */}
      {buildings.map((b) => {
        const isActive = activeId === b.id;
        const icon = createColoredIcon(color, emoji, isActive);
        const dist = userLocation
          ? haversineDistance(userLocation.lat, userLocation.lon, b.lat, b.lon)
          : null;

        return (
          <Marker
            key={b.id}
            position={[b.lat, b.lon]}
            icon={icon}
            ref={(r) => { if (r) markerRefs.current[b.id] = r; }}
            eventHandlers={{ click: () => onMarkerClick?.(b) }}
          >
            <Popup maxWidth={280}>
              <div className="popup-content">
                <div className="popup-header">
                  <span className="popup-icon">{emoji}</span>
                  <strong>{b.name}</strong>
                </div>

                {b.address && (
                  <div className="popup-row">📍 <span>{b.address}</span></div>
                )}
                {b.phone && (
                  <div className="popup-row">📞 <a href={`tel:${b.phone}`}>{b.phone}</a></div>
                )}
                {b.openingHours && (
                  <div className="popup-row">🕐 <span>{b.openingHours}</span></div>
                )}
                {b.operator && (
                  <div className="popup-row">🏛 <span>{b.operator}</span></div>
                )}
                {dist !== null && (
                  <div className="popup-distance">
                    📏 {formatDistance(dist)} from your location
                  </div>
                )}
                {b.website && (
                  <div className="popup-row">
                    <a href={b.website} target="_blank" rel="noreferrer">🌐 Website</a>
                  </div>
                )}
                <a
                  className="popup-directions"
                  href={`https://www.google.com/maps/dir/?api=1&destination=${b.lat},${b.lon}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  🗺 Get Directions
                </a>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
});

export default MapView;
