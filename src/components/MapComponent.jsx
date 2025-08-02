import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.divIcon({
  className: "custom-div-icon",
  html: "<div style='background-color:#c30b82;' class='marker-pin'></div><i class='material-icons'>location_on</i>",
  iconSize: [30, 42],
  iconAnchor: [15, 42],
});

// Default marker fix
const defaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// User location marker (blue)
const userLocationIcon = L.divIcon({
  className: "user-location-marker",
  html: `
    <div style="
      width: 20px;
      height: 20px;
      background-color: #4285F4;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    "></div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Issue marker (red)
const issueIcon = L.divIcon({
  className: "issue-marker",
  html: `
    <div style="
      width: 12px;
      height: 12px;
      background-color: #EA4335;
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 1px 3px rgba(0,0,0,0.4);
    "></div>
  `,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

// Selected location marker (orange)
const selectedLocationIcon = L.divIcon({
  className: "selected-location-marker",
  html: `
    <div style="
      width: 25px;
      height: 40px;
      background-color: #FF6B35;
      border: 2px solid white;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    "></div>
  `,
  iconSize: [25, 40],
  iconAnchor: [12, 40],
});

// Haversine formula to calculate distance between two points
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Component to handle map clicks
const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect({ lat, lng });
    },
  });
  return null;
};

const MapComponent = ({
  onLocationSelect,
  selectedLocation,
  issues = [],
  showUserLocation = true,
  showRadiusCircle = true,
  radiusKm = 5,
  height = "400px",
  initialCenter = [20.5937, 78.9629],
  initialZoom = 5,
}) => {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nearbyIssues, setNearbyIssues] = useState([]);
  const mapRef = useRef();

  // Get user's current location
  useEffect(() => {
    if (!showUserLocation) {
      setLoading(false);
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = { lat: latitude, lng: longitude };
          setUserLocation(location);
          setLoading(false);

          // Center map on user location
          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 13);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setError(
            "Unable to get your location. Please enable location access."
          );
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  }, [showUserLocation]);

  // Filter issues within radius when user location or issues change
  useEffect(() => {
    if (!userLocation || !issues.length) {
      setNearbyIssues([]);
      return;
    }

    const issuesWithDistance = issues.map((issue) => ({
      ...issue,
      distance: calculateDistance(
        userLocation.lat,
        userLocation.lng,
        issue.coordinates.lat,
        issue.coordinates.lng
      ),
    }));

    const filtered = issuesWithDistance.filter(
      (issue) => issue.distance <= radiusKm
    );
    setNearbyIssues(filtered);
  }, [userLocation, issues, radiusKm]);

  const handleLocationSelect = (location) => {
    if (onLocationSelect) {
      onLocationSelect(location);
    }
  };

  if (loading) {
    return (
      <div
        className="flex items-center justify-center bg-gray-100 rounded-lg"
        style={{ height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Getting your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {error && (
        <div className="absolute top-4 left-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm z-[1000]">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      <MapContainer
        center={
          userLocation ? [userLocation.lat, userLocation.lng] : initialCenter
        }
        zoom={userLocation ? 13 : initialZoom}
        style={{ height, width: "100%" }}
        className="rounded-lg border border-gray-300"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          maxZoom={19}
          subdomains="abcd"
        />

        {/* Map click handler */}
        <MapClickHandler onLocationSelect={handleLocationSelect} />

        {/* User location marker and radius */}
        {userLocation && (
          <>
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={userLocationIcon}
            >
              <Popup>
                <div className="text-center">
                  <strong>Your Location</strong>
                  <br />
                  <small>
                    {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                  </small>
                </div>
              </Popup>
            </Marker>

            {/* 5km radius circle */}
            {showRadiusCircle && (
              <Circle
                center={[userLocation.lat, userLocation.lng]}
                radius={radiusKm * 1000} // Convert km to meters
                pathOptions={{
                  color: "#4285F4",
                  fillColor: "#4285F4",
                  fillOpacity: 0.1,
                  weight: 2,
                }}
              />
            )}
          </>
        )}

        {/* Selected location marker */}
        {selectedLocation && (
          <Marker
            position={[selectedLocation.lat, selectedLocation.lng]}
            icon={selectedLocationIcon}
          >
            <Popup>
              <div className="text-center">
                <strong>Selected Location</strong>
                <br />
                <small>
                  {selectedLocation.lat.toFixed(6)},{" "}
                  {selectedLocation.lng.toFixed(6)}
                </small>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Nearby issues markers */}
        {nearbyIssues.map((issue, index) => (
          <Marker
            key={issue.id || index}
            position={[issue.coordinates.lat, issue.coordinates.lng]}
            icon={issueIcon}
          >
            <Popup>
              <div className="min-w-[200px]">
                <div className="font-semibold text-gray-900 mb-2">
                  {issue.title}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {issue.description}
                </div>
                <div className="text-xs text-gray-500 border-t pt-2">
                  <div>
                    <strong>Category:</strong> {issue.category}
                  </div>
                  <div>
                    <strong>Status:</strong> {issue.status}
                  </div>
                  <div>
                    <strong>Distance:</strong> {issue.distance.toFixed(1)} km
                  </div>
                  <div>
                    <strong>Reported:</strong>{" "}
                    {new Date(issue.dateReported).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Info panel */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg text-sm z-[1000]">
        <div className="space-y-1">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span>Your Location</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span>Issues ({nearbyIssues.length})</span>
          </div>
          {selectedLocation && (
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
              <span>Selected Location</span>
            </div>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Click anywhere to select a location
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
