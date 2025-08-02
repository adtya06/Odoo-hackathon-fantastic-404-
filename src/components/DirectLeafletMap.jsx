import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Current location marker (blue)
const CurrentLocationIcon = L.divIcon({
  className: "current-location-marker",
  html: `
    <div style="
      width: 16px;
      height: 16px;
      background-color: #4285F4;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    "></div>
  `,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

L.Marker.prototype.options.icon = DefaultIcon;

const DirectLeafletMap = ({
  onLocationSelect,
  selectedLocation,
  height = "300px",
  showCurrentLocation = false,
  isStatic = false,
  initialZoom = 13,
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      zoomControl: !isStatic,
      dragging: !isStatic,
      touchZoom: !isStatic,
      scrollWheelZoom: !isStatic,
      doubleClickZoom: !isStatic,
      boxZoom: !isStatic,
      keyboard: !isStatic,
    }).setView([40.7128, -74.006], initialZoom);

    // Add tile layer
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
        subdomains: "abcd",
      }
    ).addTo(map);

    // Add click handler only if not static
    if (!isStatic) {
      map.on("click", (e) => {
        if (onLocationSelect) {
          const { lat, lng } = e.latlng;

          // Remove existing marker
          if (markerRef.current) {
            map.removeLayer(markerRef.current);
          }

          // Add new marker
          markerRef.current = L.marker([lat, lng]).addTo(map);

          // Call callback with location data
          onLocationSelect({
            lat,
            lng,
            address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          });
        }
      });
    }

    mapInstanceRef.current = map;
    setMapReady(true);

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update marker when selectedLocation changes
  useEffect(() => {
    if (mapInstanceRef.current && selectedLocation && mapReady) {
      // Remove existing marker
      if (markerRef.current) {
        mapInstanceRef.current.removeLayer(markerRef.current);
      }

      // Create red marker icon for static map, or choose based on showCurrentLocation for interactive map
      let icon;
      if (isStatic) {
        // Red marker for static map
        icon = L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
      } else {
        // Choose icon based on whether it's current location or selected location
        icon = showCurrentLocation ? CurrentLocationIcon : DefaultIcon;
      }

      // Add new marker
      markerRef.current = L.marker(
        [selectedLocation.lat, selectedLocation.lng],
        { icon }
      ).addTo(mapInstanceRef.current);

      // Add popup for current location (only for interactive maps)
      if (showCurrentLocation && !isStatic) {
        markerRef.current.bindPopup("📍 Your current location").openPopup();
      }

      // Center map on location
      mapInstanceRef.current.setView(
        [selectedLocation.lat, selectedLocation.lng],
        initialZoom
      );
    }
  }, [selectedLocation, mapReady, showCurrentLocation, isStatic, initialZoom]);

  return (
    <div
      ref={mapRef}
      style={{ height, width: "100%" }}
      className="rounded-lg border border-gray-300"
    />
  );
};

export default DirectLeafletMap;
