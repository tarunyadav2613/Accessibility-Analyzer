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
router.post("/", async (req, res) => {
  const { url } = req.body; // ✅ inside the function, not at the top of the file

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    console.log("Launching Puppeteer at:", process.env.PUPPETEER_EXECUTABLE_PATH);
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-zygote",
      ],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    await page.evaluate(axeScript);

    const results = await page.evaluate(async () => await axe.run());
    await browser.close();

    const audit = new Audit({
      url,
      score: Math.max(0, 100 - results.violations.length * 5),
      issues: results.violations.map((issue) => ({
        type: issue.id,
        message: issue.description,
        impact: issue.impact,
        help: issue.help,
      })),
    });

    await audit.save();
    res.json(audit);

  } catch (error) {
    console.error("Error during audit:", error);
    res.status(500).json({
      error: "Failed to perform audit",
      details: error.message,
      stack: error.stack,
    });
  }
});

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
