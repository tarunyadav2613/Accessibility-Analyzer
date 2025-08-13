const express = require("express");
const router = express.Router();
const Audit = require("../models/AuditResult");
const puppeteer = require("puppeteer");
const fs = require("fs");

// Load axe.min.js from axe-core package
const axeScript = fs.readFileSync(
  require.resolve("axe-core/axe.min.js"),
  "utf8"
);

/**
 * ✅ POST /api/audit
 * Run accessibility audit for a given URL
 */
const { url } = req.body;
if (!url) {
  return res.status(400).json({ error: "URL is required" });
}

/**
 * ✅ GET /api/audit/latest
 * Fetch recent audit results
 */
router.get("/latest", async (req, res) => {
  try {
    const latestAudit = await Audit.findOne().sort({ timestamp: -1 });
    if (!latestAudit) {
      return res.status(404).json({ message: "No audits found" });
    }
    res.json(latestAudit);
  } catch (error) {
    console.error("Error fetching latest audit:", error);
    res.status(500).json({
      error: "Failed to fetch latest audit",
      details: error.message,
    });
  }
});

module.exports = router;
