const express = require("express");
const cors = require("cors");
const clinicsRoute = require("./routes/clinics");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", clinicsRoute);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});