const express = require("express");
const router = express.Router();
const Audit = require("../models/AuditResult");
const puppeteer = require("puppeteer");
const fs = require("fs");

// Load axe.min.js from axe-core package safely
let axeScript;
try {
  axeScript = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
} catch (err) {
  console.error("❌ Failed to load axe-core script:", err);
}

router.post("/", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  let browser;
  try {
    console.log(
      "🚀 Launching Puppeteer at:",
      process.env.PUPPETEER_EXECUTABLE_PATH
    );

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-zygote",
      ],
    });

    const page = await browser.newPage();

    console.log("🌐 Navigating to: ${url}");
    await page
      .goto(url, { waitUntil: "networkidle2", timeout: 30000 })
      .catch((err) => {
        throw new Error("Navigation failed: " + err.message);
      });

    console.log("🔍 Injecting axe-core script...");
    await page.evaluate(axeScript).catch((err) => {
      throw new Error("Failed to inject axe-core: " + err.message);
    });

    console.log("📊 Running accessibility audit...");
    const results = await page
      .evaluate(async () => await axe.run())
      .catch((err) => {
        throw new Error("axe.run() failed: " + err.message);
      });

    console.log("✅ Audit completed, closing browser...");
    await browser.close();

    console.log("💾 Saving audit result...");
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
    console.error("❌ Error during audit:", error);
    if (browser) {
      try {
        await browser.close();
      } catch (_) {}
    }
    res.status(500).json({
      error: "Failed to perform audit",
      details: error.message,
    });
  }
});

router.get("/latest", async (req, res) => {
  try {
    const latestAudit = await Audit.findOne().sort({ timestamp: -1 });
    if (!latestAudit) {
      return res.status(404).json({ message: "No audits found" });
    }
    res.json(latestAudit);
  } catch (error) {
    console.error("❌ Error fetching latest audit:", error);
    res.status(500).json({
      error: "Failed to fetch latest audit",
      details: error.message,
    });
  }
});

module.exports = router;
