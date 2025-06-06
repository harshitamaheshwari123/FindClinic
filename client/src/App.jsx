import React, { useState } from "react";
import ClinicsMap from "./ClinicsMap";
import axios from "axios";

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
  },
  header: {
    backgroundColor: "#d32f2f",
    color: "white",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  title: {
    margin: "0",
    fontSize: "2.5rem",
    fontWeight: "bold",
  },
  subtitle: {
    margin: "10px 0 0",
    fontSize: "1.2rem",
    opacity: "0.9",
  },
  searchContainer: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    textAlign: "center",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  input: {
    padding: "12px 20px",
    fontSize: "1rem",
    border: "2px solid #d32f2f",
    borderRadius: "4px",
    width: "300px",
    outline: "none",
    transition: "all 0.3s ease",
    "&:focus": {
      borderColor: "#b71c1c",
      boxShadow: "0 0 0 2px rgba(211, 47, 47, 0.2)",
    },
  },
  button: {
    backgroundColor: "#d32f2f",
    color: "white",
    padding: "12px 24px",
    fontSize: "1rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#b71c1c",
      transform: "translateY(-1px)",
    },
    "&:active": {
      transform: "translateY(0)",
    },
  },
  errorMessage: {
    color: "#d32f2f",
    marginTop: "10px",
    fontSize: "0.9rem",
    padding: "10px",
    backgroundColor: "#ffebee",
    borderRadius: "4px",
    display: "inline-block",
  },
  loadingMessage: {
    color: "#666",
    marginTop: "10px",
    fontSize: "0.9rem",
  },
};

export default function App() {
  const [city, setCity] = useState("");
  const [pos, setPos] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!city) {
      setError("Please enter a city name");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            city,
            format: "json",
            limit: 1,
          },
        }
      );

      if (res.data.length) {
        const { lat, lon } = res.data[0];
        setPos({ lat: parseFloat(lat), lng: parseFloat(lon) });
      } else {
        setError("City not found. Please try another city name.");
      }
    } catch (err) {
      setError("Error finding city location. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Find Nearby Clinics</h1>
        <p style={styles.subtitle}>
          Search for hospitals and clinics in your city
        </p>
      </header>

      {!pos ? (
        <div style={styles.searchContainer}>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={styles.input}
            />
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Searching..." : "Find Clinics"}
            </button>
          </form>
          {error && <p style={styles.errorMessage}>{error}</p>}
          {loading && (
            <p style={styles.loadingMessage}>Searching for city location...</p>
          )}
        </div>
      ) : (
        <ClinicsMap lat={pos.lat} lng={pos.lng} />
      )}
    </div>
  );
}
