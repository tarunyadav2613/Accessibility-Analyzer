import React, { useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { Moon, Sun } from 'lucide-react';

function App() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleAudit = async () => {
    if (!url) {
      toast.error('Please enter a valid URL');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/audit', { url });
      setResult(res.data);
      toast.success('Audit completed successfully!');
    } catch (err) {
      toast.error('Audit failed. Check backend console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition duration-300 p-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400">Accessibility Analyzer</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={22} /> : <Moon size={22} />}
          </button>
        </header>

        {/* Input Section */}
        <section className="max-w-2xl mx-auto flex gap-4">
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

        {/* Results */}
        {result && (
          <section className="mt-10 max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">Audit Report</h2>
            <p className="mb-2"><span className="font-medium">URL:</span> <a href={result.url} className="text-blue-500 underline" target="_blank" rel="noreferrer">{result.url}</a></p>
            <p className="mb-4"><span className="font-medium">Score:</span> {result.score} / 100</p>

            <h3 className="text-xl font-semibold mb-2">Accessibility Issues</h3>
            {result.issues.length === 0 ? (
              <p className="text-green-600">✅ No issues found!</p>
            ) : (
              <ul className="space-y-4 list-disc pl-6">
                {result.issues.map((issue, idx) => (
                  <li key={idx} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="font-semibold text-red-600 dark:text-red-400">{issue.type}</p>
                    <p className="text-sm">{issue.message}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-300">Impact: {issue.impact}</p>
                    <a
                      href={issue.help}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 text-sm underline"
                    >
                      Learn more
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default App;
