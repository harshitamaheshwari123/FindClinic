import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import axios from "axios";

// Create custom hospital icon
const hospitalIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function ClinicsMap({ lat, lng }) {
  const [clinics, setClinics] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5002/api/nearby", {
          params: { lat, lng },
        });
        if (response.data && response.data.length > 0) {
          setClinics(response.data);
        } else {
          setError("No hospitals found in this area");
        }
      } catch (err) {
        console.error("Error fetching clinics:", err);
        setError("Failed to fetch hospital data");
      } finally {
        setLoading(false);
      }
    };

    fetchClinics();
  }, [lat, lng]);

  const containerStyle = {
    display: "flex",
    gap: "20px",
    padding: "20px",
    height: "100%",
  };

  const listStyle = {
    flex: "1",
    overflowY: "auto",
    padding: "20px",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    maxHeight: "500px",
  };

  const mapStyle = {
    flex: "1",
    height: "500px",
    borderRadius: "8px",
    overflow: "hidden",
  };

  const clinicCardStyle = {
    padding: "15px",
    marginBottom: "10px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const selectedClinicStyle = {
    ...clinicCardStyle,
    backgroundColor: "#e3f2fd",
    border: "2px solid #2196f3",
  };

  if (loading) {
    return <div>Loading hospitals...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div>
      <h2>Clinics near your city location</h2>
      <div style={containerStyle}>
        <div style={listStyle}>
          <h3>List of Hospitals ({clinics.length})</h3>
          {clinics.map((clinic) => (
            <div
              key={clinic.id}
              style={
                selectedClinic?.id === clinic.id
                  ? selectedClinicStyle
                  : clinicCardStyle
              }
              onClick={() => setSelectedClinic(clinic)}
            >
              <h4>{clinic.tags.name}</h4>
              <p>Type: {clinic.tags.type}</p>
              {clinic.tags["addr:street"] && (
                <p>Address: {clinic.tags["addr:street"]}</p>
              )}
              {clinic.tags.phone && <p>Phone: {clinic.tags.phone}</p>}
            </div>
          ))}
        </div>
        <div style={mapStyle}>
          <MapContainer
            center={[lat, lng]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {clinics.map((c) => {
              const [clat, clng] =
                c.type === "node"
                  ? [c.lat, c.lon]
                  : [c.center.lat, c.center.lon];
              return (
                <Marker
                  key={c.id}
                  position={[clat, clng]}
                  icon={hospitalIcon}
                  eventHandlers={{
                    click: () => setSelectedClinic(c),
                  }}
                >
                  <Popup>
                    <div>
                      <h3>{c.tags.name}</h3>
                      <p>Type: {c.tags.type}</p>
                      {c.tags["addr:street"] && (
                        <p>Address: {c.tags["addr:street"]}</p>
                      )}
                      {c.tags.phone && <p>Phone: {c.tags.phone}</p>}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
