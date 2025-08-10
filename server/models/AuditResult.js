const mongoose = require("mongoose");

const IssueSchema = new mongoose.Schema({
  type: String,
  message: String,
  impact: String,
  help: String
}, { _id: false });

const AuditResultSchema = new mongoose.Schema({
  url: { type: String, required: true },
  score: { type: Number, required: true },
  issues: [IssueSchema], // 🔥 Use subdocument schema
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AuditResult", AuditResultSchema);
