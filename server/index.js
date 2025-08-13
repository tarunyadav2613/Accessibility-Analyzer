const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Audit = require("./models/AuditResult"); // you need this for the /api/audit GET
const auditRoutes = require("./routes/audit");
require("dotenv").config({ path: "./mongo.env" });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ Health check & root route
app.get("/health", (_req, res) => res.status(200).send("ok"));
app.get("/", (_req, res) => res.status(200).send("Server up ✅"));

// ✅ Optional: GET list of audits
app.get("/api/audit", async (_req, res) => {
  try {
    const latest = await Audit.find().sort({ timestamp: -1 }).limit(10);
    res.json(latest);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch audits" });
  }
});

// Mount your existing routes
app.use("/api/audit", auditRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, "0.0.0.0", () => console.log("🚀 Server running on port ${PORT}"));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });