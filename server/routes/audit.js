const express = require("express");
const router = express.Router();
const Audit = require("../models/AuditResult");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

/**
 * ✅ POST /api/audit
 * Run accessibility audit for a given URL
 */
router.post("/", async (req, res) => {
  const { url } = req.body;

  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: puppeteer.executablePath(), // ✅ This tells Puppeteer where Chrome is
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

    // Inject axe.min.js
    const axePath = path.join(__dirname, "..", "axe.min.js");
    const axeScript = fs.readFileSync(axePath, "utf8");
    await page.evaluate(axeScript);

    // Run axe in browser context
    const results = await page.evaluate(async () => {
      return await axe.run();
    });

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
    res.status(500).json({ error: "Failed to perform audit" });
  }
});

/**
 * ✅ GET /api/audit
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
    res.status(500).json({ error: "Failed to fetch latest audit" });
  }
});

module.exports = router;
