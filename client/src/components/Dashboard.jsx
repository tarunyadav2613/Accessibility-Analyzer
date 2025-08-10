// client/src/components/Dashboard.jsx
import React, { useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { Moon, Sun } from "lucide-react";

import GaugeScore from "./GaugeScore";
import ScoreLineChart from "./ScoreLineChart";
import IssuesDonut from "./IssuesDonut";
import MetricCards from "./MetricCards";
import IssuesTable from "./IssuesTable";

const Dashboard = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleAudit = async () => {
    if (!url) {
      toast.error("Please enter a valid URL");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/audit", { url });
      setResult(res.data);
      toast.success("Audit completed successfully!");
    } catch (err) {
      toast.error("Audit failed. Check backend console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition duration-300 p-6">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            Accessibility Analyzer
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={22} /> : <Moon size={22} />}
          </button>
        </header>

        {/* Audit Form */}
        <section className="max-w-2xl mx-auto flex gap-4 mb-10">
          <input
            type="text"
            placeholder="Enter website URL (https://example.com)"
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={handleAudit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Audit
          </button>
        </section>

        {/* Loading */}
        {loading && (
          <div className="mt-8 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
          </div>
        )}

        {/* Dashboard Panels */}
        {!loading && result && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <GaugeScore score={result?.score || 0} />
              <MetricCards result={result} />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <ScoreLineChart score={result?.score || 0} />
              <IssuesDonut issues={result?.issues || []} />
            </div>
          </div>
        )}

        {/* Results Table */}
        {result && (
          <div className="mt-10">
            <IssuesTable issues={result?.issues || []} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
