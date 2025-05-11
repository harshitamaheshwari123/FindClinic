const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/nearby", async (req, res) => {
  const { lat, lng } = req.query;
  const radius = 5000;

  // Updated query to include more hospital-related tags and get more details
  const query = `
    [out:json];
    (
      node["amenity"="hospital"](around:${radius},${lat},${lng});
      node["amenity"="clinic"](around:${radius},${lat},${lng});
      node["amenity"="doctors"](around:${radius},${lat},${lng});
    );
    out body;
    >;
    out skel qt;
  `;

  try {
    const response = await axios.get(
      "https://overpass-api.de/api/interpreter",
      {
        params: { data: query },
      }
    );

    // Filter and enhance the data
    const enhancedData = response.data.elements.map((element) => ({
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

    res.json(enhancedData);
  } catch (err) {
    console.error("Error fetching data:", err.message);
    res.status(500).send("Failed to fetch hospital data");
  }
});

module.exports = router;
