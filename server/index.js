const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const auditRoutes = require("./routes/audit");
require("dotenv").config({ path: "./mongo.env" }); // Load env variables

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/audit", auditRoutes);

// Connect to MongoDB using env variable
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
