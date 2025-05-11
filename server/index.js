const express = require("express");
const cors = require("cors");
const clinicsRoute = require("./routes/clinics");
const app = express();

// Configure CORS with more permissive settings
app.use(
  cors({
    origin: true, // Allow all origins
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Add pre-flight OPTIONS handler
app.options("*", cors());

app.use(express.json());
app.use("/api", clinicsRoute);

const PORT = process.env.PORT || 5002;



// Add error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Add a test route to verify the server is working
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

// Add a health check route
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
