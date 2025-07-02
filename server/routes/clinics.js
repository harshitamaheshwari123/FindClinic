const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/nearby", async (req, res) => {
  const { lat, lng } = req.query;
  const radius = 5000;

  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="hospital"](around:${radius},${lat},${lng});
      node["amenity"="clinic"](around:${radius},${lat},${lng});
      node["amenity"="doctors"](around:${radius},${lat},${lng});
      way["amenity"="hospital"](around:${radius},${lat},${lng});
      way["amenity"="clinic"](around:${radius},${lat},${lng});
      way["amenity"="doctors"](around:${radius},${lat},${lng});
    );
    out body;
    >;
    out skel qt;
  `;

  try {
    console.log("Fetching hospitals for coordinates:", { lat, lng });

    const response = await axios.post(
      "https://overpass-api.de/api/interpreter",
      query,
      {
        headers: { "Content-Type": "text/plain" },
      }
    );

    const enhancedData = response.data.elements
      .filter((element) => element.tags && element.tags.amenity)
      .map((element) => ({
        ...element,
        tags: {
          ...element.tags,
          name:
            element.tags.name ||
            element.tags["name:en"] ||
            "Unnamed Medical Facility",
          type: element.tags.amenity || "medical",
        },
      }));

    console.log(`Found ${enhancedData.length} medical facilities`);
    res.json(enhancedData);
  } catch (err) {
    console.error("Error fetching data:", err.message);
    res.status(500).send("Failed to fetch hospital data");
  }
});

module.exports = router;
