import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const SimpleMapTest = () => {
  return (
    <div style={{ height: "300px", width: "100%" }}>
      <MapContainer
        center={[40.7128, -74.006]} // New York City
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        className="rounded-lg border border-gray-300"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
};

export default SimpleMapTest;
