import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

// API configuration
const API_BASE_URL = "http://localhost:5002";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

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

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "20px",
            margin: "20px",
            backgroundColor: "#ffebee",
            borderRadius: "8px",
            color: "#d32f2f",
            textAlign: "center",
          }}
        >
          <h3>Something went wrong</h3>
          <p>Please try refreshing the page</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "8px 16px",
              backgroundColor: "#d32f2f",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function ClinicsMap({ lat, lng }) {
  const [clinics, setClinics] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapKey, setMapKey] = useState(0);

  // Test server connection on component mount
  useEffect(() => {
    const testServer = async () => {
      try {
        const response = await api.get("/health");
        console.log("Server health check:", response.data);
      } catch (err) {
        console.error("Server health check failed:", err);
        setError(
          "Cannot connect to server. Please make sure the server is running on port 5002."
        );
      }
    };
    testServer();
  }, []);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching clinics for coordinates:", { lat, lng });

        const response = await api.get("/api/nearby", {
          params: { lat, lng },
        });

        console.log("Server response:", response.data);

        if (response.data && Array.isArray(response.data)) {
          // Filter out invalid clinic data
          const validClinics = response.data.filter((clinic) => {
            if (!clinic) return false;
            if (clinic.type === "node") {
              return (
                typeof clinic.lat === "number" && typeof clinic.lon === "number"
              );
            } else if (clinic.type === "way") {
              return (
                clinic.center &&
                typeof clinic.center.lat === "number" &&
                typeof clinic.center.lon === "number"
              );
            }
            return false;
          });

          setClinics(validClinics);
          if (validClinics.length === 0) {
            setError("No valid hospitals found in this area");
          }
        } else {
          setError("Invalid response format from server");
        }
      } catch (err) {
        console.error("Error fetching clinics:", err);
        if (err.code === "ERR_NETWORK") {
          setError(
            "Cannot connect to server. Please make sure the server is running on port 5002."
          );
        } else if (err.code === "ECONNABORTED") {
          setError("Request timed out. Please try again.");
        } else if (err.response) {
          setError(
            `Server error: ${err.response.status} - ${err.response.data}`
          );
        } else {
          setError("Failed to fetch hospital data. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (lat && lng) {
      fetchClinics();
    }
  }, [lat, lng]);

  // Force map re-render when coordinates change
  useEffect(() => {
    setMapKey((prev) => prev + 1);
  }, [lat, lng]);

  const containerStyle = {
    display: "flex",
    gap: "20px",
    padding: "20px",
    height: "100%",
    backgroundColor: "#f5f5f5",
  };

  const listStyle = {
    flex: "1",
    overflowY: "auto",
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "8px",
    maxHeight: "600px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  };

  const mapStyle = {
    flex: "1",
    height: "600px",
    borderRadius: "8px",
    overflow: "hidden",
    position: "relative",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  };

  const clinicCardStyle = {
    padding: "15px",
    marginBottom: "10px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: "1px solid #e0e0e0",
  };

  const selectedClinicStyle = {
    ...clinicCardStyle,
    backgroundColor: "#e3f2fd",
    border: "2px solid #2196f3",
  };

  const errorStyle = {
    color: "#d32f2f",
    padding: "20px",
    backgroundColor: "#ffebee",
    borderRadius: "8px",
    margin: "20px",
    textAlign: "center",
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        Loading hospitals...
      </div>
    );
  }

  if (error) {
    return <div style={errorStyle}>{error}</div>;
  }

  return (
    <ErrorBoundary>
      <div>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Clinics near your location
        </h2>
        <div style={containerStyle}>
          <div style={listStyle}>
            <h3 style={{ marginBottom: "20px", color: "#333" }}>
              List of Hospitals ({clinics.length})
            </h3>
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
                <h4 style={{ margin: "0 0 10px 0", color: "#d32f2f" }}>
                  {clinic.tags?.name || "Unnamed Facility"}
                </h4>
                <p style={{ margin: "5px 0", color: "#666" }}>
                  Type: {clinic.tags?.type || "Unknown"}
                </p>
                {clinic.tags?.["addr:street"] && (
                  <p style={{ margin: "5px 0", color: "#666" }}>
                    Address: {clinic.tags["addr:street"]}
                  </p>
                )}
                {clinic.tags?.phone && (
                  <p style={{ margin: "5px 0", color: "#666" }}>
                    Phone: {clinic.tags.phone}
                  </p>
                )}
              </div>
            ))}
          </div>
          <div style={mapStyle}>
            {lat && lng && (
              <MapContainer
                key={mapKey}
                center={[lat, lng]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                whenCreated={(map) => {
                  setTimeout(() => {
                    map.invalidateSize();
                  }, 100);
                }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {clinics.map((c) => {
                  if (!c) return null;

                  let clat, clng;
                  if (c.type === "node") {
                    clat = c.lat;
                    clng = c.lon;
                  } else if (c.type === "way" && c.center) {
                    clat = c.center.lat;
                    clng = c.center.lon;
                  } else {
                    return null;
                  }

                  if (typeof clat !== "number" || typeof clng !== "number") {
                    return null;
                  }

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
                          <h3
                            style={{ margin: "0 0 10px 0", color: "#d32f2f" }}
                          >
                            {c.tags?.name || "Unnamed Facility"}
                          </h3>
                          <p style={{ margin: "5px 0", color: "#666" }}>
                            Type: {c.tags?.type || "Unknown"}
                          </p>
                          {c.tags?.["addr:street"] && (
                            <p style={{ margin: "5px 0", color: "#666" }}>
                              Address: {c.tags["addr:street"]}
                            </p>
                          )}
                          {c.tags?.phone && (
                            <p style={{ margin: "5px 0", color: "#666" }}>
                              Phone: {c.tags.phone}
                            </p>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
